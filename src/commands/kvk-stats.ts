import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { GovernorType, type CommandExecutionContext } from "../types.js";
import { calculateDkp } from "../util/calculate-dkp.js";

export const kvkStatsCommand = {
  data: new SlashCommandBuilder()
    .setName("kvk-stats")
    .setDescription("View KvK statistics")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Governor type (Defaults to main)")
        .addChoices(
          ...Object.entries(GovernorType).map(([name, value]) => ({
            name,
            value,
          })),
        ),
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Governor ID (Defaults to your own if not provided)")
        .setMinLength(4),
    )
    .toJSON(),
  execute: async ({ interaction, prisma }: CommandExecutionContext) => {
    await interaction.deferReply();

    const governorType =
      interaction.options.getString("type") ?? GovernorType.MAIN;

    const id = interaction.options.getString("id");

    const governorDkps = await prisma.governorDKP.findMany({
      include: {
        governor: {
          include: {
            governorConnections: true,
          },
        },
      },
    });

    const governorDkp = governorDkps.find((governorDkp) =>
      id
        ? governorDkp.governor.id === id
        : governorDkp.governor.governorConnections.some(
            (governorConnection) =>
              governorConnection.discordUserId === interaction.user.id &&
              governorConnection.governorType === governorType,
          ),
    );

    if (!governorDkp) {
      return interaction.followUp(
        "No dkp stats found. Either provide the id of a governor to view it's stats or use the `/link` command to link your account.",
      );
    }

    const dkpSorted = governorDkps
      .map(calculateDkp)
      .sort((a, b) => b.dkp - a.dkp);

    const dkp = dkpSorted.find(
      (dkp) => dkp.governorID === governorDkp.governorID,
    );

    if (!dkp) {
      throw new Error("No dkp.");
    }

    const embed = new EmbedBuilder()
      .setColor("#d3b9da")
      .setTitle(`KvK stats for ${dkp.name}`)
      .addFields([
        {
          name: "Governor ID",
          value: dkp.governorID,
          inline: true,
        },
        {
          name: "Rank",
          value: `#${
            dkpSorted.findIndex(
              ({ governorID }) => governorID === dkp.governorID,
            ) + 1
          }`,
          inline: true,
        },
        {
          name: "Power",
          value: dkp.power,
          inline: true,
        },
        {
          name: "Power difference",
          value: dkp.powerDifference,
          inline: true,
        },
        {
          name: "Tier 4 kp gained",
          value: dkp.tier4kpDifference,
          inline: true,
        },
        {
          name: "Tier 5 kp gained",
          value: dkp.tier5kpDifference,
          inline: true,
        },
        {
          name: "Dead gained",
          value: dkp.deadDifference,
          inline: true,
        },
        {
          name: "DKP",
          value: dkp.dkp.toString(),
          inline: true,
        },
        {
          name: "DKP goal",
          value: dkp.dkpNeeded.toString(),
          inline: true,
        },
        {
          name: "Dead requirement",
          value: `${dkp.deadRequirement}`,
          inline: true,
        },
        {
          name: "Goal reached",
          value: `${
            dkp.percentageTowardsGoal > 100 ? 100 : dkp.percentageTowardsGoal
          }%`,
          inline: true,
        },
      ])
      .setFooter({
        text: `Last update: ${governorDkp.createdAt.toLocaleString("en-US")}`,
      });

    return interaction.followUp({ embeds: [embed] });
  },
};
