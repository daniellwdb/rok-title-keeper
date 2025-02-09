import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { GovernorType, Kingdom } from "../constants.js";
import { config } from "../config.js";
import { commandOptions } from "./util/command-options.js";
import { validateAndUpsertTitleInput } from "./util/validate-and-upsert-title-input.js";
import { getCoordsEmbed } from "./util/get-coords-embed.js";

const OPTION_VIEW_NAME = "view";
const OPTION_UPDATE_NAME = "update";
const OPTION_KINGDOM_NAME = "kingdom";
const OPTION_X_COORDINATE_NAME = "x-coordinate";
const OPTION_Y_COORDINATE_NAME = "y-coordinate";
const OPTION_GOVERNOR_TYPE_NAME = "type";

export const coordsCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "coords",
  description: "View or update your city coordinates",
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: OPTION_VIEW_NAME,
      description: "View your city coordinates",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: OPTION_KINGDOM_NAME,
          description: "The kingdom your city is located in",
          choices: commandOptions(Kingdom),
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: OPTION_GOVERNOR_TYPE_NAME,
          description: "Governor type (default to main)",
          choices: commandOptions(GovernorType),
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: OPTION_UPDATE_NAME,
      description: "Update your city coordinates",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: OPTION_KINGDOM_NAME,
          description: "The kingdom your city is located in",
          choices: commandOptions(Kingdom),
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: OPTION_X_COORDINATE_NAME,
          description: "The x-coordinate of your city",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: OPTION_Y_COORDINATE_NAME,
          description: "The y-coordinate of your city",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: OPTION_GOVERNOR_TYPE_NAME,
          description: "Governor type (default to main)",
          choices: commandOptions(GovernorType),
        },
      ],
    },
  ],
  async execute(interaction, context) {
    await interaction.deferReply();

    const subCommand = interaction.options.getSubcommand();
    const kingdom = interaction.options.getString(
      OPTION_KINGDOM_NAME,
      true
    ) as Kingdom;
    const governorType = (interaction.options.getString("type") ??
      GovernorType.MAIN) as GovernorType;

    if (subCommand === OPTION_VIEW_NAME) {
      const titleBuffRequest = await context.prisma.titleBuffRequest.findUnique(
        {
          where: {
            discordUserId_governorType: {
              discordUserId: interaction.user.id,
              governorType,
            },
          },
        }
      );

      if (!titleBuffRequest) {
        return void interaction.followUp(config.NO_COORDS_SAVED);
      }

      return void interaction.followUp({
        embeds: [getCoordsEmbed(titleBuffRequest)],
      });
    }

    const x = interaction.options.getInteger(OPTION_X_COORDINATE_NAME, true);
    const y = interaction.options.getInteger(OPTION_Y_COORDINATE_NAME, true);

    const titleInput = await validateAndUpsertTitleInput({
      discordUserId: interaction.user.id,
      kingdomType: kingdom,
      x,
      y,
      governorType,
      ...context,
    });

    if (!titleInput.ok) {
      return void interaction.followUp(titleInput.message);
    }

    return void interaction.followUp({ embeds: [getCoordsEmbed(titleInput)] });
  },
});
