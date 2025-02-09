import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { commandOptions } from "./util/command-options.js";
import { SinnerTitle, THEME_COLOUR, Title } from "../constants.js";
import { getPendingTitleUsers } from "./util/get-pending-title-users.js";

const OPTION_TITLE_NAME = "title";

export const queueCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "queue",
  description: "View the current title buff queue",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_TITLE_NAME,
      description: "The title buff for which you want to view it's queue",
      choices: commandOptions(Title),
    },
  ],
  async execute(interaction) {
    const title = interaction.options.getString(OPTION_TITLE_NAME) as
      | Title
      | SinnerTitle
      | null;

    const pendingUsers = getPendingTitleUsers(interaction, title);

    if (Object.values(pendingUsers).every((queue) => !queue.length)) {
      return void interaction.reply("The queue(s) is / are currently empty.");
    }

    return void interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(THEME_COLOUR).addFields(
          Object.entries(pendingUsers).map(([title, users]) => ({
            name: title,
            value: users.join(", "),
          }))
        ),
      ],
    });
  },
});
