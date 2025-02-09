import type {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
  UserContextMenuCommandInteraction,
  ApplicationCommandType,
} from "discord.js";
import type { AppContext } from "../../types.js";

interface ApplicationCommandTypeInteraction {
  [ApplicationCommandType.ChatInput]: ChatInputCommandInteraction<"cached">;
  [ApplicationCommandType.User]: UserContextMenuCommandInteraction<"cached">;
  [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction<"cached">;
}

type Command<T extends ApplicationCommandType> =
  RESTPostAPIApplicationCommandsJSONBody & {
    type: T;
    execute: (
      interaction: ApplicationCommandTypeInteraction[T],
      context: AppContext
    ) => void | Promise<void>;
  };

export function createCommand<T extends ApplicationCommandType>(
  command: Command<T>
) {
  return command;
}
