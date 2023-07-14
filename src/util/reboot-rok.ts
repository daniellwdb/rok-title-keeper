import { setTimeout } from "node:timers/promises";
import type { Device } from "adb-ts";

const GAME_SPLASH_TIMEOUT = 15_000;
export const GAME_BOOT_TIMEOUT = 35_000;
export const MAP_POSITION = "75 825";

export const rebootRoK = async (device: Device) => {
  // Close Rise of Kingdoms
  await device.execShell("am force-stop com.lilithgame.roc.gp");

  // Open Rise of Kingdoms
  await device.execShell("monkey -p com.lilithgame.roc.gp 1");

  await setTimeout(GAME_SPLASH_TIMEOUT);

  // Tap anywhere (to bypass splash screen)
  await device.shell("500 450");

  await setTimeout(GAME_BOOT_TIMEOUT);
};
