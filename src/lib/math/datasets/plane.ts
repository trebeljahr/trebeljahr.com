import { Point, randUniform } from "./utils";

export function regressPlane(numSamples: number): Point[] {
  let radius = 6;

  let points: Point[] = [];
  for (let i = 0; i < numSamples; i++) {
    let x = randUniform(-radius, radius);
    let y = randUniform(-radius, radius);
    points.push({ x, y });
  }
  return points;
}
