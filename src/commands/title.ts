/* eslint-disable @typescript-eslint/restrict-template-expressions */

import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { firstValueFrom, filter, first } from "rxjs";
import {
  cancel$,
  requestTitle$,
  titleQueueCounts$,
  titleRequestsQueue$,
} from "../queue.js";
import { Title, type Command, Kingdom } from "../types.js";

export const titleCommand = {
  data: new SlashCommandBuilder()
    .setName("title")
    .setDescription("Request a title")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title you would like to request")
        .setChoices(
          ...Object.values(Title).map((title) => ({
            name: title,
            value: title,
          }))
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("kingdom")
        .setDescription("The kingdom your city is located in")
        .setChoices(
          ...Object.values(Kingdom).map((kingdom) => ({
            name: kingdom,
            value: kingdom,
          }))
        )
    )
    .addIntegerOption((option) =>
      option.setName("x").setDescription("The x-coordinate of your city")
    )
    .addIntegerOption((option) =>
      option.setName("y").setDescription("The y-coordinate of your city")
    )
    .toJSON(),
  execute: async ({ interaction, device, prisma, logger }) => {
    if (!interaction.channel) {
      throw new Error("Could not find interaction channel.");
    }

    await interaction.deferReply();

    const title = interaction.options.getString("title", true) as Title;
    const kingdom = interaction.options.getString("kingdom") as Kingdom | null;
    const x = interaction.options.getInteger("x");
    const y = interaction.options.getInteger("y");

    const titleConfiguration = await prisma.titleConfiguration.findUnique({
      where: {
        title,
      },
    });

    if (titleConfiguration?.locked) {
      return interaction.followUp(`The ${title} title is currently locked.`);
    }

    const hasPendingTitleRequest = Object.values(titleQueueCounts$.value).some(
      (pendingDiscordUserIds) =>
        pendingDiscordUserIds.includes(interaction.user.id)
    );

    if (hasPendingTitleRequest) {
      return interaction.followUp("You can only request 1 title at a time.");
    }

    await interaction.followUp(
      `You requested the ${title} title. Your position in the queue is: ${
        titleQueueCounts$.value[title].length + 1
      }`
    );

    // TODO: refactor title request history
    const titleRequests = await prisma.titleRequest.findMany({
      where: {
        discordUserId: BigInt(interaction.user.id),
      },
    });

    const hasProvidedCoordinates = x && y;

    if (!kingdom && !hasProvidedCoordinates && !titleRequests.length) {
      return interaction.followUp(
        "You have not requested a title yet. Please provide a kingdom and coordinates."
      );
    }

    if (hasProvidedCoordinates && !kingdom) {
      return interaction.followUp(
        "You must provide a kingdom when providing coordinates."
      );
    }

    if (kingdom && !hasProvidedCoordinates) {
      const requestedTitleForKingdom = titleRequests.some(
        (titleRequest) => (titleRequest.kingdom as Kingdom) === kingdom
      );

      if (!requestedTitleForKingdom) {
        return interaction.followUp(
          `You have not requested a title for your ${kingdom} kingdom yet. Please provide the coordinates.`
        );
      }
    }

    const latestTitleRequest = kingdom
      ? titleRequests.find(
          (titleRequest) => (titleRequest.kingdom as Kingdom) === kingdom
        )
      : titleRequests.at(-1);

    const kingdomForTitleRequest = kingdom ?? latestTitleRequest?.kingdom;

    const lastInsertedTitleRequest = await prisma.titleRequest.create({
      data: {
        discordUserId: BigInt(interaction.user.id),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kingdom: kingdomForTitleRequest!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        x: x ?? latestTitleRequest!.x,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        y: y ?? latestTitleRequest!.y,
      },
      select: {
        kingdom: true,
        x: true,
        y: true,
      },
    });

    const titleTtl = titleConfiguration?.ttl ?? 60;

    requestTitle$.next({
      device,
      title,
      logger,
      kingdom: lastInsertedTitleRequest.kingdom as Kingdom,
      x: lastInsertedTitleRequest.x,
      y: lastInsertedTitleRequest.y,
      discordUserId: interaction.user.id,
      titleTtl,
    });

    const titleRequestResult = await firstValueFrom(
      titleRequestsQueue$.pipe(
        filter(({ discordUserId }) => discordUserId === interaction.user.id),
        first()
      )
    );

    const files = [
      new AttachmentBuilder(await device.screenshot(), {
        name: "screenshot.jpg",
        description: "Rise of Kingdoms screenshot",
      }),
    ];

    const embedTemplate = new EmbedBuilder()
      .setColor(Colors.DarkGold)
      .setTitle(`${title} title requested by ${interaction.member.displayName}`)
      .setImage("attachment://screenshot.jpg")
      .setFooter({ text: `📍 ${kingdom} kingdom @${x}, ${y}` });

    if (!titleRequestResult.success) {
      return interaction.channel.send({
        files,
        content: `${interaction.user}, unable to process your title request.`,
        embeds: [
          embedTemplate.setDescription(
            titleRequestResult.error?.message
              ? titleRequestResult.error.message
              : null
          ),
        ],
      });
    }

    const doneButton = new ButtonBuilder()
      .setCustomId("title-done-button")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("⏱️")
      .setLabel("Done");

    const successMessage = await interaction.channel.send({
      files,
      content: `${interaction.user}, you received the ${title} title for ${titleTtl} seconds. Please press "Done" when you're finished.`,
      embeds: [embedTemplate],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(doneButton),
      ],
    });

    try {
      await successMessage.awaitMessageComponent({
        filter: async (componentInteraction) => {
          await componentInteraction.deferUpdate();

          return componentInteraction.user.id === interaction.user.id;
        },
        time: titleTtl * 1000,
      });

      cancel$.next({ discordUserId: interaction.user.id });
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
} satisfies Command;
