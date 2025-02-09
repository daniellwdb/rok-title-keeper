import rgbHex from "rgb-hex";
import cv from "@u4/opencv4nodejs";
import type { AppContext } from "../types.js";
import type { Coordinate } from "./coordinates-to-rectangle.js";
import type { TaskType } from "../queue.js";

export interface HexSearchOptions extends AppContext {
  type: TaskType;
  hex: string;
  position: Coordinate;
}

export async function getHexAtPosition(options: Omit<HexSearchOptions, "hex">) {
  const image = await cv.imdecodeAsync(await options.device.screenshot());

  const { x: col, y: row } = options.position;

  const [b, g, r] = image.atRaw(row, col) as unknown as [
    number,
    number,
    number
  ];

  const hex = rgbHex(r, g, b);

  return hex;
}
