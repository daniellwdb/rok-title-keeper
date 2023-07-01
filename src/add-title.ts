import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import type { Device } from "adb-ts";
import { type Logger } from "pino";
import { OEM, PSM, createWorker } from "tesseract.js";
import { config } from "./config.js";
import { Kingdom, type Title } from "./types.js";
import { findCutoutPosition } from "./util/find-cutout-position.js";
import {
  getLastVisitedKingdom,
  getPixelHexColour,
  rebootRoK,
  setLastVisitedKingdom,
} from "./util/util.module.js";

export interface AddTitleOptions {
  device: Device;
  title: Title;
  logger: Logger;
  kingdom: Kingdom;
  x: number;
  y: number;
}

const ELEMENT_POSITIONS = {
  COORDINATES_SEARCH_BUTTON: "536 9",
  KINGDOM_ID_INPUT: "567.5 179",
  INPUT_OK_BUTTON: "1460.5 814.5",
  X_COORDINATE_INPUT: "798.5 179",
  Y_COORDINATE_INPUT: "991.5 179",
  COORDINATES_OVERLAY_SEARCH_BUTTON: "1102 179",
  CITY_LOCATION: "803 449.5",
  JUSTICE_TITLE_CHECKBOX: "367 493",
  DUKE_TITLE_CHECKBOX: "643 493",
  ARCHITECT_TITLE_CHECKBOX: "938 493",
  SCIENTIST_TITLE_CHECKBOX: "1226 493",
  CONFIRM_BUTTON: "801.5 800",
  TITLE_OVERLAY_CLOSE_BUTTON: "1395 56",
  ONLINE_STATUS_INDICATOR: "95 9",
} as const;

const QUICK_TRAVEL_TIMEOUT = 4_000;
const SLOW_TRAVEL_TIMEOUT = 17_000;
const UI_ELEMENT_ANIMATION_DURATION = 750;
const NEW_CLICK_IDLE_TIMEOUT = 100;

export const addTitle = async ({
  device,
  title,
  logger: _logger,
  kingdom,
  x,
  y,
}: AddTitleOptions) => {
  const onlineStatusIndicatorHexColour = await getPixelHexColour(
    await device.screenshot(),
    ...(ELEMENT_POSITIONS.ONLINE_STATUS_INDICATOR.split(" ").map(Number) as [
      number,
      number
    ])
  );

  const ONLINE_STATUS_INDICATOR_HEX = "#e30000";

  if (onlineStatusIndicatorHexColour !== ONLINE_STATUS_INDICATOR_HEX) {
    await rebootRoK(device);

    throw new Error(
      "Rise of Kingdoms was closed and restarted. Please request your title again."
    );
  }

  const worker = await createWorker();

  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  await worker.setParameters({
    tessedit_ocr_engine_mode: "4" as unknown as OEM,
    tessedit_char_whitelist: "XY0123456789",
    tessedit_pageseg_mode: PSM.SPARSE_TEXT,
  });

  const KINGDOM_INPUT_VALUE = config.get(
    `kingdom.${kingdom.toLowerCase() as Lowercase<Kingdom>}`
  );

  // Open coordinates search overlay
  await device.shell(
    `input tap ${ELEMENT_POSITIONS.COORDINATES_SEARCH_BUTTON}`
  );

  // Tap kingdom id input
  await device.shell(`input tap ${ELEMENT_POSITIONS.KINGDOM_ID_INPUT}`);

  // Remove existing input (https://stackoverflow.com/a/72186108)
  await device.shell(
    "input keyevent --longpress 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67 67"
  );

  // Enter kingdom id
  await device.shell(`input text ${KINGDOM_INPUT_VALUE}`);

  // Tap "OK"
  await device.shell(`input tap ${ELEMENT_POSITIONS.INPUT_OK_BUTTON}`);

  // Tap x-coordinate input
  await device.shell(`input tap ${ELEMENT_POSITIONS.X_COORDINATE_INPUT}`);

  // Enter x-coordinate
  await device.shell(`input text ${x}`);

  // Tap "OK"
  await device.shell(`input tap ${ELEMENT_POSITIONS.INPUT_OK_BUTTON}`);

  // Tap y-coordinate input
  await device.shell(`input tap ${ELEMENT_POSITIONS.Y_COORDINATE_INPUT}`);

  // Enter y-coordinate
  await device.shell(`input text ${y}`);

  // Tap "OK"
  await device.shell(`input tap ${ELEMENT_POSITIONS.INPUT_OK_BUTTON}`);

  // Tap search button
  await device.shell(
    `input tap ${ELEMENT_POSITIONS.COORDINATES_OVERLAY_SEARCH_BUTTON}`
  );

  const isTravellingToNewKingdom = getLastVisitedKingdom() !== kingdom;

  await setTimeout(
    isTravellingToNewKingdom ? SLOW_TRAVEL_TIMEOUT : QUICK_TRAVEL_TIMEOUT
  );

  setLastVisitedKingdom(kingdom);

  // Tap city
  await device.shell(`input tap ${ELEMENT_POSITIONS.CITY_LOCATION}`);

  await setTimeout(UI_ELEMENT_ANIMATION_DURATION);

  const SCREENSHOT_PATH = join(process.cwd(), "temp", "screenshot.jpg");

  const ADD_TITLE_BUTTON_IMAGE_PATH = join(
    process.cwd(),
    "resources",
    "add-title-button.jpg"
  );

  await writeFile(SCREENSHOT_PATH, await device.screenshot());

  const addTitleButtoncoordinates = await findCutoutPosition(
    SCREENSHOT_PATH,
    ADD_TITLE_BUTTON_IMAGE_PATH
  );

  if (!addTitleButtoncoordinates) {
    throw new Error("You might have entered the wrong coordinates.");
  }

  // Tap title icon
  await device.shell(
    `input tap ${addTitleButtoncoordinates.x} ${addTitleButtoncoordinates.y}`
  );

  await setTimeout(UI_ELEMENT_ANIMATION_DURATION);

  const UNSELECTED_TITLE_CHECKBOX_BACKGROUND_COLOURS_HEX_START = "#00";

  const titleCheckboxHexColour = await getPixelHexColour(
    await device.screenshot(),
    ...(ELEMENT_POSITIONS[
      `${title.toUpperCase() as Uppercase<Title>}_TITLE_CHECKBOX`
    ]
      .split(" ")
      .map(Number) as [number, number])
  );

  const titleChecked = !titleCheckboxHexColour.startsWith(
    UNSELECTED_TITLE_CHECKBOX_BACKGROUND_COLOURS_HEX_START
  );

  if (titleChecked) {
    // Press close button
    await device.shell(
      `input tap ${ELEMENT_POSITIONS.TITLE_OVERLAY_CLOSE_BUTTON}`
    );

    throw new Error(`You already have the ${title} title.`);
  }

  // Tap selected title checkbox
  await device.shell(
    `input tap ${
      ELEMENT_POSITIONS[
        `${title.toUpperCase() as Uppercase<Title>}_TITLE_CHECKBOX`
      ]
    }`
  );

  await setTimeout(NEW_CLICK_IDLE_TIMEOUT);

  // Tap confirm button
  await device.shell(`input tap ${ELEMENT_POSITIONS.CONFIRM_BUTTON}`);

  await setTimeout(UI_ELEMENT_ANIMATION_DURATION);

  await worker.terminate();
};
