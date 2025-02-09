import { createEvent } from "./util/create-event.js";
import { Events } from "discord.js";
import * as commands from "../commands/mod.js";
import { config as appConfig } from "../config.js";
import { TaskType, queue$ } from "../queue.js";

export const readyEvent = createEvent({
  name: Events.ClientReady,
  async execute(client, context) {
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

    context.logger.info({
      homeKingdom: appConfig.HOME_KINGDOM,
      lostKingdom: appConfig.LOST_KINGDOM,
      animationDelay: appConfig.ANIMATION_DELAY ?? 750,
      emulatorInstanceName: appConfig.EMULATOR_INSTANCE_NAME,
      rebootInterval: appConfig.REBOOT_INTERVAL,
    });

    context.logger.info("Thanks for the support everyone! ❤️");
    context.logger.info(
      "Please consider supporting me through PayPal: https://www.paypal.com/paypalme/dwijdenbosch"
    );

    await client.application.commands.set(Object.values(commands));
    await devGuild?.commands.set([]);

    context.logger.info(`${client.user.username} is ready.`);

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
  },
});
