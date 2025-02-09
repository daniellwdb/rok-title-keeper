import { Colors } from "discord.js";
import { config } from "./config.js";
import type { Coordinate } from "./util/coordinates-to-rectangle.js";

export enum GovernorRankings {
  INDIVIDUAL_POWER = "Individual Power",
  INDIVIDUAL_KILLS = "Individual Kills",
}

export enum Title {
  JUSTICE = "Justice",
  DUKE = "Duke",
  ARCHITECT = "Architect",
  SCIENTIST = "Scientist",
}

export enum SinnerTitle {
  TRAITOR = "Traitor",
  BEGGAR = "Beggar",
  EXILE = "Exile",
  SLAVE = "Slave",
  SLUGGARD = "Sluggard",
  FOOL = "Fool",
}

export enum GovernorType {
  MAIN = "Main",
  ALT = "Alt",
  FARM = "Farm",
}

export enum Kingdom {
  HOME = "Home",
  LOST = "Lost",
}

export enum BotState {
  RUNNING = "Running",
  PAUSED = "Paused",
}

export const CONFIG_SERVER_URL = "https://roka-server.fly.dev";
export const UNAUTHORIZED_STATUS = 401;

export const SHORT_ANIMATION_DELAY = 250;
export const ANIMATION_DELAY = config.ANIMATION_DELAY
  ? Number(config.ANIMATION_DELAY)
  : 750;

export const THEME_COLOUR =
  (config.THEME_COLOUR as `#${string}`) || Colors.Green;

export const COORDINATES = {
  GOVERNOR_PROFILE_BORDER: {
    x: 35,
    y: 0,
  },
} satisfies Record<string, Coordinate>;
