import { ApplicationCommandType } from "discord.js";
import { createCommand } from "./util/create-command.js";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

export const newKvkCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "new-kvk",
  description: "Start a new KvK",
  async execute(interaction, context) {
    await interaction.deferReply();

    const governors = await context.prisma.governor.findMany();

    await writeFile(
      join(process.cwd(), "assets", "kvk.json"),
      JSON.stringify(governors),
      "utf8"
    );

    interaction.followUp(
      "New KvK started using current statistics as a starting point. If this was a mistake, please run the `/scan` command to update the statistics and `/new-kvk` afterwards.\nYou can update KvK progress by running the `/scan` command again."
    );
  },
});
