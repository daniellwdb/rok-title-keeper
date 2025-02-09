export interface Coordinate {
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export function coordinatesToRectangle(coordinates: Required<Coordinate>) {
  return {
    top: coordinates.y,
    left: coordinates.x,
    width: coordinates.w,
    height: coordinates.h,
  };
}
