import { type AppContext } from "../types.js";
import { setTimeout } from "node:timers/promises";
import path from "node:path";
import fs from "node:fs/promises";
import { getHexAtPosition } from "./get-hex-at-position.js";
import { getImageCoordinates } from "./get-image-coordinates.js";
import { TaskType } from "../queue.js";

const NETWORK_RESTORE_DELAY = 5_000;
const GAME_BOOT_TIMEOUT = 30_000;
const GAME_UPDATE_TIMEOUT = 60_000 * 2;
const RISE_OF_KINGDOMS_PACKAGE_NAME = "com.lilithgame.roc.gp";

const CLOSE_BUTTONS = [
  // Ads
  {
    hex: "8c8b88",
    x: 861,
    y: 81,
  },
  {
    hex: "6a9362",
    x: 821,
    y: 107,
  },
  {
    hex: "7b4b4a",
    x: 888,
    y: 69,
  },
  {
    hex: "6a9362",
    x: 821,
    y: 108,
  },
  {
    hex: "8a8a86",
    x: 861,
    y: 82,
  },
  // Title buff screen
  {
    hex: "d5d2ca",
    x: 888,
    y: 34,
  },
] as const;

export async function restoreGameState(context: AppContext, type: TaskType) {
  // #region game boot
  const focussedAppPackageName = await context.device.shell(
    `dumpsys activity activities | grep mResumedActivity | cut -d "{" -f2 | cut -d ' ' -f3 | cut -d "/" -f1`
  );

  if (!focussedAppPackageName.includes(RISE_OF_KINGDOMS_PACKAGE_NAME)) {
    context.device.execShell(`monkey -p ${RISE_OF_KINGDOMS_PACKAGE_NAME} 1`);
    await setTimeout(GAME_BOOT_TIMEOUT);

    return;
  }
  // #endregion
  // #region verification
  const verifyButtonImagePath = path.join(
    process.cwd(),
    "assets",
    "images",
    "verify-button.jpg"
  );
  const verifyButtonCoordinates = await getImageCoordinates(
    await context.device.screenshot(),
    await fs.readFile(verifyButtonImagePath)
  );

  if (verifyButtonCoordinates) {
    throw new Error(
      "Verification is required. Please use the /verification command."
    );
  }
  // #endregion
  // #region Game update
  const updateConfirmButtonImagePath = path.join(
    process.cwd(),
    "assets",
    "images",
    "update-confirm-button.jpg"
  );
  const updateConfirmButtonCoordinates = await getImageCoordinates(
    await context.device.screenshot(),
    await fs.readFile(updateConfirmButtonImagePath)
  );

  if (updateConfirmButtonCoordinates) {
    await context.device.shell(
      `input tap ${updateConfirmButtonCoordinates.x} ${updateConfirmButtonCoordinates.y}`
    );

    context.logger.info("Starting update.");

    await setTimeout(GAME_UPDATE_TIMEOUT);
  }
  // #endregion
  // #region Restore network disconnected
  const confirmButtonImagePath = path.join(
    process.cwd(),
    "assets",
    "images",
    "confirm-button.png"
  );

  const confirmButtonCoordinates = await getImageCoordinates(
    await context.device.screenshot(),
    await fs.readFile(confirmButtonImagePath)
  );

  if (confirmButtonCoordinates) {
    // Tap "CONFIRM"
    await context.device.shell(
      `input tap ${confirmButtonCoordinates.x} ${confirmButtonCoordinates.y}`
    );

    context.logger.info('Tapped "CONFIRM".');

    await setTimeout(NETWORK_RESTORE_DELAY);

    return;
  }

  // #endregion
  // #region Close buttons
  if (type === TaskType.SCAN) {
    return;
  }

  for (const { hex, x, y } of CLOSE_BUTTONS) {
    const hexAtPosition = await getHexAtPosition({
      ...context,
      type,
      // Context may contain position. This should overwrite it
      position: { x, y },
    });

    if (hexAtPosition === hex) {
      // Close ad
      await context.device.shell(`input tap ${x} ${y}`);

      context.logger.info("Dismissed ad.");

      return;
    }
  }
  // #endregion
}
