import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AttachmentBuilder,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import writeXlsxFile from "write-excel-file/node";
import { config } from "../config.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Governor } from "@prisma/client";
import { getKvkStats } from "./util/get-kvk-stats.js";

const OPTION_STATS_TYPE_NAME = "stats";

export const exportStatsCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "export-stats",
  description: "Export statistics to an Excel file",
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
  ],
  async execute(interaction, context) {
    await interaction.deferReply();

    const statsType = interaction.options.getString(
      OPTION_STATS_TYPE_NAME,
      true
    ) as "profile" | "kvk";

    const governors = await context.prisma.governor.findMany();

    if (!governors.length) {
      return void interaction.followUp(
        config.GOVERNOR_PROFILES_NOT_FOUND_MESSAGE
      );
    }

    const HEADER_ROW_PROFILE = [
      "ID",
      "Nickname",
      "Alliance",
      "Power",
      "Kill Points",
      "Tier 1 kills",
      "Tier 2 kills",
      "Tier 3 kills",
      "Tier 4 kills",
      "Tier 5 kills",
      "Dead",
      "Resource Assistance",
    ].map(
      (header) =>
        ({ value: header, fontWeight: "bold", align: "left" } as const)
    );

    const HEADER_ROW_KVK = [
      "ID",
      "Nickname",
      "Alliance",
      "Power",
      "Power difference",
      "Tier 4 kp difference",
      "Tier 5 kp difference",
      "Dead difference",
      "Current DKP",
      "Required DKP",
      "Remaining DKP",
      "Percentage towards DKP goal",
    ].map(
      (header) =>
        ({ value: header, fontWeight: "bold", align: "left" } as const)
    );

    const DATA_ROWS_PROFILE = governors.map((governor) =>
      Object.entries(governor)
        .filter(([key]) => !["createdAt", "updatedAt"].includes(key))
        .map(([, value]) => ({
          type: typeof value === "string" ? String : Number,
          value: typeof value === "string" ? value : Number(value),
          align: "left",
        }))
    );

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

    const DATA_ROWS_KVK = governorsWithKvkStats.map((governorWithKvkStats) =>
      Object.entries(governorWithKvkStats)
        .filter(([key]) => !["createdAt", "updatedAt"].includes(key))
        .map(([, value]) => ({
          type: typeof value === "string" ? String : Number,
          value: typeof value === "string" ? value : Number(value),
          align: "left",
        }))
    );

    const data = [
      statsType === "profile" ? HEADER_ROW_PROFILE : HEADER_ROW_KVK,
      ...(statsType === "profile" ? DATA_ROWS_PROFILE : DATA_ROWS_KVK),
    ];

    const columns = (
      statsType === "profile" ? HEADER_ROW_PROFILE : HEADER_ROW_KVK
    ).map((headerRow, index) => ({
      width: Math.max(
        headerRow.value.length,
        ...(statsType === "profile" ? DATA_ROWS_PROFILE : DATA_ROWS_KVK).map(
          (row) => String(row[index]).length
        )
      ),
    }));

    const buffer = await writeXlsxFile(data, {
      columns,
      buffer: true,
    });

    return void interaction.followUp({
      files: [
        new AttachmentBuilder(buffer, {
          name: `${statsType === "profile" ? "profile" : "kvk"}-stats.xlsx`,
          description: "Export of statistics",
        }),
      ],
    });
  },
});
