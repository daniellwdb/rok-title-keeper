import { ApplicationCommandType, Events, codeBlock } from "discord.js";
import { createEvent } from "./util/create-event.js";
import * as commands from "../commands/mod.js";
import { rebootTaskPending$ } from "../queue.js";
import { AdbError, AdbExecError } from "adb-ts/lib/util/errors.js";
import { config } from "../config.js";
import { getBotState } from "../util/bot-state.js";
import { BotState } from "../constants.js";
import { execAsync } from "../util/exec-async.js";

export const interactionCreateEvent = createEvent({
  name: Events.InteractionCreate,
  async execute(interaction, context) {
    if (
      !interaction.isChatInputCommand() &&
      !interaction.isContextMenuCommand()
    ) {
      return;
    }

    if (!interaction.inCachedGuild()) {
      return;
    }

    const command = Object.values(commands).find(
      (command) => command.name === interaction.commandName
    );

    if (!command) {
      throw new Error(`Command \`${interaction.commandName}\` was not found.`);
    }

    if (
      getBotState() === BotState.PAUSED &&
      command.name !== commands.setBotStateCommand.name
    ) {
      return void interaction.reply(config.BOT_STATE_PAUSED);
    }

    try {
      if (
        [commands.titleCommand.name, commands.sinnerTitleCommand.name].includes(
          command.name
        ) &&
        rebootTaskPending$.value
      ) {
        return void interaction.reply(config.REBOOT_PENDING);
      }

      if (
        interaction.isChatInputCommand() &&
        command.type === ApplicationCommandType.ChatInput
      ) {
        await command.execute(interaction, context);
      }

      if (
        interaction.isUserContextMenuCommand() &&
        command.type === ApplicationCommandType.User
      ) {
        await command.execute(interaction, context);
      }
    } catch (error) {
      if (error instanceof AdbError) {
        context.logger.warn("Detected AdbError. Please report this.");
      }

      if (error instanceof AdbExecError) {
        context.logger.warn("Detected AdbExecError. Please report this.");
      }

      if (error instanceof Error && error.message === "closed") {
        context.logger.warn(
          "Detected closed error. This error most likely means that Android debug bridge is not enabled in BlueStacks Advanced settings."
        );
      }

      if (error instanceof Error && error.message === "device offline") {
        await execAsync(`".\\platform-tools\\adb.exe" reconnect offline`);

        context.logger.warn(
          "Detected device offline error. Attempted to reconnect. Please report if this works or not."
        );
      }

      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        await interaction.editReply({
          content: `Error:\n${codeBlock(error.message)}`,
          components: [],
        });
      }
    }
  },
});
