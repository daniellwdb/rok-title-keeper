import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { commandOptions } from "./util/command-options.js";
import { GovernorType, THEME_COLOUR } from "../constants.js";
import { config } from "../config.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Governor } from "@prisma/client";
import { getKvkStats } from "./util/get-kvk-stats.js";

const OPTION_GOVERNOR_ID_NAME = "id";
const OPTION_GOVERNOR_TYPE_NAME = "type";
const OPTION_STATS_TYPE_NAME = "stats";

export const viewStatsCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "view-stats",
  description: "View statistics",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_STATS_TYPE_NAME,
      description: "The type of statistics you want to view",
      choices: [
        {
          name: "Profile",
          value: "profile",
        },
        {
          name: "KvK",
          value: "kvk",
        },
      ],
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_GOVERNOR_ID_NAME,
      description: "ID of the governor profile",
    },
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_GOVERNOR_TYPE_NAME,
      description: "Governor type",
      choices: commandOptions(GovernorType),
    },
  ],
  async execute(interaction, { prisma }) {
    await interaction.deferReply();

    const governorType = interaction.options.getString(
      "type"
    ) as GovernorType | null;

    const id = interaction.options.getString("id") as GovernorType | null;

    const statsType = interaction.options.getString(
      OPTION_STATS_TYPE_NAME,
      true
    ) as "profile" | "kvk";

    const governors = await prisma.governor.findMany({
      include: {
        governorConnections: true,
      },
    });

    const governor = governors.find((governor) => {
      if (governorType) {
        return id
          ? governor.id === id &&
              governor.governorConnections.some(
                (governorConnection) =>
                  governorConnection.governorType ===
                  (governorType ?? GovernorType.MAIN)
              )
          : governor.governorConnections.some(
              (governorConnection) =>
                governorConnection.discordUserId === interaction.user.id &&
                governorConnection.governorType ===
                  (governorType ?? GovernorType.MAIN)
            );
      }

      return id
        ? governor.id === id
        : governor.governorConnections.some(
            (governorConnection) =>
              governorConnection.discordUserId === interaction.user.id
          );
    });

    if (!governor) {
      return void interaction.followUp(config.GOVERNOR_NOT_FOUND_MESSAGE);
    }

    if (statsType === "profile") {
      return void interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(THEME_COLOUR)
            .setTitle(`Profile statistics for ${governor.nickname}`)
            .addFields([
              {
                name: "Governor ID",
                value: governor.id.toString(),
                inline: true,
              },
              ...(governor.alliance
                ? [
                    {
                      name: "Alliance",
                      value: governor.alliance,
                      inline: true,
                    },
                  ]
                : []),
              {
                name: "Power",
                value: Number(governor.power).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Kill points",
                value: Number(governor.killPoints).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Tier 1 kills",
                value: Number(governor.tier1Kills).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Tier 2 kills",
                value: Number(governor.tier2Kills).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Tier 3 kills",
                value: Number(governor.tier3Kills).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Tier 4 kills",
                value: Number(governor.tier4Kills).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Tier 5 kills",
                value: Number(governor.tier5Kills).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Dead",
                value: Number(governor.dead).toLocaleString("en-US"),
                inline: true,
              },
              {
                name: "Resource Assistance",
                value: Number(governor.resourceAssistance).toLocaleString(
                  "en-US"
                ),
                inline: true,
              },
            ])
            .setFooter({
              text: `Last updated at: ${governor.updatedAt.toLocaleString(
                "en-US"
              )}`,
            }),
        ],
      });
    }

    const startingGovernors = await readFile(
      join(process.cwd(), "assets", "kvk.json"),
      "utf8"
    );

    const startingGovernorsParsed = JSON.parse(startingGovernors) as Governor[];

    const startingGovernor = startingGovernorsParsed.find(
      (startingGovernor) => startingGovernor.id === (id ?? governor.id)
    );

    if (!startingGovernor) {
      throw new Error("No starting governor.");
    }

    const governorsWithKvkStats = governors
      .map((governor) => {
        const oldGovernor = startingGovernorsParsed.find(
          (startingGovernor) => startingGovernor.id === (id ?? governor.id)
        );

        if (!oldGovernor) {
          return undefined;
        }

        return getKvkStats(oldGovernor, governor);
      })
      .filter((value): value is ReturnType<typeof getKvkStats> =>
        Boolean(value)
      );

    const dkpSorted = governorsWithKvkStats.sort(
      (a, b) => Number(b.currentDkp) - Number(a.currentDkp)
    );

    const governorWithKvkStats = getKvkStats(startingGovernor, governor);

    return void interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(THEME_COLOUR)
          .setTitle(`KvK statistics for ${governor.nickname}`)
          .addFields([
            {
              name: "Governor ID",
              value: governor.id.toString(),
              inline: true,
            },
            ...(governor.alliance
              ? [
                  {
                    name: "Alliance",
                    value: governor.alliance,
                    inline: true,
                  },
                ]
              : []),
            {
              name: "Rank",
              value: `#${
                dkpSorted.findIndex(
                  ({ governorID }) => governorID === (id ?? governor.id)
                ) + 1
              }`,
              inline: true,
            },
            {
              name: "Power",
              value: governorWithKvkStats.power,
              inline: true,
            },
            {
              name: "Power difference",
              value: governorWithKvkStats.powerDifference,
              inline: true,
            },
            {
              name: "Tier 4 kp gained",
              value: governorWithKvkStats.tier4KillsDifference,
              inline: true,
            },
            {
              name: "Tier 5 kp gained",
              value: governorWithKvkStats.tier5KillsDifference,
              inline: true,
            },
            {
              name: "Dead gained",
              value: governorWithKvkStats.deadDifference,
              inline: true,
            },
            {
              name: "DKP",
              value: governorWithKvkStats.currentDkp,
              inline: true,
            },
            {
              name: "DKP goal",
              value: governorWithKvkStats.requiredDkp,
              inline: true,
            },
            {
              name: "Goal reached",
              value: governorWithKvkStats.percentageTowardsDkpGoal,
              inline: true,
            },
          ])
          .setFooter({
            text: `Last updated at: ${governor.updatedAt.toLocaleString(
              "en-US"
            )}`,
          }),
      ],
    });
  },
});
