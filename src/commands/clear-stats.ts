import { ApplicationCommandType } from "discord.js";
import { createCommand } from "./util/create-command.js";

export const clearStatsCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "clear-stats",
  description: "Clear governor statistics",
  async execute(interaction, { prisma }) {
    await interaction.deferReply();

    const result = await prisma.governor.deleteMany();

    return void interaction.followUp(
      `Successfully cleared the statistics of ${result.count} governors.`
    );
  },
});
