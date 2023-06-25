import { SlashCommandBuilder, Colors } from "discord.js";
import { Title, type CommandExecutionContext } from "../types.js";

export const configureTitleCommand = {
  data: new SlashCommandBuilder()
    .setName("configure-title")
    .setDescription("Configure a title")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title to configure")
        .setChoices(
          ...Object.values(Title).map((title) => ({
            name: title,
            value: title,
          }))
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("ttl")
        .setDescription("Amount of seconds a title should last")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("locked")
        .setDescription("Whether or not the title should be locked")
        .setRequired(true)
    )
    .toJSON(),
  execute: async ({ interaction, prisma }: CommandExecutionContext) => {
    await interaction.deferReply();

    const title = interaction.options.getString("title", true) as Title;
    const ttl = interaction.options.getInteger("duration", true);
    const locked = interaction.options.getBoolean("locked", true);

    await prisma.titleConfiguration.upsert({
      where: {
        title,
      },
      create: {
        title,
        ttl,
        locked,
      },
      update: {
        ttl,
        locked,
      },
    });

    const titleConfigurations = await prisma.titleConfiguration.findMany();

    const titleConfigurationsWithDefaultsFields = Object.values(Title).map(
      (title) => {
        const titleConfiguration = titleConfigurations.find(
          (titleConfiguration) => (titleConfiguration.title as Title) === title
        );

        return {
          name: title,
          value: `Locked: ${
            titleConfiguration?.locked ? "yes" : "no"
          }\nDuration: ${titleConfiguration?.ttl ?? 60} seconds`,
        };
      }
    );

    return interaction.followUp({
      embeds: [
        {
          title: "Title configurations",
          color: Colors.DarkGold,
          fields: titleConfigurationsWithDefaultsFields,
        },
      ],
    });
  },
};
