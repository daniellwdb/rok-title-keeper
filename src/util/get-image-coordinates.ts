import cv from "@u4/opencv4nodejs";

const MIN_ACCURACY = 0.8;

export async function getImageCoordinates(source: Buffer, template: Buffer) {
  const haystack = await cv.imdecodeAsync(source);
  const needle = await cv.imdecodeAsync(template);

  const matched = await haystack.matchTemplateAsync(
    needle,
    cv.TM_CCOEFF_NORMED
  );

  const minMax = await matched.minMaxLocAsync();
  const { x, y } = minMax.maxLoc;
  const accuracy = minMax.maxVal;

  if (accuracy > MIN_ACCURACY) {
    return { x, y };
  }

  return undefined;
}
