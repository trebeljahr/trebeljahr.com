import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";
import { Point } from "../../lib/math/datasets/utils";
import { createCircleData } from "../../lib/math/datasets/circle";
import { createGaussData } from "../../lib/math/datasets/gauss";
import { createSpiralData } from "../../lib/math/datasets/spiral";
import { createXorData } from "../../lib/math/datasets/xor";

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
      <Scatter
        options={scatterPlotOptions}
        data={mapToDataSets(createCircleData(1000))}
      />
      <Scatter
        options={scatterPlotOptions}
        data={mapToDataSets(createGaussData(1000))}
      />
      <Scatter
        options={scatterPlotOptions}
        data={mapToDataSets(createSpiralData(1000))}
      />
      <Scatter
        options={scatterPlotOptions}
        data={mapToDataSets(createXorData(1000))}
      />
    </>
  );
};

export const NeuronDemo = () => {
  return <ScatterPlot />;
};
