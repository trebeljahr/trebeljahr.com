import { dist, Point, randUniform } from "./utils";

export function createCircleData(
  numSamples: number,
  noise: number
): [Point[], Point[]] {
  let points1: Point[] = [];
  let points2: Point[] = [];
  let radius = 5;
  function getCircleLabel(p: Point, center: Point) {
    return dist(p, center) < radius * 0.5;
  }

  for (let i = 0; i < numSamples / 2; i++) {
    let r = randUniform(0, radius * 0.5);
    let angle = randUniform(0, 2 * Math.PI);
    let x = r * Math.sin(angle);
    let y = r * Math.cos(angle);
    let noiseX = randUniform(-radius, radius) * noise;
    let noiseY = randUniform(-radius, radius) * noise;
    let label = getCircleLabel(
      { x: x + noiseX, y: y + noiseY },
      { x: 0, y: 0 }
    );
    if (label) {
      points1.push({ x, y });
    } else {
      points2.push({ x, y });
    }
  }

  // Generate negative points outside the circle.
  for (let i = 0; i < numSamples / 2; i++) {
    let r = randUniform(radius * 0.7, radius);
    let angle = randUniform(0, 2 * Math.PI);
    let x = r * Math.sin(angle);
    let y = r * Math.cos(angle);
    let noiseX = randUniform(-radius, radius) * noise;
    let noiseY = randUniform(-radius, radius) * noise;
    let label = getCircleLabel(
      { x: x + noiseX, y: y + noiseY },
      { x: 0, y: 0 }
    );
    if (label) {
      points1.push({ x, y });
    } else {
      points2.push({ x, y });
    }
  }
  return [points1, points2];
}
