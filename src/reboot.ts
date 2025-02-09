import type { Task, TaskType } from "./queue.js";
import { setTimeout } from "node:timers/promises";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ini from "ini";
import { config } from "./config.js";
import { getADBPort } from "./util/get-adb-port.js";
import { setDevice } from "./device.js";
import { getEmulatorInstanceName } from "./util/get-emulator-instance-name.js";
import { execAsync } from "./util/exec-async.js";

const GAME_BOOT_TIMEOUT = 30_000;
const PLAYER_BOOT_TIMEOUT = 30_000;
const BLUESTACKS_PROCESS_NAME = "HD-Player.exe";

export async function reboot(
  options: Extract<Task, { type: TaskType.REBOOT }>
) {
  if (options.discordUserId === "system") {
    for (const channelId of config.REBOOT_CHANNEL_IDS) {
      try {
        const channel = await options.client.channels.fetch(channelId);

        if (!channel?.isTextBased()) {
          throw new Error(`Could not find channel with id ${channelId}.`);
        }

        await channel.send(config.REBOOT_STARTED);
      } catch (error) {
        options.logger.error(error);
      }
    }
  }

  // Close Rise of Kingdoms
  // await device.execShell("am force-stop com.lilithgame.roc.gp");

  const instanceName = await getEmulatorInstanceName();

  await execAsync(
    `taskkill /fi "WINDOWTITLE eq ${instanceName}" /IM "${BLUESTACKS_PROCESS_NAME}" /F`,
    {
      shell: "cmd",
    }
  );

  const blueStacksConfigText = await readFile(
    join("C:\\", "ProgramData", "BlueStacks_nxt", "bluestacks.conf"),
    "utf-8"
  );

  const blueStacksConfig = ini.parse(blueStacksConfigText);

  const image = Object.entries(blueStacksConfig)
    .find(([key, value]) =>
      config.EMULATOR_INSTANCE_NAME
        ? value.includes(config.EMULATOR_INSTANCE_NAME)
        : key.startsWith("bst.instance")
    )
    ?.at(0)
    .split(".")
    .at(2);

  try {
    await execAsync(
      `"${config.BLUESTACKS_EXECUTABLE}\\${BLUESTACKS_PROCESS_NAME}" --instance ${image} --cmd launchApp --package "com.lilithgame.roc.gp"`,
      { shell: "cmd", timeout: PLAYER_BOOT_TIMEOUT /* Does not resolve */ }
    );
  } catch {}

  const ADB_PORT = await getADBPort();

  await execAsync(`".\\platform-tools\\adb.exe" connect localhost:${ADB_PORT}`);

  await setDevice(options.logger);

  // Open Rise of Kingdoms
  // await device.execShell("monkey -p com.lilithgame.roc.gp 1");

  await setTimeout(GAME_BOOT_TIMEOUT);

  if (options.discordUserId === "system") {
    for (const channelId of config.REBOOT_CHANNEL_IDS) {
      try {
        const channel = await options.client.channels.fetch(channelId);

        if (!channel?.isTextBased()) {
          throw new Error(`Could not find channel with id ${channelId}.`);
        }

        await channel.send(config.REBOOT_FINISHED);
      } catch (error) {
        options.logger.error(error);
      }
    }
  }
}
