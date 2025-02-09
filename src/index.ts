import { Client, GatewayIntentBits, ActivityType, Events } from "discord.js";
import * as events from "./events/mod.js";
import { pino } from "pino";
import { downloadAdb } from "./util/download-adb.js";
import fs from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import pretty from "pino-pretty";
import { config } from "./config.js";
import { getADBPort } from "./util/get-adb-port.js";
import { setDevice, getDevice } from "./device.js";
import { execAsync } from "./util/exec-async.js";

const APP_VERSION = "3.0.0";

const PLATFORM_TOOLS_DIR = "platform-tools";

// @ts-expect-error
const stream = pretty({
  ignore: "hostname,pid",
  translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
});

const logger = pino(
  {
    name: "Roka.",
  },
  stream
);

async function main() {
  logger.info(`Version ${APP_VERSION}.`);

  if (process.env.NODE_ENV === "production") {
    const { stdout } = await execAsync("npm -v");

    if (Number.isNaN(stdout.slice(0, 2))) {
      logger.info("Installing npm...");

      await execAsync("npm install -g npm@latest");

      logger.info("Done.");
    }

    logger.info("Applying database migrations...");

    await execAsync("npx prisma migrate deploy");

    logger.info("Done.");
  }

  try {
    await fs.access(PLATFORM_TOOLS_DIR, fs.constants.F_OK);
  } catch {
    logger.info(
      `Downloading Android SDK Platform-Tools, this might take a while...`
    );

    await downloadAdb();

    logger.info("Done.");
  }

  const ADB_PORT = await getADBPort();

  // await execAsync('".\\platform-tools\\adb.exe" kill-server');

  await execAsync(`".\\platform-tools\\adb.exe" connect localhost:${ADB_PORT}`);

  await setDevice(logger);

  const prisma = new PrismaClient();

  await prisma.$connect();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    presence: {
      activities: [
        {
          type: ActivityType.Playing,
          name: "Rise of Kingdoms",
        },
      ],
    },
  });

  Object.values(events).forEach(({ name, execute }) => {
    const eventListenerType = name === Events.ClientReady ? "once" : "on";

    client[eventListenerType](name, (...args) =>
      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/30581
      execute(...args, { logger, device: getDevice(), prisma })
    );
  });

  await client.login(config.DISCORD_TOKEN);
}

main();
