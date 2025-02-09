import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  DiscordjsError,
  DiscordjsErrorCodes,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { firstValueFrom, first } from "rxjs";
import {
  TaskType,
  cancelTitleTimer$,
  pendingTitleTasks$,
  queue$,
  tasks$,
} from "../queue.js";
import { GovernorType, Kingdom, THEME_COLOUR, Title } from "../constants.js";
import { commandOptions } from "./util/command-options.js";
import { validateAndUpsertTitleInput } from "./util/validate-and-upsert-title-input.js";
import { config } from "../config.js";
import { interpolate } from "../util/interpolate.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const OPTION_TITLE_NAME = "title";
const OPTION_KINGDOM_NAME = "kingdom";
const OPTION_X_COORDINATE_NAME = "x-coordinate";
const OPTION_Y_COORDINATE_NAME = "y-coordinate";
const OPTION_GOVERNOR_TYPE_NAME = "type";

export const titleCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "title",
  description: "Request a title buff",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_TITLE_NAME,
      description: "The title buff you want to request",
      choices: commandOptions(Title),
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_KINGDOM_NAME,
      description: "The kingdom your city is located in",
      choices: commandOptions(Kingdom),
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: OPTION_X_COORDINATE_NAME,
      description: "The x-coordinate of your city",
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: OPTION_Y_COORDINATE_NAME,
      description: "The y-coordinate of your city",
    },
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_GOVERNOR_TYPE_NAME,
      description: "Governor type (default to main)",
      choices: commandOptions(GovernorType),
    },
  ],
  async execute(interaction, context) {
    await interaction.deferReply();

    const title = interaction.options.getString(
      OPTION_TITLE_NAME,
      true
    ) as Title;

    const kingdom = interaction.options.getString(
      OPTION_KINGDOM_NAME,
      true
    ) as Kingdom;

    const x = interaction.options.getInteger(OPTION_X_COORDINATE_NAME);
    const y = interaction.options.getInteger(OPTION_Y_COORDINATE_NAME);
    const governorType = (interaction.options.getString("type") ??
      GovernorType.MAIN) as GovernorType;

    const titleInput = await validateAndUpsertTitleInput({
      discordUserId: interaction.user.id,
      kingdomType: kingdom,
      x,
      y,
      governorType,
      ...context,
    });

    if (!titleInput.ok) {
      return void interaction.followUp(titleInput.message);
    }

    const kingdomId =
      config[
        titleInput.kingdomType === Kingdom.HOME
          ? "HOME_KINGDOM"
          : "LOST_KINGDOM"
      ]!;

    const hasPendingTitleTask = pendingTitleTasks$.value.some(
      (task) => task.discordUserId === interaction.user.id
    );

    if (hasPendingTitleTask) {
      return void interaction.followUp(config.TITLE_LIMIT_MESSAGE);
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
      return void interaction.followUp(
        interpolate(config.TITLE_BUFF_LOCKED_MESSAGE, { title })
      );
    }

    const ttl = titleBuffConfiguration?.ttl ?? 60;

    queue$.next({
      type: TaskType.TITLE,
      discordUserId: interaction.user.id,
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

    await interaction.followUp(
      interpolate(config.TITLE_REQUESTED_MESSAGE, {
        title,
        length: pendingTitleTasks.length,
      })
    );

    const titleResult = await firstValueFrom(
      tasks$.pipe(
        first(
          ({ discordUserId, type }) =>
            type === TaskType.TITLE && discordUserId === interaction.user.id
        )
      )
    );

    const screenshot = await context.device.screenshot();

    const embedTemplate = new EmbedBuilder()
      .setImage("attachment://screenshot.png")
      .setFooter({
        text: `📍 ${
          kingdomId === config.HOME_KINGDOM ? Kingdom.HOME : Kingdom.LOST
        } kingdom @${titleInput.x}, ${titleInput.y} (${
          titleInput.governorType
        })`,
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

      return void interaction.followUp({
        content: interaction.user.toString(),
        files: [
          new AttachmentBuilder(
            isWrongCoordinatesErrorMessage ? coordsGuideImage : screenshot,
            {
              name: "screenshot.png",
              description: "screenshot",
            }
          ),
        ],
        embeds: [
          embedTemplate.setColor(Colors.Red).setDescription(description),
        ],
      });
    }

    const doneButton = new ButtonBuilder()
      .setCustomId("title-done-button")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("⏱️")
      .setLabel("Done");

    const successMessage = await interaction.channel!.send({
      files: [
        new AttachmentBuilder(screenshot, {
          name: "screenshot.png",
          description: "screenshot",
        }),
      ],
      content: interaction.user.toString(),
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
            componentInteraction.user.id === interaction.user.id ||
            config.MARK_DONE_USER_IDS.includes(componentInteraction.user.id)
          );
        },
        time: ttl * 1000,
      });

      cancelTitleTimer$.next(interaction.user.id);
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
  },
});
