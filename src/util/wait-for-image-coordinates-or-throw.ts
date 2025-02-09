import { getImageCoordinates } from "./get-image-coordinates.js";
import type { AppContext } from "../types.js";
import { restoreGameState } from "./restore-game-state.js";
import type { TaskType } from "../queue.js";

interface ImageSearchOptions extends AppContext {
  type: TaskType;
  name: string;
  template: Buffer;
}

const MAX_RETRIES = 3;

export async function waitForImageCoordinatesOrThrow(
  options: ImageSearchOptions,
  retries = 0
) {
  if (retries >= MAX_RETRIES) {
    throw new Error(`Could not find ${options.name} image.`);
  }

  const imageCoordinates = await getImageCoordinates(
    await options.device.screenshot(),
    options.template
  );

  if (!imageCoordinates) {
    await restoreGameState(options, options.type);

    return waitForImageCoordinatesOrThrow(options, retries + 1);
  }

  return imageCoordinates;
}
