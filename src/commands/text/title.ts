import {
  ApplicationCommandPermissionType,
  DiscordAPIError,
  AttachmentBuilder,
  EmbedBuilder,
  Colors,
  codeBlock,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  DiscordjsError,
  DiscordjsErrorCodes,
  Message,
} from "discord.js";
import { firstValueFrom, filter } from "rxjs";
import {
  Title,
  SinnerTitle,
  BotState,
  Kingdom,
  THEME_COLOUR,
  GovernorType,
} from "../../constants.js";
import {
  rebootTaskPending$,
  pendingTitleTasks$,
  queue$,
  TaskType,
  tasks$,
  cancelTitleTimer$,
} from "../../queue.js";
import { getBotState } from "../../util/bot-state.js";
import { interpolate } from "../../util/interpolate.js";
import { isSinnerTitle } from "../../util/is-sinner-title.js";
import { sinnerTitleCommand } from "../sinner-title.js";
import { validateAndUpsertTitleInput } from "../util/validate-and-upsert-title-input.js";
import { config } from "../../config.js";
import type { AppContext } from "../../types.js";
import { titleCommand } from "../title.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const UNKNOWN_APPLICATION_COMMAND_PERMISSIONS_CODE = 10066;

export async function titleTextCommand(
  message: Message<true>,
  context: AppContext,
  command: string | undefined,
  args: string[]
) {
  const title = Object.values({ ...Title, ...SinnerTitle }).find((title) => {
    if (!command) {
      return false;
    }

    const aliases = {
      [Title.ARCHITECT]: ["arch", "architect"],
      [Title.DUKE]: ["duke"],
      [Title.JUSTICE]: ["just", "justice"],
      [Title.SCIENTIST]: ["sci", "scientist"],
      [SinnerTitle.TRAITOR]: ["trait", "traitor"],
      [SinnerTitle.BEGGAR]: ["beg", "beggar"],
      [SinnerTitle.EXILE]: ["ex", "exile"],
      [SinnerTitle.SLAVE]: ["slave"],
      [SinnerTitle.SLUGGARD]: ["slug", "sluggard"],
      [SinnerTitle.FOOL]: ["fool"],
    };

    return aliases[title].includes(command);
  }) as Title | undefined;

  if (!title) {
    return;
  }

  if (getBotState() === BotState.PAUSED) {
    return void message.reply(config.BOT_STATE_PAUSED);
  }

  if (rebootTaskPending$.value) {
    return void message.reply(config.REBOOT_PENDING);
  }

  const applicationCommands = await (process.env.NODE_ENV !== "production"
    ? message.guild
    : message.client.application
  ).commands.fetch({ cache: true });

  const applicationCommand = applicationCommands.find(
    (command) =>
      command.name ===
      (isSinnerTitle(title) ? sinnerTitleCommand.name : titleCommand.name)
  );

  try {
    const applicationCommandPermissions =
      await applicationCommand?.permissions.fetch({
        guild: message.guild.id,
      });

    const channelOverride = applicationCommandPermissions?.find(
      (permission) =>
        permission.type === ApplicationCommandPermissionType.Channel
    );

    if (channelOverride && channelOverride.id !== message.channel.id) {
      return;
    }

    const hasPermission = applicationCommandPermissions?.some(
      (permission) =>
        permission.type === ApplicationCommandPermissionType.Role &&
        message.member?.roles.cache.some((role) => role.id === permission.id)
    );

    if (!hasPermission) {
      return;
    }
  } catch (error) {
    const isUnknownApplicationCommandError =
      error instanceof DiscordAPIError &&
      error.code === UNKNOWN_APPLICATION_COMMAND_PERMISSIONS_CODE;

    if (!isUnknownApplicationCommandError) {
      context.logger.error(error);

      return;
    }
  }

  const [kingdomTypeOrGovernorTypeText, x, y, governorTypeOriginal] = args;
  const kingdomTypeOrGovernorType =
    kingdomTypeOrGovernorTypeText?.toLowerCase();

  const governorTypeMap = {
    main: GovernorType.MAIN,
    alt: GovernorType.ALT,
    farm: GovernorType.FARM,
  };

  const kingdom =
    kingdomTypeOrGovernorType === "hk"
      ? Kingdom.HOME
      : kingdomTypeOrGovernorType === "lk"
      ? Kingdom.LOST
      : undefined;

  const governorType =
    governorTypeMap[
      kingdomTypeOrGovernorType as keyof typeof governorTypeMap
    ] ??
    (governorTypeOriginal
      ? governorTypeMap[
          governorTypeOriginal?.toLowerCase() as keyof typeof governorTypeMap
        ]
      : GovernorType.MAIN);

  if (!kingdom && !governorType) {
    return void message.reply(
      `Kingdom must be one of: \`hk\` or \`lk\` or Governor type must be one of: \`main\`, \`alt\` or \`farm\`. You provided: \`${kingdomTypeOrGovernorType}\`. This message was triggered because your message started with \`${command}\` which is used to request the \`${title}\` title.`
    );
  }

  const titleInput = await validateAndUpsertTitleInput({
    discordUserId: message.author.id,
    kingdomType: kingdom,
    x: x ? Number(x) : null,
    y: y ? Number(y) : null,
    governorType: governorType,
    ...context,
  });

  if (!titleInput.ok) {
    return void message.reply(titleInput.message);
  }

  const hasPendingTitleTask = pendingTitleTasks$.value.some(
    (task) => task.discordUserId === message.author.id
  );

  if (hasPendingTitleTask) {
    return void message.reply(config.TITLE_LIMIT_MESSAGE);
  }

  const titleBuffConfiguration =
    await context.prisma.titleBuffConfiguration.findUnique({
      where: {
        title,
      },
      select: {
        ttl: true,
        locked: true,
      },
    });

  if (titleBuffConfiguration?.locked) {
    return void message.reply(
      interpolate(config.TITLE_BUFF_LOCKED_MESSAGE, { title })
    );
  }

  const ttl = titleBuffConfiguration?.ttl ?? 60;

  const kingdomId =
    config[
      titleInput.kingdomType === Kingdom.HOME ? "HOME_KINGDOM" : "LOST_KINGDOM"
    ]!;

  queue$.next({
    type: TaskType.TITLE,
    discordUserId: message.author.id,
    title,
    ttl,
    kingdomId,
    x: titleInput.x,
    y: titleInput.y,
    ...context,
  });

  const pendingTitleTasks = pendingTitleTasks$.value.filter(
    (task) => task.title === title
  );

  await message.reply(
    interpolate(config.TITLE_REQUESTED_MESSAGE, {
      title,
      length: pendingTitleTasks.length,
    })
  );

  const titleResult = await firstValueFrom(
    tasks$.pipe(
      filter(
        ({ discordUserId, type }) =>
          type === TaskType.TITLE && discordUserId === message.author.id
      )
    )
  );

  const screenshot = await context.device.screenshot();

  const embedTemplate = new EmbedBuilder()
    .setImage("attachment://screenshot.png")
    .setFooter({
      text: `📍 ${
        kingdomId === config.HOME_KINGDOM ? Kingdom.HOME : Kingdom.LOST
      } kingdom @${titleInput.x}, ${titleInput.y} (${titleInput.governorType})`,
    });

  if (!titleResult.success) {
    const errorMessage =
      titleResult.error instanceof Error && titleResult.error.message;

    if (errorMessage && errorMessage.includes("cancelled")) {
      return;
    }

    const isWrongCoordinatesErrorMessage =
      errorMessage && errorMessage.includes("wrong coordinates");

    const description = isWrongCoordinatesErrorMessage
      ? "Click on your city and make sure you use the X and Y coordinates displayed like the image below."
      : `Something went wrong while requesting your title. Please try again.${
          errorMessage ? `\n${codeBlock(errorMessage)}` : ""
        }`;

    const coordsGuideImage = await readFile(
      join(process.cwd(), "assets", "images", "coords-guide.jpg")
    );

    return void message.reply({
      content: message.author.toString(),
      files: [
        new AttachmentBuilder(
          isWrongCoordinatesErrorMessage ? coordsGuideImage : screenshot,
          {
            name: "screenshot.png",
            description: "screenshot",
          }
        ),
      ],
      embeds: [embedTemplate.setColor(Colors.Red).setDescription(description)],
      failIfNotExists: false,
    });
  }

  const doneButton = new ButtonBuilder()
    .setCustomId("title-done-button")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("⏱️")
    .setLabel("Done");

  const successMessage = await message.channel.send({
    files: [
      new AttachmentBuilder(screenshot, {
        name: "screenshot.png",
        description: "screenshot",
      }),
    ],
    content: message.author.toString(),
    embeds: [
      embedTemplate
        .setColor(THEME_COLOUR)
        .setDescription(
          interpolate(config.TITLE_RECEIVED_MESSAGE, { title, ttl })
        ),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(doneButton),
    ],
  });

  try {
    await successMessage.awaitMessageComponent({
      filter: async (componentInteraction) => {
        await componentInteraction.deferUpdate();

        return (
          componentInteraction.user.id === message.author.id ||
          config.MARK_DONE_USER_IDS.includes(componentInteraction.user.id)
        );
      },
      time: ttl * 1000,
    });

    cancelTitleTimer$.next(message.author.id);
  } catch (error) {
    if (
      error instanceof DiscordjsError &&
      error.code === DiscordjsErrorCodes.InteractionCollectorError
    ) {
      return;
    }

    throw error;
  } finally {
    await successMessage.edit({
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          doneButton
            .setDisabled(true)
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅")
        ),
      ],
    });
  }
}
