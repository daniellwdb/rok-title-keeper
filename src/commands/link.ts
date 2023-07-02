import { SlashCommandBuilder } from "discord.js";
import { GovernorType, type CommandExecutionContext } from "../types.js";

export const linkCommand = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link a governor profile to your Discord user")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Governor ID")
        .setMinLength(4)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Governor type")
        .addChoices(
          ...Object.entries(GovernorType).map(([name, value]) => ({
            name,
            value,
          }))
        )
        .setRequired(true)
    )
    .toJSON(),
  execute: async ({ interaction, prisma }: CommandExecutionContext) => {
    await interaction.deferReply();

    const id = interaction.options.getString("id", true);

    const governor = await prisma.governor.findUnique({
      where: {
        id,
      },
    });

    if (!governor) {
      return interaction.followUp(
        `Could not find a governor with ID: **${id}**`
      );
    }

    const governorType = interaction.options.getString(
      "type",
      true
    ) as GovernorType;

    await prisma.governorConnection.upsert({
      where: {
        discordUserId_governorType: {
          discordUserId: interaction.user.id,
          governorType,
        },
      },
      create: {
        discordUserId: interaction.user.id,
        governorID: governor.id,
        governorType,
      },
      update: {
        governorID: governor.id,
        governorType,
      },
    });

    return interaction.followUp(
      `Succesfully linked **${governor.nickname}** (${governorType}) to your Discord user`
    );
  },
};
