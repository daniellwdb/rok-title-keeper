import { SlashCommandBuilder } from "discord.js";
import { scanGovernorStats } from "../scan-governor-stats.js";
import type { CommandExecutionContext } from "../types.js";

export const scanCommand = {
  data: new SlashCommandBuilder()
    .setName("scan")
    .setDescription("Start a scan to track statistics")
    .addIntegerOption((option) =>
      option
        .setName("top")
        .setDescription("Amount of players to scan")
        .setMinValue(2)
        .setMaxValue(999)
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("new-kvk")
        .setDescription("Whether to start a new KvK")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("reset-power")
        .setDescription("Whether to reset power")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("reset-kp")
        .setDescription("Whether to reset kp and deads")
        .setRequired(true)
    )
    .toJSON(),
  execute: async ({ interaction, prisma, device }: CommandExecutionContext) => {
    const top = interaction.options.getInteger("top") ?? 10;
    const resetPower = interaction.options.getBoolean("reset-power", true);
    const newKvK = interaction.options.getBoolean("new-kvk", true);
    const resetKp = interaction.options.getBoolean("reset-kp", true);

    await interaction.reply(
      `Scanning top **${top}** governor profiles. This might take a while`
    );

    await scanGovernorStats(device, top, prisma, newKvK, resetPower, resetKp);

    return interaction.channel?.send(
      "Finished scanning. A new scan can be started by using the `/scan` command "
    );
  },
};
