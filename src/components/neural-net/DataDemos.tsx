import { createCircleData } from "../../lib/math/datasets/circle";
import { createGaussData } from "../../lib/math/datasets/gauss";
import { createSpiralData } from "../../lib/math/datasets/spiral";
import { createXorData } from "../../lib/math/datasets/xor";
import { Plot } from "./Plot";

export const DataDemos = () => {
  return (
    <>
      <Plot data={createCircleData(1000)} />
      <Plot data={createGaussData(1000)} />
      <Plot data={createXorData(1000)} />
      <Plot data={createSpiralData(1000)} />
    </>
  );
};
