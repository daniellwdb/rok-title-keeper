import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AttachmentBuilder,
  Colors,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { commandOptions } from "./util/command-options.js";
import { TaskType, queue$, tasks$ } from "../queue.js";
import { firstValueFrom, filter } from "rxjs";
import { createWorker, OEM, PSM } from "tesseract.js";
import { GovernorRankings } from "../constants.js";
import { interpolate } from "../util/interpolate.js";
import { config } from "../config.js";

const OPTION_RANKINGS_TYPE_NAME = "type";
const OPTION_TOP_NAME = "top";
const MAX_ALLOWED_SCANS = 1000;

export const scanCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "scan",
  description: "Scan governor rankings statistics",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_RANKINGS_TYPE_NAME,
      description: "Type of rankings to scan",
      choices: commandOptions(GovernorRankings),
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: OPTION_TOP_NAME,
      description: "Amount of governor profiles to scan",
      max_value: MAX_ALLOWED_SCANS,
      required: true,
    },
  ],
  async execute(interaction, context) {
    await interaction.deferReply();

    const type = interaction.options.getString(
      OPTION_RANKINGS_TYPE_NAME,
      true
    ) as GovernorRankings;

    const top = interaction.options.getInteger(OPTION_TOP_NAME, true);

    const worker = await createWorker("eng", OEM.TESSERACT_LSTM_COMBINED);

    await worker.setParameters({
      tessedit_char_whitelist: "0123456789,",
      tessedit_pageseg_mode: PSM.SINGLE_LINE,
    });

    queue$.next({
      type: TaskType.SCAN,
      discordUserId: interaction.user.id,
      rankingsType: type,
      top,
      worker,
      ...context,
    });

    await interaction.followUp(
      interpolate(config.SCAN_STARTED_MESSAGE, { top, type })
    );

    await context.prisma.titleBuffConfiguration.updateMany({
      data: {
        locked: true,
      },
    });

    const scanResult = await firstValueFrom(
      tasks$.pipe(
        filter(
          ({ discordUserId, type }) =>
            type === TaskType.SCAN && discordUserId === interaction.user.id
        )
      )
    );

    await context.prisma.titleBuffConfiguration.updateMany({
      data: {
        locked: false,
      },
    });

    await worker.terminate();

    const screenshot = await context.device.screenshot();

    if (!scanResult.success) {
      const errorMessage =
        scanResult.error instanceof Error && scanResult.error.message;

      return void interaction.channel?.send({
        content: interaction.user.toString(),
        files: [
          new AttachmentBuilder(screenshot, {
            name: "screenshot.png",
            description: "adb screenshot",
          }),
        ],
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setImage("attachment://screenshot.png")
            .setDescription(
              `Something went wrong while scanning.${
                errorMessage ? `\n${codeBlock(errorMessage)}` : ""
              }`
            )
            .setFooter({ text: `${type} | top ${top}` }),
        ],
      });
    }

    await interaction.channel?.send(
      `Finished ${scanResult.type}. ${interaction.user}`
    );
  },
});
