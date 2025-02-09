import {
  ApplicationCommandType,
  Colors,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { config } from "../config.js";
import { TaskType, queue$, tasks$ } from "../queue.js";
import { filter, firstValueFrom } from "rxjs";

export const rebootCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "reboot",
  description: "Reboot emulator with Rise of Kingdoms",
  async execute(interaction, context) {
    await interaction.deferReply();

    queue$.next({
      type: TaskType.REBOOT,
      discordUserId: interaction.user.id,
      client: interaction.client,
      ...context,
    });

    await interaction.followUp(config.REBOOT_STARTED);

    const rebootResult = await firstValueFrom(
      tasks$.pipe(
        filter(
          ({ discordUserId, type }) =>
            type === TaskType.REBOOT && discordUserId === interaction.user.id
        )
      )
    );

    if (!rebootResult.success) {
      const errorMessage =
        rebootResult.error instanceof Error && rebootResult.error.message;

      return void interaction.channel?.send({
        content: interaction.user.toString(),
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription(
              `Something went wrong while rebooting.${
                errorMessage ? `\n${codeBlock(errorMessage)}` : ""
              }`
            ),
        ],
      });
    }

    await interaction.followUp(config.REBOOT_FINISHED);
  },
});
