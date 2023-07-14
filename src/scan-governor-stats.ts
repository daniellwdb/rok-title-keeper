import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import type { PrismaClient } from "@prisma/client";
import type { Device } from "adb-ts";
import clipboard from "clipboardy";
import sharp from "sharp";
import { OEM, PSM, createWorker } from "tesseract.js";
import { findCutoutPosition } from "./util/find-cutout-position.js";
import { updateGovernorDKP, upsertGovernorDKP } from "./util/governor-dkp.js";
import { rebootRoK } from "./util/reboot-rok.js";

const ELEMENT_POSITIONS = {
  GOVERNOR_PROFILE_BUTTON: "60 50",
  GOVERNOR_PROFILE_PREVIEW_X_COORDINATE: 690,
  RANKINGS_BUTTON: "550 670",
  GOVERNOR_PROFILE_PREVIEW_Y_CLICK_COORDINATES: [285, 390, 490, 590, 605],
  POWER_LABEL: {
    left: 898,
    top: 364,
    width: 180,
    height: 44,
  },
  KILL_POINTS_LABEL: {
    left: 1114,
    top: 364,
    width: 222,
    height: 44,
  },
  GOVERNOR_ID_LABEL: {
    left: 770,
    top: 230,
    width: 200,
    height: 35,
  },
  KILL_TIER_LABELS: {
    left: 861,
    top: 459,
    width: 129,
    height: 219,
  },
  MORE_INFO_LABELS: {
    left: 1126,
    top: 254,
    width: 181,
    height: 527,
  },
  MORE_INFO_CLOSE_BUTTON: "1396 58",
  GOVERNOR_PROFILE_CLOSE_BUTTON: "1365 104",
  CLOSE_KILL_RANKINGS_BUTTON: "1395 55",
  KILL_RANKINGS_BUTTON: "825 525",
} as const;

const ANIMATION_DURATION = 750;

const RESOURCE_ROOT_PATH = join(process.cwd(), "resources", "stats-scan");
const TEMP_ROOT_PATH = join(process.cwd(), "temp");

export const scanGovernorStats = async (
  device: Device,
  top: number,
  prisma: PrismaClient,
  newKvK: boolean,
  resetPower: boolean,
  resetKp: boolean,
) => {
  await rebootRoK(device);

  // Open governor profile
  await device.shell("input tap 60 50");

  await setTimeout(ANIMATION_DURATION);

  // Open Rankings
  await device.shell(`input tap ${ELEMENT_POSITIONS.RANKINGS_BUTTON}`);

  await setTimeout(ANIMATION_DURATION);

  // Open individual kill rankings
  await device.shell(`input tap ${ELEMENT_POSITIONS.KILL_RANKINGS_BUTTON}`);

  await setTimeout(ANIMATION_DURATION);

  const worker = await createWorker();

  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  await worker.setParameters({
    tessedit_ocr_engine_mode: "4" as unknown as OEM,
    tessedit_char_whitelist: "0123456789",
    tessedit_pageseg_mode: PSM.SINGLE_LINE,
  });

  let fails = 0;

  for (let i = 0; i < top; i++) {
    if (fails > 250) {
      throw new Error("Failed to open governor profile over 250 times.");
    }

    const NEXT_CLICK_POS = i > 4 ? 4 : i;

    // Open governor profile
    await device.shell(
      `input tap ${ELEMENT_POSITIONS.GOVERNOR_PROFILE_PREVIEW_X_COORDINATE} ${ELEMENT_POSITIONS.GOVERNOR_PROFILE_PREVIEW_Y_CLICK_COORDINATES[NEXT_CLICK_POS]}`,
    );

    await setTimeout(ANIMATION_DURATION);

    await writeFile(
      join(TEMP_ROOT_PATH, "governor-profile.jpg"),
      await device.screenshot(),
    );

    const moreInfoButtonCoordinates = await findCutoutPosition(
      join(TEMP_ROOT_PATH, "governor-profile.jpg"),
      join(RESOURCE_ROOT_PATH, "more-info-button.jpg"),
    );

    if (!moreInfoButtonCoordinates) {
      fails++;

      // Swipe to next governor profile
      await device.shell("input swipe 690 605 690 540");

      await setTimeout(ANIMATION_DURATION);

      continue;
    }

    await clipboard.write("");

    const copyNicknameButtonCoordinates = await findCutoutPosition(
      join(TEMP_ROOT_PATH, "governor-profile.jpg"),
      join(RESOURCE_ROOT_PATH, "copy-nickname-button.jpg"),
    );

    if (!copyNicknameButtonCoordinates) {
      throw new Error("Could not locate coordinates for copying nickname.");
    }

    // Copy nickname
    await device.shell(
      `input tap ${copyNicknameButtonCoordinates.x} ${copyNicknameButtonCoordinates.y}`,
    );

    await setTimeout(ANIMATION_DURATION);

    const nickname = await clipboard.read();

    const governorProfileToBW = await sharp(
      join(TEMP_ROOT_PATH, "governor-profile.jpg"),
    )
      .threshold(210)
      .blur(0.75)
      .toBuffer();

    const {
      data: { text: power },
    } = await worker.recognize(governorProfileToBW, {
      rectangle: ELEMENT_POSITIONS.POWER_LABEL,
    });

    const {
      data: { text: killPoints },
    } = await worker.recognize(governorProfileToBW, {
      rectangle: ELEMENT_POSITIONS.KILL_POINTS_LABEL,
    });

    const governorProfileToGrayScale = await sharp(
      join(TEMP_ROOT_PATH, "governor-profile.jpg"),
    )
      .grayscale()
      .toBuffer();

    const {
      data: { text: governorID },
    } = await worker.recognize(governorProfileToGrayScale, {
      rectangle: ELEMENT_POSITIONS.GOVERNOR_ID_LABEL,
    });

    const killStatisticsButtonCoordinates = await findCutoutPosition(
      join(TEMP_ROOT_PATH, "governor-profile.jpg"),
      join(RESOURCE_ROOT_PATH, "kill-statistics-button.jpg"),
    );

    if (!killStatisticsButtonCoordinates) {
      throw new Error(
        "Could not locate coordinates for opening kill statistics.",
      );
    }

    // Open kill statistics
    await device.shell(
      `input tap ${killStatisticsButtonCoordinates.x} ${killStatisticsButtonCoordinates.y}`,
    );

    await setTimeout(ANIMATION_DURATION);

    const killStatisticsToBW = await sharp(await device.screenshot())
      .threshold(210)
      .blur(0.75)
      .toBuffer();

    await worker.setParameters({
      tessedit_ocr_engine_mode: "4" as unknown as OEM,
      tessedit_char_whitelist: "0123456789",
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });

    const {
      data: { text: kills },
    } = await worker.recognize(killStatisticsToBW, {
      rectangle: ELEMENT_POSITIONS.KILL_TIER_LABELS,
    });

    const tierKills = Object.fromEntries(
      kills
        .split("\n")
        .filter(Boolean)
        .map((kills, index) => [`tier${index + 1}kp`, kills]),
    ) as Record<`tier${1 | 2 | 3 | 4 | 5}kp`, string>;

    // Open More Info
    const BUTTON_CLICK_AREA_OFFSET = 50;

    await device.shell(
      `input tap ${moreInfoButtonCoordinates.x + BUTTON_CLICK_AREA_OFFSET} ${
        moreInfoButtonCoordinates.y + BUTTON_CLICK_AREA_OFFSET
      }`,
    );

    await setTimeout(ANIMATION_DURATION);

    const moreInfoStatsToGrayscale = await sharp(await device.screenshot())
      .grayscale()
      .jpeg()
      .toBuffer();

    const {
      data: { text: moreInfoStats },
    } = await worker.recognize(moreInfoStatsToGrayscale, {
      rectangle: ELEMENT_POSITIONS.MORE_INFO_LABELS,
    });

    const statsValues = moreInfoStats.split("\n").filter(Boolean);

    const dead = statsValues.at(3);
    const resourceAssistance = statsValues.at(6);

    // Close More Info
    await device.shell(`input tap ${ELEMENT_POSITIONS.MORE_INFO_CLOSE_BUTTON}`);

    await setTimeout(ANIMATION_DURATION);

    // Close Governor Profile
    await device.shell(
      `input tap ${ELEMENT_POSITIONS.GOVERNOR_PROFILE_CLOSE_BUTTON}`,
    );

    await setTimeout(ANIMATION_DURATION);

    if (
      !nickname ||
      !power ||
      !killPoints ||
      !governorID ||
      !dead ||
      !resourceAssistance ||
      Object.values(tierKills).some((tierKills) => !tierKills)
    ) {
      continue;
    }

    const governor = {
      nickname,
      power: power.trim(),
      kp: killPoints.trim(),
      id: governorID.trim(),
      ...tierKills,
      dead,
      resourceAssistance,
    };

    if (!newKvK) {
      await updateGovernorDKP(prisma, governor);
    } else {
      await upsertGovernorDKP(prisma, governor, resetPower, resetKp);
    }
  }

  // Close individual kill rankings
  await device.shell(
    `input tap ${ELEMENT_POSITIONS.CLOSE_KILL_RANKINGS_BUTTON}`,
  );

  await setTimeout(ANIMATION_DURATION);

  // Open individual kill rankings
  await device.shell(`input tap ${ELEMENT_POSITIONS.KILL_RANKINGS_BUTTON}`);

  await worker.terminate();
};
