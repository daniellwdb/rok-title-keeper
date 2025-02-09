import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { commandOptions } from "./util/command-options.js";
import { THEME_COLOUR, Title } from "../constants.js";

const OPTION_TITLE_NAME = "title";
const OPTION_TTL_NAME = "ttl";
const OPTION_LOCKED_NAME = "locked";

export const configureTitleCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "configure-title",
  description: "(Un)lock and set the timeout for title buffs",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: OPTION_TITLE_NAME,
      description: "The title buff you want to configure",
      choices: commandOptions(Title),
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Integer,
      name: OPTION_TTL_NAME,
      description: "Amount of seconds a title buff should last",
      min_value: 3,
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      name: OPTION_LOCKED_NAME,
      description: "Whether or not the title buff should be locked",
      required: true,
    },
  ],
  async execute(interaction, { prisma }) {
    await interaction.deferReply();

    const title = interaction.options.getString(
      OPTION_TITLE_NAME,
      true
    ) as Title;

    const ttl = interaction.options.getInteger(OPTION_TTL_NAME, true);
    const locked = interaction.options.getBoolean(OPTION_LOCKED_NAME, true);

    await prisma.titleBuffConfiguration.upsert({
      where: {
        title,
      },
      create: {
        title,
        ttl,
        locked,
      },
      update: {
        ttl,
        locked,
      },
    });

    const titleBuffConfigurations =
      await prisma.titleBuffConfiguration.findMany();

    const titleBuffConfigurationsFormatted = Object.values(Title).map(
      (title) => {
        const titleConfiguration = titleBuffConfigurations.find(
          (titleConfiguration) => (titleConfiguration.title as Title) === title
        );

        return {
          name: title,
          value: `Locked: ${
            titleConfiguration?.locked ? "yes" : "no"
          }\nDuration: ${titleConfiguration?.ttl ?? 60} seconds`,
        };
      }
    );

    return void interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(THEME_COLOUR)
          .setTitle("Title buff configurations")
          .addFields(titleBuffConfigurationsFormatted),
      ],
    });
  },
});
