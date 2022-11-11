import { Point } from "../../lib/math/datasets/utils";
import { createCircleData } from "../../lib/math/datasets/circle";
import { createGaussData } from "../../lib/math/datasets/gauss";
import { createSpiralData } from "../../lib/math/datasets/spiral";
import { createXorData } from "../../lib/math/datasets/xor";
import { Plot } from "./Plot";

function mapToDataSets(datasets: [Point[], Point[]]) {
  return {
    datasets: [
      {
        label: "Group 1",
        data: datasets[0],
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Group 2",
        data: datasets[1],
        backgroundColor: "rgba(50, 99, 255, 1)",
      },
    ],
  };
}

ChartJS.register(LinearScale, PointElement, LineElement, Legend);

const ScatterPlot = () => {
  const scatterPlotOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <>
      <Plot data={createCircleData(1000)} />
      <Plot data={createGaussData(1000)} />
      <Plot data={createXorData(1000)} />
      <Plot data={createSpiralData(1000)} />
    </>
  );
};

export const NeuronDemo = () => {
  return <ScatterPlot />;
};
