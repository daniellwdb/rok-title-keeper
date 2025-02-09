import { ANIMATION_DELAY, SHORT_ANIMATION_DELAY, Title } from "./constants.js";
import type { Task, TaskType } from "./queue.js";
import type { Coordinate } from "./util/coordinates-to-rectangle.js";
import path from "node:path";
import { waitForImageCoordinatesOrThrow } from "./util/wait-for-image-coordinates-or-throw.js";
import fs from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { getHexAtPosition } from "./util/get-hex-at-position.js";
import { getImageCoordinates } from "./util/get-image-coordinates.js";
import { isSinnerTitle } from "./util/is-sinner-title.js";

const TITLE_COORDINATES = {
  SEARCH_TOGGLE_HK: {
    x: 212,
    y: 12,
  },
  SEARCH_TOGGLE_LK: {
    x: 195,
    y: 16,
  },
  KINGDOM_ID_INPUT: {
    x: 360,
    y: 110,
  },
  SEARCH_INPUT_OK_BUTTON: {
    x: 702,
    y: 109,
  },
  X_COORDINATE_INPUT: {
    x: 505,
    y: 115,
  },
  Y_COORDINATE_INPUT: {
    x: 635,
    y: 115,
  },
  JUSTICE_TITLE_CHECKBOX: {
    x: 235,
    y: 315,
  },
  DUKE_TITLE_CHECKBOX: {
    x: 415,
    y: 315,
  },
  ARCHITECT_TITLE_CHECKBOX: {
    x: 600,
    y: 315,
  },
  SCIENTIST_TITLE_CHECKBOX: {
    x: 785,
    y: 315,
  },
  TRAITOR_TITLE_CHECKBOX: { x: 240, y: 155 },
  BEGGAR_TITLE_CHECKBOX: { x: 420, y: 155 },
  EXILE_TITLE_CHECKBOX: { x: 600, y: 155 },
  SLAVE_TITLE_CHECKBOX: { x: 780, y: 155 },
  SLUGGARD_TITLE_CHECKBOX: { x: 240, y: 423 },
  FOOL_TITLE_CHECKBOX: { x: 420, y: 423 },
  TITLE_CLOSE_BUTTON: {
    x: 890,
    y: 35,
  },
} satisfies Record<string, Coordinate>;

const UNSELECTED_TITLE_CHECKBOX_BACKGROUND_HEX_START = "00";
const MAP_OVERVIEW_ANIMATION_DURATION = 750;
const MAX_RETRIES = 2;
const CITY_COORDINATES: Coordinate[] = [
  {
    x: 513.5,
    y: 283.5,
  },
  // {
  //   x: 482,
  //   y: 315,
  // },
  // {
  //   x: 543,
  //   y: 275,
  // },
];

export async function title(options: Extract<Task, { type: TaskType.TITLE }>) {
  // #region Start searching city
  const mapButtonImagePath = path.join(
    process.cwd(),
    "assets",
    "images",
    "map-button.jpg"
  );

  const mapButtonCoordinates = await getImageCoordinates(
    await options.device.screenshot(),
    await fs.readFile(mapButtonImagePath)
  );

  if (mapButtonCoordinates) {
    // Tap map button
    await options.device.shell(
      `input tap ${mapButtonCoordinates.x} ${mapButtonCoordinates.y}`
    );

    await setTimeout(MAP_OVERVIEW_ANIMATION_DURATION);
  }

  // Tap search overlay toggle
  let searchToggleCoordinates;

  try {
    const zoomIconPath = path.join(
      process.cwd(),
      "assets",
      "images",
      "zoom-icon.jpg"
    );

    await waitForImageCoordinatesOrThrow({
      name: "zoom-icon",
      template: await fs.readFile(zoomIconPath),
      ...options,
    });

    searchToggleCoordinates = TITLE_COORDINATES.SEARCH_TOGGLE_HK;
  } catch {
    searchToggleCoordinates = TITLE_COORDINATES.SEARCH_TOGGLE_LK;
  }

  await options.device.shell(
    `input tap ${searchToggleCoordinates.x} ${searchToggleCoordinates.y}`
  );

  await setTimeout(SHORT_ANIMATION_DELAY);

  const searchButtonPath = path.join(
    process.cwd(),
    "assets",
    "images",
    "search-button.png"
  );

  const searchCoordinates = await waitForImageCoordinatesOrThrow({
    name: "search-button",
    template: await fs.readFile(searchButtonPath),
    ...options,
  });

  // Tap kingdom ID input
  await options.device.shell(
    `input tap ${TITLE_COORDINATES.KINGDOM_ID_INPUT.x} ${TITLE_COORDINATES.KINGDOM_ID_INPUT.y}`
  );

  // Remove existing input (https://stackoverflow.com/a/72186108)
  await options.device.shell("input keyevent 67 67 67 67 67 67");

  // Enter kingdom ID
  for (const c of [...options.kingdomId]) {
    await options.device.shell(`input text ${c}`);
  }

  // Tap "OK" button
  await options.device.shell(
    `input tap ${TITLE_COORDINATES.SEARCH_INPUT_OK_BUTTON.x} ${TITLE_COORDINATES.SEARCH_INPUT_OK_BUTTON.y}`
  );

  // Tap x-coordinate input
  await options.device.shell(
    `input tap ${TITLE_COORDINATES.X_COORDINATE_INPUT.x} ${TITLE_COORDINATES.X_COORDINATE_INPUT.y}`
  );

  // Enter x-coordinate
  for (const n of [...`${options.x}`]) {
    await options.device.shell(`input text ${n}`);
  }

  // Tap "OK" button
  await options.device.shell(
    `input tap ${TITLE_COORDINATES.SEARCH_INPUT_OK_BUTTON.x} ${TITLE_COORDINATES.SEARCH_INPUT_OK_BUTTON.y}`
  );

  // Tap y-coordinate input
  await options.device.shell(
    `input tap ${TITLE_COORDINATES.Y_COORDINATE_INPUT.x} ${TITLE_COORDINATES.Y_COORDINATE_INPUT.y}`
  );

  // Enter y-coordinate
  for (const n of [...`${options.y}`]) {
    await options.device.shell(`input text ${n}`);
  }

  // Tap "OK" button
  await options.device.shell(
    `input tap ${TITLE_COORDINATES.SEARCH_INPUT_OK_BUTTON.x} ${TITLE_COORDINATES.SEARCH_INPUT_OK_BUTTON.y}`
  );

  // Tap search button
  await options.device.shell(
    `input tap ${searchCoordinates.x + 10} ${searchCoordinates.y + 10}`
  );
  // #endregion

  // #region Add title buff
  const titleButtonPath = path.join(
    process.cwd(),
    "assets",
    "images",
    "title-button.jpg"
  );

  const waitForTitleButtonCoordinatesOrThrow = async (
    retries = 0
  ): Promise<{
    titleButtonCoordinates: Coordinate;
    cityCoordinates: Coordinate;
  }> => {
    if (retries >= MAX_RETRIES) {
      throw new Error("You might have entered the wrong coordinates.");
    }

    for (const cityCoordinates of CITY_COORDINATES) {
      // Tap city
      await options.device.shell(
        `input tap ${cityCoordinates.x} ${cityCoordinates.y}`
      );

      await setTimeout(ANIMATION_DELAY);

      const titleButtonCoordinates = await getImageCoordinates(
        await options.device.screenshot(),
        await fs.readFile(titleButtonPath)
      );

      if (!titleButtonCoordinates) {
        // Tap city
        await options.device.shell(
          `input tap ${cityCoordinates.x} ${cityCoordinates.y}`
        );

        await setTimeout(ANIMATION_DELAY);
      }

      try {
        const titleButtonCoordinates = await waitForImageCoordinatesOrThrow({
          name: "title-button",
          template: await fs.readFile(titleButtonPath),
          ...options,
        });

        return {
          titleButtonCoordinates,
          cityCoordinates,
        };
      } catch (error) {
        options.logger.info(
          `Checking city location @${cityCoordinates.x}, ${cityCoordinates.y}${
            retries > 0 ? " (Retry)" : ""
          }.`
        );
      }
    }

    return waitForTitleButtonCoordinatesOrThrow(retries + 1);
  };

  const { titleButtonCoordinates, cityCoordinates } =
    await waitForTitleButtonCoordinatesOrThrow();

  // Tap title buff icon
  await options.device.shell(
    `input tap ${titleButtonCoordinates.x + 13} ${
      titleButtonCoordinates.y + 14
    }`
  );

  await setTimeout(ANIMATION_DELAY);

  const confirmButtonPath = path.join(
    process.cwd(),
    "assets",
    "images",
    "title-buff-confirm-button.png"
  );

  try {
    await waitForImageCoordinatesOrThrow({
      name: "title-buff-confirm-button",
      template: await fs.readFile(confirmButtonPath),
      ...options,
    });
  } catch {
    throw new Error("Failed to press title buff icon.");
  }

  const defenderTitleCheckboxCoordinates =
    TITLE_COORDINATES[
      `${options.title.toUpperCase() as Uppercase<Title>}_TITLE_CHECKBOX`
    ];

  if (!isSinnerTitle(options.title)) {
    //#region Check if defender title is checked
    const defenderTitleCheckboxHex = await getHexAtPosition({
      position: defenderTitleCheckboxCoordinates,
      ...options,
    });

    const defenderTitleChecked = !defenderTitleCheckboxHex.startsWith(
      UNSELECTED_TITLE_CHECKBOX_BACKGROUND_HEX_START
    );

    if (defenderTitleChecked) {
      // Press close button
      await options.device.shell(
        `input tap ${TITLE_COORDINATES.TITLE_CLOSE_BUTTON.x} ${TITLE_COORDINATES.TITLE_CLOSE_BUTTON.y}`
      );

      throw new Error(`You already have the ${options.title} title.`);
    }
  }

  //#region Check if sinner title is checked
  // Swipe to sinner titles
  await options.device.shell("input swipe 690 388 690 40");

  await setTimeout(ANIMATION_DELAY);

  const titleCheckedPath = path.join(
    process.cwd(),
    "assets",
    "images",
    "title-checked.jpg"
  );

  const sinnerTitleCheckedCoordinates = await getImageCoordinates(
    await options.device.screenshot(),
    await fs.readFile(titleCheckedPath)
  );

  if (sinnerTitleCheckedCoordinates && !isSinnerTitle(options.title)) {
    // Press close button
    await options.device.shell(
      `input tap ${TITLE_COORDINATES.TITLE_CLOSE_BUTTON.x} ${TITLE_COORDINATES.TITLE_CLOSE_BUTTON.y}`
    );

    throw new Error(
      "You have a sinner title. You can only request a defender title once your sinner title is removed."
    );
  }
  // #endregion

  if (!isSinnerTitle(options.title)) {
    // Press close button
    await options.device.shell(
      `input tap ${TITLE_COORDINATES.TITLE_CLOSE_BUTTON.x} ${TITLE_COORDINATES.TITLE_CLOSE_BUTTON.y}`
    );

    await setTimeout(ANIMATION_DELAY);

    // Tap city
    await options.device.shell(
      `input tap ${cityCoordinates.x} ${cityCoordinates.y}`
    );

    await setTimeout(ANIMATION_DELAY);

    // Tap city
    await options.device.shell(
      `input tap ${cityCoordinates.x} ${cityCoordinates.y}`
    );

    await setTimeout(ANIMATION_DELAY);

    const maybeTitleButtonCoordinates = await getImageCoordinates(
      await options.device.screenshot(),
      await fs.readFile(titleButtonPath)
    );

    if (!maybeTitleButtonCoordinates) {
      // Tap city
      await options.device.shell(
        `input tap ${cityCoordinates.x} ${cityCoordinates.y}`
      );

      await setTimeout(ANIMATION_DELAY);
    }

    // Tap title buff icon
    await options.device.shell(
      `input tap ${titleButtonCoordinates.x + 13} ${
        titleButtonCoordinates.y + 14
      }`
    );

    await setTimeout(ANIMATION_DELAY);
  }

  // Tap selected title checkbox
  await options.device.shell(
    `input tap ${defenderTitleCheckboxCoordinates.x} ${defenderTitleCheckboxCoordinates.y}`
  );

  await setTimeout(ANIMATION_DELAY);

  const confirmButtonCoordinates = await waitForImageCoordinatesOrThrow({
    name: "title-buff-confirm-button",
    template: await fs.readFile(confirmButtonPath),
    ...options,
  });

  // Tap confirm button
  await options.device.shell(
    `input tap ${confirmButtonCoordinates.x} ${confirmButtonCoordinates.y}`
  );

  await setTimeout(ANIMATION_DELAY);
  // #endregion
}
