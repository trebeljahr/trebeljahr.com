import { dist, Point, randUniform } from "./utils";
import { scaleLinear } from "d3-scale";

export function createGaussRegressData(numSamples: number) {
  let labelScale = scaleLinear().domain([0, 2]).range([1, 0]).clamp(true);
  let gaussians = [
    [-4, 2.5, 1],
    [0, 2.5, -1],
    [4, 2.5, 1],
    [-4, -2.5, -1],
    [0, -2.5, 1],
    [4, -2.5, -1],
  ];
  let radius = 5;
  let datasets: [Point[], Point[]] = [[], []];

  function getIndex(x: number, y: number) {
    let label = 0;
    gaussians.forEach(([cx, cy, sign]) => {
      let newLabel = sign * labelScale(dist({ x, y }, { x: cx, y: cy }));
      if (Math.abs(newLabel) > Math.abs(label)) {
        label = newLabel;
      }
    });
    return label === -1 ? 0 : 1;
  }

  for (let i = 0; i < numSamples; i++) {
    let x = randUniform(-radius, radius);
    let y = randUniform(-radius, radius);
    const index = getIndex(x, y);
    datasets[index].push({ x, y });
  }

  return datasets;
}
