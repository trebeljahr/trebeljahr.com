export type DataGenerator = (numSamples: number, noise: number) => Point[];

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
