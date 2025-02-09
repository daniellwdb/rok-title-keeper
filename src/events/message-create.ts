import { Events, codeBlock } from "discord.js";
import { createEvent } from "./util/create-event.js";
import { titleTextCommand } from "../commands/text/title.js";
import { AdbError, AdbExecError } from "adb-ts/lib/util/errors.js";
import { execAsync } from "../util/exec-async.js";

export const messageCreateEvent = createEvent({
  name: Events.MessageCreate,
  async execute(message, context) {
    if (message.author.id === message.client.user.id || !message.inGuild()) {
      return;
    }

    const [commandName, ...args] = message.content.trim().split(/ +/);
    const command = commandName?.toLowerCase();

    try {
      await titleTextCommand(message, context, command, args);
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
        await message.reply(`Error:\n${codeBlock(error.message)}`);
      }
    }
  },
});
