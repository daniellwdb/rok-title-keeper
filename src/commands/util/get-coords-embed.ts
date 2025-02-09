import type { TitleBuffRequest } from "@prisma/client";
import { EmbedBuilder, User } from "discord.js";
import { THEME_COLOUR } from "../../constants.js";

export function getCoordsEmbed(
  data: Pick<TitleBuffRequest, "kingdomType" | "x" | "y" | "governorType">,
  target?: User
) {
  return new EmbedBuilder()
    .setColor(THEME_COLOUR)
    .setTitle(
      target
        ? `Saved coordinates for ${target.username}`
        : "Your saved coordinates"
    )
    .addFields([
      {
        name: "Kingdom",
        value: data.kingdomType,
        inline: true,
      },
      {
        name: "Governor type",
        value: data.governorType,
        inline: true,
      },
      {
        name: "\u200B",
        value: "\u200B",
      },
      {
        name: "X-coordinate",
        value: data.x.toString(),
        inline: true,
      },
      {
        name: "Y-coordinate",
        value: data.y.toString(),
        inline: true,
      },
    ]);
}
