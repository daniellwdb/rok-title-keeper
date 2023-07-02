// eslint-disable-next-line import/no-named-as-default
import cv from "@u4/opencv4nodejs";

export const findCutoutPosition = async (
  originalImagePath: string,
  cutoutImagePath: string,
  similarityThreshold = 0.8
) => {
  const originalImage = await cv.imreadAsync(originalImagePath);
  const cutoutImage = await cv.imreadAsync(cutoutImagePath);

  const originalImageToGray = originalImage.cvtColor(cv.COLOR_BGR2GRAY);
  const cutoutImageToGray = cutoutImage.cvtColor(cv.COLOR_BGR2GRAY);

  const matched = originalImageToGray.matchTemplate(
    cutoutImageToGray,
    cv.TM_CCOEFF_NORMED
  );
  const { maxLoc, maxVal } = matched.minMaxLoc();

  if (maxVal >= similarityThreshold) {
    return {
      x: maxLoc.x,
      y: maxLoc.y,
    };
  }
};
