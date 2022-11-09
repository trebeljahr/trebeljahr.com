import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Vec2 } from "../../lib/math/Vector";
import { createCircleData } from "../../lib/math/datasets/circle";
import { Point } from "../../lib/math/datasets/utils";
import { createGaussData } from "../../lib/math/datasets/gauss";
import { createSpiralData } from "../../lib/math/datasets/spiral";
import { createXorData } from "../../lib/math/datasets/xor";
import { createGaussRegressData } from "../../lib/math/datasets/gauss-regress";

export function rand({ min, max }: { min: number; max: number }) {
  return Math.random() * (max + 1 - min) + min;
}

export function blob(point: Vec2, amount: number, radius: number) {
  return Array.from({ length: amount }, () => {
    const offsetPoint = point.add(randomLengthVector({ min: 0, max: radius }));
    return offsetPoint;
  });
}

export function randomLengthVector({ min, max }: { min: number; max: number }) {
  return new Vec2(rand({ min: -1, max: 1 }), rand({ min: -1, max: 1 }))
    .unit()
    .multScalar(rand({ min, max }));
}

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
      <Scatter
        options={scatterPlotOptions}
        data={mapToDataSets(createGaussRegressData(1000))}
      />
    </>
  );
};

export const NeuronDemo = () => {
  return <ScatterPlot />;
};
