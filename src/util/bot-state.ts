import { BotState } from "../constants.js";

let botState = BotState.RUNNING;

export function getBotState() {
  return botState;
}

export function setBotState(newBotState: BotState) {
  botState = newBotState;
}
