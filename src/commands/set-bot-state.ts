import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { commandOptions } from "./util/command-options.js";
import { BotState } from "../constants.js";
import { setBotState } from "../util/bot-state.js";
import { interpolate } from "../util/interpolate.js";
import { config } from "../config.js";

const OPTION_STATE_NAME = "state";

export const setBotStateCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "set-bot-state",
  description: "Pause or resume the bot",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_STATE_NAME,
      description: "New state of the bot",
      choices: commandOptions(BotState),
      required: true,
    },
  ],
  execute(interaction) {
    const state = interaction.options.getString(
      OPTION_STATE_NAME,
      true
    ) as BotState;

    setBotState(state);

    return void interaction.reply(
      interpolate(config.BOT_STATE_UPDATED, { botState: state })
    );
  },
});
