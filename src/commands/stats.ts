import type { Governor } from "@prisma/client";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { GovernorType, type CommandExecutionContext } from "../types.js";

const createGovernorStatsEmbed = (governor: Governor) => {
  return new EmbedBuilder()
    .setColor("#d3b9da")
    .setTitle(`Statistics for ${governor.nickname}`)
    .addFields([
      {
        name: "Governor ID",
        value: governor.id,
        inline: true,
      },
      {
        name: "Tier 1 kp",
        value: Number(governor.tier1kp).toLocaleString("en-US"),
        inline: true,
      },
      {
        name: "Tier 2 kp",
        value: Number(governor.tier2kp).toLocaleString("en-US"),
        inline: true,
      },
      {
        name: "Tier 3 kp",
        value: Number(governor.tier3kp).toLocaleString("en-US"),
        inline: true,
      },
      {
        name: "Tier 4 kp",
        value: Number(governor.tier4kp).toLocaleString("en-US"),
        inline: true,
      },
      {
        name: "Tier 5 kp",
        value: Number(governor.tier5kp).toLocaleString("en-US"),
        inline: true,
      },
      {
        name: "Dead",
        value: Number(governor.dead).toLocaleString("en-US"),
        inline: true,
      },
      {
        name: "Resource Assistance",
        value: Number(governor.resourceAssistance).toLocaleString("en-US"),
        inline: true,
      },
    ])
    .setFooter({
      text: `Last update: ${governor.updatedAt.toLocaleString("en-US")}`,
    });
};

export const statsCommand = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View governor profile statistics")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Governor ID (Defaults to your own if not provided)")
        .setMinLength(4)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Governor type (Defaults to main)")
        .addChoices(
          ...Object.entries(GovernorType).map(([name, value]) => ({
            name,
            value,
          }))
        )
    )
    .toJSON(),
  execute: async ({ interaction, prisma }: CommandExecutionContext) => {
    await interaction.deferReply();

    const governorType = interaction.options.getString(
      "type"
    ) as GovernorType | null;

    const id = interaction.options.getString("id");

    if (id) {
      const governor = await prisma.governor.findFirst({
        where: {
          id,
        },
      });

      if (!governor) {
        return interaction.followUp(
          "No dkp stats found. Either provide the id of a governor to view it's stats or use the `/link` command to link your account. Try to contact `ZionBlood#3900` if you have under 5m KP."
        );
      }

      return interaction.followUp({
        embeds: [createGovernorStatsEmbed(governor)],
      });
    }

    const governor = await prisma.governor.findFirst({
      where: {
        governorConnections: {
          some: {
            discordUserId: interaction.user.id,
            governorType: governorType ?? GovernorType.MAIN,
          },
        },
      },
    });

    if (!governor) {
      return interaction.followUp("Could not find a governor");
    }

    return interaction.followUp({
      embeds: [createGovernorStatsEmbed(governor)],
    });
  },
};
