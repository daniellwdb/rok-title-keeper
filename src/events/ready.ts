import { createEvent } from "./util/create-event.js";
import { Events } from "discord.js";
import * as commands from "../commands/mod.js";
import fetch from "node-fetch";
import { config as appConfig } from "../config.js";
import { setTimeout } from "node:timers/promises";
import { TaskType, queue$ } from "../queue.js";
import { CONFIG_SERVER_URL, UNAUTHORIZED_STATUS } from "../constants.js";

const HALF_HOUR = 30 * 60 * 1000;

export const readyEvent = createEvent({
  name: Events.ClientReady,
  async execute(client, context) {
    if (
      process.env.NODE_ENV === "production" &&
      (process.env.DISCORD_GUILD ||
        process.env.APPLICATION_ID ||
        process.env.TRIAL_MODE)
    ) {
      throw new Error("Found unsupported environment variable.");
    }

    const devGuild = appConfig.DISCORD_DEV_GUILD
      ? client.guilds.cache.get(appConfig.DISCORD_DEV_GUILD)
      : undefined;

    if (process.env.NODE_ENV !== "production") {
      await client.application.commands.set([]);
      await devGuild?.commands.set(Object.values(commands));
      context.logger.info(`${client.user.username} is ready.`);

      // console.log(
      //   Object.values(commands)
      //     .map(
      //       (command) => `<tr>
      //   <td>${"description" in command ? `/${command.name}` : command.name}</td>
      //   <td>${"description" in command ? command.description : "N/A"}</td>
      //   <td>${
      //     command.options
      //       ? command.options
      //           .map((option) =>
      //             option.required ? option.name : `${option.name}?`
      //           )
      //           .join(", ")
      //       : "N/A"
      //   }</td>
      // </tr>`
      //     )
      //     .join("\n")
      // );

      return;
    }

    const getConfig = async () => {
      const response = await fetch(`${CONFIG_SERVER_URL}/configs`);

      if (response.status === UNAUTHORIZED_STATUS) {
        context.logger.error(
          "Unauthorized. Please visit: https://discord.gg/dAa4axurq7 to buy this bot or activate the trial."
        );

        process.exit();
      }

      const configs = (await response.json()) as Partial<NodeJS.ProcessEnv>[];
      const config = configs.find(
        (config) => config.APPLICATION_ID === client.user.id
      );

      if (
        !config ||
        !client.guilds.cache.some((guild) => guild.id === config.DISCORD_GUILD)
      ) {
        context.logger.error(
          "Unauthorized. Please visit: https://discord.gg/dAa4axurq7 to buy this bot or activate the trial."
        );

        process.exit();
      }

      return config;
    };

    const config = await getConfig();

    for (const [key, value] of Object.entries(config)) {
      process.env[key] =
        typeof value === "boolean" && value === true ? "true" : value;
    }

    context.logger.info({
      homeKingdom: appConfig.HOME_KINGDOM,
      lostKingdom: appConfig.LOST_KINGDOM,
      animationDelay: appConfig.ANIMATION_DELAY ?? 750,
      emulatorInstanceName: appConfig.EMULATOR_INSTANCE_NAME,
      rebootInterval: appConfig.REBOOT_INTERVAL,
    });

    await client.application.commands.set(Object.values(commands));
    await devGuild?.commands.set([]);

    context.logger.info(`${client.user.username} is ready.`);

    setInterval(async () => {
      await getConfig();
    }, 43200000);

    if (appConfig.REBOOT_INTERVAL) {
      setInterval(() => {
        queue$.next({
          type: TaskType.REBOOT,
          discordUserId: "system",
          client,
          ...context,
        });
      }, appConfig.REBOOT_INTERVAL * 60 * 60 * 1000);
    }

    if (process.env.TRIAL_MODE === "true") {
      const date = new Date();
      date.setTime(date.getTime() + HALF_HOUR);

      context.logger.warn(
        `Trial mode is activated. App will automatically close at ${date.toLocaleTimeString()}.`
      );

      await setTimeout(HALF_HOUR);

      context.logger.error(
        "Trial expired. Please visit: https://discord.gg/dAa4axurq7 to buy this bot or restart it."
      );

      process.exit();
    }
  },
});
