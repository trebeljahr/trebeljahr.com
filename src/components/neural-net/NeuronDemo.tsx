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

export const dataset = {
  datasets: [
    {
      label: "Group 1",
      data: blob(new Vec2(20, 20), 1000, 10),
      backgroundColor: "rgba(255, 99, 132, 1)",
    },
    {
      label: "Group 2",
      data: blob(new Vec2(35, 35), 1000, 10),
      backgroundColor: "rgba(50, 99, 255, 1)",
    },
  ],
};

ChartJS.register(LinearScale, PointElement, LineElement, Legend);

const ScatterPlot = () => {
  const scatterPlotOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return <Scatter options={scatterPlotOptions} data={dataset} />;
};

export const NeuronDemo = () => {
  return <ScatterPlot />;
};
