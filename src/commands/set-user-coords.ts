import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { GovernorType, Kingdom } from "../constants.js";
import { commandOptions } from "./util/command-options.js";
import { validateAndUpsertTitleInput } from "./util/validate-and-upsert-title-input.js";
import { getCoordsEmbed } from "./util/get-coords-embed.js";

const OPTION_KINGDOM_NAME = "kingdom";
const OPTION_X_COORDINATE_NAME = "x-coordinate";
const OPTION_Y_COORDINATE_NAME = "y-coordinate";
const OPTION_USER_NAME = "user";
const OPTION_GOVERNOR_TYPE_NAME = "type";

export const setUserCoordsCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "set-user-coords",
  description: "Set the coordinates for a user",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_KINGDOM_NAME,
      description: "The kingdom the user's city is located in",
      choices: commandOptions(Kingdom),
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: OPTION_X_COORDINATE_NAME,
      description: "The x-coordinate of the user's city",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: OPTION_Y_COORDINATE_NAME,
      description: "The y-coordinate of the user's city",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.User,
      name: OPTION_USER_NAME,
      description: "The user",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_GOVERNOR_TYPE_NAME,
      description: "Governor type (default to main)",
      choices: commandOptions(GovernorType),
    },
  ],
  async execute(interaction, context) {
    await interaction.deferReply();

    const kingdom = interaction.options.getString(
      OPTION_KINGDOM_NAME,
      true
    ) as Kingdom;

    const x = interaction.options.getInteger(OPTION_X_COORDINATE_NAME, true);
    const y = interaction.options.getInteger(OPTION_Y_COORDINATE_NAME, true);
    const user = interaction.options.getUser(OPTION_USER_NAME, true);
    const governorType = (interaction.options.getString("type") ??
      GovernorType.MAIN) as GovernorType;

    const titleInput = await validateAndUpsertTitleInput({
      discordUserId: user.id,
      kingdomType: kingdom,
      x,
      y,
      governorType,
      ...context,
    });

    if (!titleInput.ok) {
      return void interaction.followUp(titleInput.message);
    }

    return void interaction.followUp({
      embeds: [getCoordsEmbed(titleInput, user)],
    });
  },
});
