import sharp from "sharp";
import { rgbToHex } from "./rgb-to-hex.js";

export const getPixelHexColour = async (
  imageBuffer: Buffer,
  x: number,
  y: number
) => {
  const CHANNELS = 4;
  const image = sharp(imageBuffer);

  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelIndex = (y * info.width + x) * CHANNELS;

  const r = data[pixelIndex] ?? 0;
  const g = data[pixelIndex + 1] ?? 0;
  const b = data[pixelIndex + 2] ?? 0;

  const hexColor = rgbToHex(r, g, b);

  return hexColor;
};
