import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { createCommand } from "./util/create-command.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Governor } from "@prisma/client";
import { getKvkStats } from "./util/get-kvk-stats.js";
import { THEME_COLOUR } from "../constants.js";

export const kvkLeaderBoardCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "kvk-leaderboard",
  description: "View the KvK leaderboard",
  async execute(interaction, { prisma }) {
    await interaction.deferReply();

    const governors = await prisma.governor.findMany({
      include: {
        governorConnections: true,
      },
    });

    const startingGovernors = await readFile(
      join(process.cwd(), "assets", "kvk.json"),
      "utf8"
    );

    const startingGovernorsParsed = JSON.parse(startingGovernors) as Governor[];

    const governorsWithKvkStats = governors
      .map((governor) => {
        const oldGovernor = startingGovernorsParsed.find(
          (startingGovernor) => startingGovernor.id === governor.id
        );

        if (!oldGovernor) {
          return undefined;
        }

        return getKvkStats(oldGovernor, governor);
      })
      .filter((value): value is ReturnType<typeof getKvkStats> =>
        Boolean(value)
      )
      .sort((a, b) => Number(b.currentDkp) - Number(a.currentDkp));

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(THEME_COLOUR)
          .setTitle("KvK leaderboard")
          .addFields(
            governorsWithKvkStats
              .slice(0, 10)
              .map((governorWithKvkStats, i) => ({
                name: `#${i + 1} ${governorWithKvkStats.nickname}`,
                value: `${governorWithKvkStats.currentDkp} DKP (${governorWithKvkStats.percentageTowardsDkpGoal} towards DKP goal)`,
              }))
          ),
      ],
    });
  },
});
