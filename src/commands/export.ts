import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import writeXlsxFile from "write-excel-file/node";
import type { CommandExecutionContext } from "../types.js";
import { calculateDkp } from "../util/calculate-dkp.js";

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export const exportCommand = {
  data: new SlashCommandBuilder()
    .setName("export-kvk")
    .setDescription("Export KvK progress to an Excel file")
    .toJSON(),
  execute: async ({ interaction, prisma }: CommandExecutionContext) => {
    await interaction.deferReply();

    const governorsDkps = await prisma.governorDKP.findMany({
      include: {
        governor: true,
      },
    });

    const dkps = governorsDkps
      .map(calculateDkp)
      .map(({ powerDifference, percentageTowardsGoal, ...dkp }) => dkp);

    const HEADER_ROW = [
      {
        value: "Governor ID",
        fontWeight: "bold",
      },
      {
        value: "Nickname",
        fontWeight: "bold",
      },
      {
        value: "Power",
        fontWeight: "bold",
      },
      {
        value: "Tier 4 kp difference",
        fontWeight: "bold",
      },
      {
        value: "Tier 5 kp difference",
        fontWeight: "bold",
      },
      {
        value: "Dead difference",
        fontWeight: "bold",
      },
      {
        value: "Current DKP",
        fontWeight: "bold",
      },
      {
        value: "DKP needed",
        fontWeight: "bold",
      },
      {
        value: "DKP remaining",
        fontWeight: "bold",
      },
    ];

    const DATA_ROWS = dkps.flatMap((dkp) =>
      Object.values(dkp).map((value) => ({
        type: typeof value === "number" ? Number : String,
        value,
      }))
    );

    const buffer = await writeXlsxFile(
      [HEADER_ROW, ...chunks(DATA_ROWS, HEADER_ROW.length)],
      {
        buffer: true,
      }
    );

    return interaction.followUp({
      files: [
        new AttachmentBuilder(buffer, {
          name: "kvk_dkp.xlsx",
          description: "KvK DKP export",
        }),
      ],
    });
  },
};
