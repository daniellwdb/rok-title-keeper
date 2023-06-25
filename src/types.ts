import { PrismaClient } from "@prisma/client";
import type { Device } from "adb-ts";
import {
  ChatInputCommandInteraction,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { type Logger } from "pino";

export enum Title {
  JUSTICE = "Justice",
  DUKE = "Duke",
  ARCHITECT = "Architect",
  SCIENTIST = "Scientist",
}

export enum Kingdom {
  HOME = "Home",
  LOST = "Lost",
}

export interface CommandExecutionContext {
  interaction: ChatInputCommandInteraction<"cached">;
  device: Device;
  prisma: PrismaClient;
  logger: Logger;
}

export interface Command {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (context: CommandExecutionContext) => Promise<unknown>;
}
