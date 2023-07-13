import { setTimeout } from "node:timers/promises";
import type { Device } from "adb-ts";

const GAME_SPLASH_TIMEOUT = 15_000;
const GAME_BOOT_TIMEOUT = 35_000;
export const MAP_POSITION = "75 825";
const MAP_ANIMATION_DURATION = 500;

export const rebootRoK = async (device: Device) => {
  // Close Rise of Kingdoms
  await device.execShell("am force-stop com.lilithgame.roc.gp");

  // Open Rise of Kingdoms
  await device.execShell("monkey -p com.lilithgame.roc.gp 1");

  await setTimeout(GAME_SPLASH_TIMEOUT);

  // Tap map location (to bypass splash screen)
  await device.shell(`input tap ${MAP_POSITION}`);

  await setTimeout(GAME_BOOT_TIMEOUT);

  // Tap map
  await device.shell(`input tap ${MAP_POSITION}`);

  await setTimeout(MAP_ANIMATION_DURATION);
};
