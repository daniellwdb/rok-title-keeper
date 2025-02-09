import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { commandOptions } from "./util/command-options.js";
import { GovernorType } from "../constants.js";
import { interpolate } from "../util/interpolate.js";
import { config } from "../config.js";

const OPTION_GOVERNOR_ID_NAME = "id";
const OPTION_GOVERNOR_TYPE_NAME = "type";

export const linkCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "link",
  description: "Link your Discord account to a governor profile",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_GOVERNOR_ID_NAME,
      description: "ID of the governor profile",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_GOVERNOR_TYPE_NAME,
      description: "Governor type",
      choices: commandOptions(GovernorType),
      required: true,
    },
  ],
  async execute(interaction, { prisma }) {
    await interaction.deferReply();

    const id = interaction.options.getString(OPTION_GOVERNOR_ID_NAME, true);

    const type = interaction.options.getString(
      OPTION_GOVERNOR_TYPE_NAME,
      true
    ) as GovernorType;

    const governor = await prisma.governor.findUnique({
      where: {
        id,
      },
    });

    if (!governor) {
      return void interaction.followUp(
        interpolate(config.GOVERNOR_PROFILE_WITH_ID_NOT_FOUND_MESSAGE, { id })
      );
    }

    await prisma.governorConnection.upsert({
      where: {
        discordUserId_governorType: {
          discordUserId: interaction.user.id,
          governorType: type,
        },
      },
      create: {
        discordUserId: interaction.user.id,
        governorId: governor.id,
        governorType: type,
      },
      update: {
        governorId: governor.id,
        governorType: type,
      },
    });

    return void interaction.followUp(
      interpolate(config.PROFILE_LINK_SUCCESSFUL_MESSAGE, {
        nickname: governor.nickname,
        type,
      })
    );
  },
});
