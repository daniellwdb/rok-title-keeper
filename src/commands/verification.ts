import {
  ApplicationCommandType,
  AttachmentBuilder,
  DiscordjsError,
  DiscordjsErrorCodes,
  EmbedBuilder,
} from "discord.js";
import { createCommand } from "./util/create-command.js";
import { setTimeout } from "node:timers/promises";
import { ANIMATION_DELAY, THEME_COLOUR } from "../constants.js";
import path from "node:path";
import { getImageCoordinates } from "../util/get-image-coordinates.js";
import fs from "node:fs/promises";
import cv from "@u4/opencv4nodejs";
import { config } from "../config.js";

const X_PLACEMENT = 325;
const Y_PLACEMENT = 95;

export const verificationCommand = createCommand({
  type: ApplicationCommandType.ChatInput,
  name: "verification",
  description: "Manually start a verification process",
  async execute(interaction, { device }) {
    await interaction.deferReply();

    // Tap in empty position to reset verification process
    await device.shell("input tap 336 477");

    await setTimeout(ANIMATION_DELAY * 4);

    const verifyButtonImagePath = path.join(
      process.cwd(),
      "assets",
      "images",
      "verify-button.jpg"
    );
    const verifyButtonCoordinates = await getImageCoordinates(
      await device.screenshot(),
      await fs.readFile(verifyButtonImagePath)
    );

    if (!verifyButtonCoordinates) {
      return void interaction.followUp(
        config.VERIFICATION_NOT_REQUIRED_MESSAGE
      );
    }

    // Tap "VERIFY" button
    await device.shell(
      `input tap ${verifyButtonCoordinates.x} ${verifyButtonCoordinates.y}`
    );

    await setTimeout(ANIMATION_DELAY * 5);

    const screenshot = await cv.imdecodeAsync(await device.screenshot());

    const gridImagePath = path.join(
      process.cwd(),
      "assets",
      "images",
      "captcha-grid.png"
    );

    const grid = await cv.imreadAsync(gridImagePath, cv.IMREAD_UNCHANGED);
    const { rows: height, cols: width } = grid;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const overlayColor = (grid.atRaw(y, x) as unknown as number[]).slice(
          0,
          3
        );
        const overlayAlpha =
          (grid.atRaw(y, x) as unknown as number[])[3]! / 255;

        const backgroundAlpha = 1 - overlayAlpha;

        const compositeColor = [
          (
            screenshot.atRaw(
              y + Y_PLACEMENT,
              x + X_PLACEMENT
            ) as unknown as number[]
          )[0]! *
            backgroundAlpha +
            overlayColor[0]! * overlayAlpha,
          (
            screenshot.atRaw(
              y + Y_PLACEMENT,
              x + X_PLACEMENT
            ) as unknown as number[]
          )[1]! *
            backgroundAlpha +
            overlayColor[1]! * overlayAlpha,
          (
            screenshot.atRaw(
              y + Y_PLACEMENT,
              x + X_PLACEMENT
            ) as unknown as number[]
          )[2]! *
            backgroundAlpha +
            overlayColor[2]! * overlayAlpha,
        ];

        screenshot.set(y + Y_PLACEMENT, x + X_PLACEMENT, compositeColor);
      }
    }

    const captchaWithGridOverlay = await cv.imencodeAsync(".png", screenshot);

    const numRows = 7;
    const numColumns = 7;
    const squareSize = 50;
    const horizontalSpacing = 4;
    const verticalSpacing = 5;
    const centerXOffset = squareSize / 2;
    const centerYOffset = (squareSize + verticalSpacing) / 2;
    const centerCoordinates: Array<[number, number]> = [];

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
        const x =
          col * squareSize + (col > 0 ? horizontalSpacing : 0) + centerXOffset;
        const y = row * (squareSize + verticalSpacing) + centerYOffset;
        centerCoordinates.push([x + X_PLACEMENT, y + Y_PLACEMENT]);
      }
    }

    const files = [
      new AttachmentBuilder(captchaWithGridOverlay, {
        name: "screenshot.jpg",
        description: "Rise of Kingdoms screenshot",
      }),
    ];

    const embed = new EmbedBuilder()
      .setColor(THEME_COLOUR)
      .setTitle(`Verification started by ${interaction.member.displayName}`)
      .setDescription(config.PROVIDE_POSITIONS_MESSAGE)
      .setImage("attachment://screenshot.jpg");

    await interaction.followUp({ embeds: [embed], files, fetchReply: true });

    try {
      const collected = await interaction.channel?.awaitMessages({
        filter: (message) =>
          message.content.split(" ").every((value) => /^-?\d+$/.test(value)),
        max: 1,
        time: 60_000,
        errors: ["time"],
      });

      const content = collected?.first()?.content;

      if (!content) {
        return void interaction.followUp(config.NO_VALID_RESPONSE_MESSAGE);
      }

      const positions = content.split(" ").map(Number);

      const coordinates = positions.map(
        (pos) => centerCoordinates.at(pos - 1)!
      );

      for (const [x, y] of coordinates) {
        await device.shell(`input tap ${x} ${y}`);
        await setTimeout(250);
      }

      // Tap ok button
      await device.shell("input tap 701 415");

      await setTimeout(ANIMATION_DELAY * 6);

      const verifyOkButtonImagePath = path.join(
        process.cwd(),
        "assets",
        "images",
        "verify-ok-button.jpg"
      );
      const okButtonCoordinates = await getImageCoordinates(
        await device.screenshot(),
        await fs.readFile(verifyOkButtonImagePath)
      );

      if (okButtonCoordinates) {
        return void interaction.followUp(config.VERIFICATION_FAILED_MESSAGE);
      }

      return void interaction.followUp(config.VERIFICATION_SUCCESS_MESSAGE);
    } catch (error) {
      if (
        error instanceof DiscordjsError &&
        error.code === DiscordjsErrorCodes.InteractionCollectorError
      ) {
        return void interaction.followUp(config.NO_VALID_RESPONSE_MESSAGE);
      }

      throw error;
    }
  },
});
