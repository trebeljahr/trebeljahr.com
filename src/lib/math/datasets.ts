export type DataGenerator = (numSamples: number, noise: number) => Point[];

type Point = {
  x: number;
  y: number;
};

export function classifyTwoGaussData(
  numSamples: number,
  noise: number
): Point[] {
  let points: Point[] = [];

  function genGauss(cx: number, cy: number, label: number) {
    for (let i = 0; i < numSamples / 2; i++) {
      let x = normalRandom(cx);
      let y = normalRandom(cy);
      points.push({ x, y });
    }
  }

  genGauss(2, 2, 1); // Gaussian with positive examples.
  genGauss(-2, -2, -1); // Gaussian with negative examples.
  return points;
}

export function regressPlane(numSamples: number, noise: number): Point[] {
  let radius = 6;

  let points: Point[] = [];
  for (let i = 0; i < numSamples; i++) {
    let x = randUniform(-radius, radius);
    let y = randUniform(-radius, radius);
    points.push({ x, y });
  }
  return points;
}

export function regressGaussian(numSamples: number, noise: number): Point[] {
  let points: Point[] = [];

  let gaussians = [
    [-4, 2.5, 1],
    [0, 2.5, -1],
    [4, 2.5, 1],
    [-4, -2.5, -1],
    [0, -2.5, 1],
    [4, -2.5, -1],
  ];

  function getLabel(x: number, y: number) {
    // Choose the one that is maximum in abs value.
    let label = 0;
    gaussians.forEach(([cx, cy, sign]) => {
      let newLabel = sign * labelScale(dist({ x, y }, { x: cx, y: cy }));
      if (Math.abs(newLabel) > Math.abs(label)) {
        label = newLabel;
      }
    });
    return label;
  }
  let radius = 6;
  for (let i = 0; i < numSamples; i++) {
    let x = randUniform(-radius, radius);
    let y = randUniform(-radius, radius);
    points.push({ x, y });
  }
  return points;
}

export function genSpiral(numSamples: number, noise: number, deltaT: number) {
  let points: Point[] = [];
  let n = numSamples / 2;
  for (let i = 0; i < n; i++) {
    let r = (i / n) * 5;
    let t = ((1.75 * i) / n) * 2 * Math.PI + deltaT;
    let x = r * Math.sin(t) + randUniform(-1, 1) * noise;
    let y = r * Math.cos(t) + randUniform(-1, 1) * noise;
    points.push({ x, y });
  }
  return points;
}

export function classifyCircleData(numSamples: number, noise: number): Point[] {
  let points: Point[] = [];
  let radius = 5;
  function getCircleLabel(p: Point, center: Point) {
    return dist(p, center) < radius * 0.5 ? 1 : -1;
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
    points.push({ x, y, label });
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
    points.push({ x, y, label });
  }
  return points;
}

export function classifyXORData(numSamples: number, noise: number): Point[] {
  function getXORLabel(p: Point) {
    return p.x * p.y >= 0 ? 1 : -1;
  }

  let points: Point[] = [];
  for (let i = 0; i < numSamples; i++) {
    let x = randUniform(-5, 5);
    let padding = 0.3;
    x += x > 0 ? padding : -padding; // Padding.
    let y = randUniform(-5, 5);
    y += y > 0 ? padding : -padding;
    let noiseX = randUniform(-5, 5) * noise;
    let noiseY = randUniform(-5, 5) * noise;
    let label = getXORLabel({ x: x + noiseX, y: y + noiseY });
    points.push({ x, y, label });
  }
  return points;
}

/**
 * Returns a sample from a uniform [a, b] distribution.
 * Uses the seedrandom library as the random generator.
 */
function randUniform(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

/**
 * Samples from a normal distribution. Uses the seedrandom library as the
 * random generator.
 *
 * @param mean The mean. Default is 0.
 * @param variance The variance. Default is 1.
 */
function normalRandom(mean = 0, variance = 1): number {
  let v1: number, v2: number, s: number;
  do {
    v1 = 2 * Math.random() - 1;
    v2 = 2 * Math.random() - 1;
    s = v1 * v1 + v2 * v2;
  } while (s > 1);

  let result = Math.sqrt((-2 * Math.log(s)) / s) * v1;
  return mean + Math.sqrt(variance) * result;
}

function dist(a: Point, b: Point): number {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
