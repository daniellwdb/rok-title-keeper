import { ApplicationCommandType } from "discord.js";
import fetch from "node-fetch";
import { createCommand } from "./util/create-command.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Governor } from "@prisma/client";
import { getKvkStats } from "./util/get-kvk-stats.js";
import { CONFIG_SERVER_URL, UNAUTHORIZED_STATUS } from "../constants.js";

export const publishStatsCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "publish-stats",
  description: "Publish governor and KvK statistics",
  async execute(interaction, { prisma }) {
    await interaction.deferReply();

    const governors = await prisma.governor.findMany({
      select: {
        id: true,
        nickname: true,
        alliance: true,
        power: true,
        killPoints: true,
        tier1Kills: true,
        tier2Kills: true,
        tier3Kills: true,
        tier4Kills: true,
        tier5Kills: true,
        dead: true,
        resourceAssistance: true,
      },
      take: 500,
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
      );

    const response = await fetch(`${CONFIG_SERVER_URL}/publish-stats`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        serverId: interaction.guild.id,
        governorStatistics: governors,
        governorKvKStatitics: governorsWithKvkStats,
      }),
    });

    if (response.status === UNAUTHORIZED_STATUS) {
      return void interaction.followUp(
        "Your server does not have permission to publish statistics. Please visit https://discord.gg/dAa4axurq7 to enable this option."
      );
    }

    return void interaction.followUp(
      `Statistics have been published. View the page at: https://roka.vercel.app/stats/${interaction.guild.id}.`
    );
  },
});
