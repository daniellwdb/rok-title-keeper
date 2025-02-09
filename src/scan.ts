import type { TaskType, Task } from "./queue.js";
import cv from "@u4/opencv4nodejs";
import { setTimeout } from "node:timers/promises";
import { OEM, PSM, createScheduler, createWorker } from "tesseract.js";
import clipboard from "clipboardy";
import { GovernorCreateSchema } from "./schemas/governor-create.js";
import path from "node:path";
import fs from "node:fs/promises";
import { getImageCoordinates } from "./util/get-image-coordinates.js";
import {
  coordinatesToRectangle,
  type Coordinate,
} from "./util/coordinates-to-rectangle.js";
import { ANIMATION_DELAY, COORDINATES, GovernorRankings } from "./constants.js";
import { waitForImageCoordinatesOrThrow } from "./util/wait-for-image-coordinates-or-throw.js";

// #region Constants
const SCAN_COORDINATES = {
  RANKINGS_BUTTON: {
    x: 245,
    y: 457,
  },
  INDIVIDUAL_KILLS_FLAG: {
    x: 435,
    y: 270,
  },
  INDIVIDUAL_POWER_FLAG: {
    x: 170,
    y: 270,
  },
  GOVERNOR_ID: {
    x: 462,
    y: 111,
    w: 77,
    h: 23,
  },
  ALLIANCE_TAG: {
    x: 381,
    y: 205,
    w: 162,
    h: 26,
  },
  POWER: {
    x: 556,
    y: 200,
    w: 98,
    h: 26,
  },
  KILL_POINTS: {
    x: 754,
    y: 201,
    w: 111,
    h: 26,
  },
  KILL_STATISTICS_BUTTON: {
    x: 748,
    y: 190,
  },
  MORE_INFO_BUTTON: {
    x: 151,
    y: 465,
  },
  MORE_INFO_CLOSE_BUTTON: {
    x: 890,
    y: 35,
  },
  GOVERNOR_PROFILE_CLOSE_BUTTON: {
    x: 924,
    y: 56,
  },
  RANKINGS_CLOSE_BUTTON: {
    x: 890,
    y: 32,
  },
  RANKINGS_OVERVIEW_CLOSE_BUTTON: {
    x: 888,
    y: 35,
  },
  KILLS: {
    x: 586,
    y: 265,
    w: 70,
    h: 129,
  },
  DEAD: {
    x: 729,
    y: 275,
    w: 109,
    h: 33,
  },
  RESOURCE_ASSISTANCE: {
    x: 729,
    y: 420,
    w: 109,
    h: 33,
  },
  MAP_ICON: {
    x: 46,
    y: 513,
  },
} satisfies Record<string, Coordinate>;

const SWIPE_ANIMATION_DELAY = 500;
const GOVERNOR_PROFILE_PREVIEW_X_COORDINATE = 690;
const GOVERNOR_PROFILE_PREVIEW_Y_COORDINATES = [170, 244, 306, 369, 388];
const SWIPE_UP_GESTURE_COORDINATES = "690 388 690 343";

const TIMINGS = {
  OPEN_GOVERNOR_PROFILE: 1000 * 2,
  CLOSE_GOVERNOR_PROFILE: 1000 * 1,
  COPY_NICKNAME: 750,
  KILL_STATISTICS: 1000 * 1,
  MORE_INFO_OPEN: 1000 * 1,
  MORE_INFO_CLOSE: 1000 * 0.5,
};
// #endregion

function randomDelay() {
  return 1000 * (Math.random() * 0.1);
}

function getRandomCoordinatesBetween(coordinates: Coordinate) {
  const x = Math.floor(Math.random() * coordinates.x) + coordinates.x + 2;
  const y = Math.floor(Math.random() * coordinates.y) + coordinates.y + 2;

  return { ...coordinates, x, y };
}

async function preprocessImage(imageBuffer: Buffer, grayscale = false) {
  const image = await cv.imdecodeAsync(imageBuffer, cv.IMREAD_UNCHANGED);

  if (grayscale) {
    const imageGray = await image.cvtColorAsync(cv.COLOR_BGR2GRAY);
    const imageEncoded = await cv.imencodeAsync(".tiff", imageGray);

    return imageEncoded;
  }

  const imageThresholded = await image.thresholdAsync(
    185,
    255,
    cv.THRESH_BINARY
  );
  const imageBlurred = await imageThresholded.blurAsync(
    new cv.Size(0.75, 0.75)
  );
  const imageEncoded = await cv.imencodeAsync(".tiff", imageBlurred);

  return imageEncoded;
}

export async function scan(options: Extract<Task, { type: TaskType.SCAN }>) {
  // Tap map icon location to make sure governor profile is visible
  await options.device.shell(
    `input tap ${SCAN_COORDINATES.MAP_ICON.x} ${SCAN_COORDINATES.MAP_ICON.y}`
  );

  await setTimeout(10_000);

  // #region Open rankings
  // Tap border to open governor profile
  await options.device.shell(
    `input tap ${COORDINATES.GOVERNOR_PROFILE_BORDER.x} ${COORDINATES.GOVERNOR_PROFILE_BORDER.x}`
  );

  await setTimeout(ANIMATION_DELAY + randomDelay());

  const moreInfoButtonPath = path.join(
    process.cwd(),
    "assets",
    "images",
    "more-info-button.jpg"
  );

  await waitForImageCoordinatesOrThrow({
    name: "more-info-button",
    template: await fs.readFile(moreInfoButtonPath),
    ...options,
  });

  // Tap "Rankings" button
  await options.device.shell(
    `input tap ${SCAN_COORDINATES.RANKINGS_BUTTON.x} ${SCAN_COORDINATES.RANKINGS_BUTTON.y}`
  );

  await setTimeout(ANIMATION_DELAY);

  const individualKillsIcon = path.join(
    process.cwd(),
    "assets",
    "images",
    "individual-kills-icon.jpg"
  );

  await waitForImageCoordinatesOrThrow({
    name: "individual-kills-icon",
    template: await fs.readFile(individualKillsIcon),
    ...options,
  });

  const flagCoordinates =
    options.rankingsType === GovernorRankings.INDIVIDUAL_POWER
      ? SCAN_COORDINATES.INDIVIDUAL_POWER_FLAG
      : SCAN_COORDINATES.INDIVIDUAL_KILLS_FLAG;

  // Tap chosen rank flag
  await options.device.shell(
    `input tap ${flagCoordinates.x} ${flagCoordinates.y}`
  );

  await setTimeout(ANIMATION_DELAY);

  const rankingsRibbonImagePath = path.join(
    process.cwd(),
    "assets",
    "images",
    "rankings-ribbon.jpg"
  );

  await waitForImageCoordinatesOrThrow({
    name: "rankings-ribbon",
    template: await fs.readFile(rankingsRibbonImagePath),
    ...options,
  });
  // #endregion

  const maxFails = options.top / 2;

  let fails = 0;

  for (const i of [...Array(options.top).keys()]) {
    if (fails > maxFails) {
      throw new Error(
        `Failed to open governor profile over ${maxFails} times.`
      );
    }

    if (i % 5 === 0) {
      options.logger.info(`Scan progress: ${i}/${options.top}`);
    }

    const NEXT_CLICK_POS = i > 4 ? 4 : i;

    // Tap governor profile preview
    await options.device.shell(
      `input tap ${GOVERNOR_PROFILE_PREVIEW_X_COORDINATE} ${GOVERNOR_PROFILE_PREVIEW_Y_COORDINATES[NEXT_CLICK_POS]}`
    );

    await setTimeout(TIMINGS.OPEN_GOVERNOR_PROFILE + randomDelay());

    try {
      await waitForImageCoordinatesOrThrow({
        name: "more-info-button",
        template: await fs.readFile(moreInfoButtonPath),
        ...options,
      });
    } catch {
      fails++;

      // Swipe to next governor profile
      await options.device.shell(`input swipe ${SWIPE_UP_GESTURE_COORDINATES}`);

      await setTimeout(SWIPE_ANIMATION_DELAY);

      continue;
    }

    const governorProfileScreenshot = await options.device.screenshot();

    // #region Copy governor nickname
    await clipboard.write("");

    const copyNicknameButtonPath = path.join(
      process.cwd(),
      "assets",
      "images",
      "copy-nickname-button.png"
    );

    const copyNicknameButtonCoordinates = await getImageCoordinates(
      await options.device.screenshot(),
      await fs.readFile(copyNicknameButtonPath)
    );

    if (!copyNicknameButtonCoordinates) {
      options.logger.warn(
        `Could not find copy nickname button for governor ${i}.`
      );

      // Tap governor profile close button
      const governorProfileCloseButtonCoordinates = getRandomCoordinatesBetween(
        SCAN_COORDINATES.GOVERNOR_PROFILE_CLOSE_BUTTON
      );

      await options.device.shell(
        `input tap ${governorProfileCloseButtonCoordinates.x} ${governorProfileCloseButtonCoordinates.y}`
      );

      await setTimeout(ANIMATION_DELAY);

      continue;
    }

    // Tap governor nickname copy button
    await options.device.shell(
      `input tap ${copyNicknameButtonCoordinates.x} ${copyNicknameButtonCoordinates.y}`
    );

    await setTimeout(TIMINGS.COPY_NICKNAME + randomDelay());

    const nickname = await clipboard.read();
    // #endregion

    await waitForImageCoordinatesOrThrow({
      name: "more-info-button",
      template: await fs.readFile(moreInfoButtonPath),
      ...options,
    });

    await options.device.shell(
      `input tap ${SCAN_COORDINATES.KILL_STATISTICS_BUTTON.x} ${SCAN_COORDINATES.KILL_STATISTICS_BUTTON.y}`
    );

    await setTimeout(TIMINGS.KILL_STATISTICS + randomDelay());

    const killStatisticsScreenshot = await options.device.screenshot();

    await options.device.shell(
      `input tap ${SCAN_COORDINATES.MORE_INFO_BUTTON.x} ${SCAN_COORDINATES.MORE_INFO_BUTTON.y}`
    );

    await setTimeout(TIMINGS.MORE_INFO_OPEN + randomDelay());

    const moreInfoScreenshot = await options.device.screenshot();

    const allianceTagWorker = await createWorker("eng", OEM.LSTM_ONLY);

    const {
      data: { text },
    } = await allianceTagWorker.recognize(
      await preprocessImage(governorProfileScreenshot, true),
      {
        rectangle: coordinatesToRectangle(SCAN_COORDINATES.ALLIANCE_TAG),
      }
    );

    await allianceTagWorker.terminate();

    const scheduler = createScheduler();
    const governorIdWorker = await createWorker("eng", OEM.LSTM_ONLY);
    const powerWorker = await createWorker("eng", OEM.LSTM_ONLY);
    const killPointsWorker = await createWorker("eng", OEM.LSTM_ONLY);
    const tierKillsWorker = await createWorker("eng", OEM.LSTM_ONLY);
    const moreInfoDeadWorker = await createWorker("eng", OEM.LSTM_ONLY);
    const moreInfoResourceAssistanceWorker = await createWorker(
      "eng",
      OEM.LSTM_ONLY
    );

    await Promise.all(
      [
        governorIdWorker,
        powerWorker,
        killPointsWorker,
        tierKillsWorker,
        moreInfoDeadWorker,
        moreInfoResourceAssistanceWorker,
      ].map(async (worker) => {
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
          tessedit_char_whitelist: "0123456789",
        });

        scheduler.addWorker(worker);
      })
    );

    const governorProfileRectangles = [
      coordinatesToRectangle(SCAN_COORDINATES.POWER),
      coordinatesToRectangle(SCAN_COORDINATES.KILL_POINTS),
    ];

    const results = await Promise.all([
      scheduler.addJob(
        "recognize",
        await preprocessImage(governorProfileScreenshot, true),
        {
          rectangle: coordinatesToRectangle(SCAN_COORDINATES.GOVERNOR_ID),
        }
      ),
      ...governorProfileRectangles.map(async (rectangle) =>
        scheduler.addJob(
          "recognize",
          await preprocessImage(governorProfileScreenshot),
          { rectangle }
        )
      ),
      scheduler.addJob(
        "recognize",
        await preprocessImage(killStatisticsScreenshot, true),
        {
          rectangle: coordinatesToRectangle(SCAN_COORDINATES.KILLS),
        }
      ),
      scheduler.addJob(
        "recognize",
        await preprocessImage(moreInfoScreenshot, true),
        {
          rectangle: coordinatesToRectangle(SCAN_COORDINATES.DEAD),
        }
      ),
      scheduler.addJob(
        "recognize",
        await preprocessImage(moreInfoScreenshot, true),
        {
          rectangle: coordinatesToRectangle(
            SCAN_COORDINATES.RESOURCE_ASSISTANCE
          ),
        }
      ),
    ]);

    await scheduler.terminate();

    await options.device.shell(
      `input tap ${SCAN_COORDINATES.MORE_INFO_CLOSE_BUTTON.x} ${SCAN_COORDINATES.MORE_INFO_CLOSE_BUTTON.y}`
    );

    await setTimeout(TIMINGS.MORE_INFO_CLOSE + randomDelay());

    await options.device.shell(
      `input tap ${SCAN_COORDINATES.GOVERNOR_PROFILE_CLOSE_BUTTON.x} ${SCAN_COORDINATES.GOVERNOR_PROFILE_CLOSE_BUTTON.y}`
    );

    const [id, power, killPoints, tierKillsArray, dead, resourceAssistance] =
      results.map((result) => {
        const textArray = result.data.text.trim().split("\n");

        return textArray.length === 1 ? textArray.at(0)! : textArray;
      });

    const killsPerTier = (tierKillsArray as string[])
      .filter(Boolean)
      .reduce(
        (prev, curr, i) => ({ ...prev, [`tier${i + 1}Kills`]: curr }),
        {} as Record<`tier${1 | 2 | 3 | 4 | 5}Kills`, string>
      );

    const governorCreateSchemaResult =
      await GovernorCreateSchema.safeParseAsync({
        id: id as string,
        alliance: text.trim(),
        nickname,
        power: power as string,
        killPoints: killPoints as string,
        ...killsPerTier,
        dead,
        resourceAssistance,
      });

    if (!governorCreateSchemaResult.success) {
      fails++;

      options.logger.warn(
        `Not updating data for governor ${nickname}. ${governorCreateSchemaResult.error.message}`
      );

      continue;
    }

    await options.prisma.governor.upsert({
      where: {
        id: governorCreateSchemaResult.data.id,
      },
      create: governorCreateSchemaResult.data,
      update: governorCreateSchemaResult.data,
    });

    options.logger.info(`Updated data for governor ${nickname}.`);

    await setTimeout(TIMINGS.CLOSE_GOVERNOR_PROFILE + randomDelay());
    // #endregion
  }

  // Tap rankings close button
  await options.device.shell(
    `input tap ${SCAN_COORDINATES.RANKINGS_CLOSE_BUTTON.x} ${SCAN_COORDINATES.RANKINGS_CLOSE_BUTTON.y}`
  );

  await setTimeout(ANIMATION_DELAY + randomDelay());

  await waitForImageCoordinatesOrThrow({
    name: "individual-kills-icon",
    template: await fs.readFile(individualKillsIcon),
    ...options,
  });

  // Tap rankings overview close button
  await options.device.shell(
    `input tap ${SCAN_COORDINATES.RANKINGS_OVERVIEW_CLOSE_BUTTON.x} ${SCAN_COORDINATES.RANKINGS_OVERVIEW_CLOSE_BUTTON.y}`
  );

  await setTimeout(ANIMATION_DELAY + randomDelay());

  await waitForImageCoordinatesOrThrow({
    name: "more-info-button",
    template: await fs.readFile(moreInfoButtonPath),
    ...options,
  });

  // Tap governor profile close button
  await options.device.shell(
    `input tap ${SCAN_COORDINATES.GOVERNOR_PROFILE_CLOSE_BUTTON.x} ${SCAN_COORDINATES.GOVERNOR_PROFILE_CLOSE_BUTTON.y}`
  );
}
