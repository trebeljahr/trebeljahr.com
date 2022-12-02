import { useEffect, useState } from "react";
import SimpleReactCanvasComponent from "simple-react-canvas-component";
import { useActualSize } from "../../hooks/useWindowSize";
import { circle, line } from "../../lib/math/drawHelpers";
import { Vec2 } from "../../lib/math/Vector";
import { SimpleBarChart } from "./BarChart";
import { F, Value } from "./Value";

// function VisualizeValue({ val }: { val: Value }) {
//   return (
//     <>
//       <h2>
//         data: {val.data} grad: {val.grad} operation: {val.operation}
//       </h2>
//       <div>
//         {[...val.children].map((nextVal, index) => {
//           return <VisualizeValue key={nanoid()} val={nextVal} />;
//         })}
//       </div>
//     </>
//   );
// }

function visualizeNeuron(
  ctx: CanvasRenderingContext2D,
  { children: childrenSet, operation, grad, data }: Value,
  position: Vec2,
  shorten = false
) {
  const children = [...childrenSet];
  const offsetY = 150;
  const newPosition = position.sub(
    new Vec2(200, (children.length * offsetY) / 4)
  );
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const nextPos = newPosition.add(
      new Vec2(shorten ? 100 : 0, (offsetY * i) / 2)
    );
    line(ctx, position, nextPos);
    visualizeNeuron(ctx, child, nextPos, i % 2 === 0);
  }

  circle(ctx, position, 30, { fill: "orange" });
  ctx.fillText(operation, position.x, position.y);
  ctx.fillText(`grad: ${grad}`, position.x, position.y + 20);
  ctx.fillText(`data: ${data}`, position.x, position.y + 40);
}

export function SingleNeuronDemo() {
  const { width, height } = useActualSize();
  const [cnv, setCnv] = useState<HTMLCanvasElement | null>(null);
  console.log(F);

  useEffect(() => {
    if (!cnv) return;
    const ctx = cnv.getContext("2d");
    if (!ctx || !width || !height) return;

    const origin = new Vec2(width / 2, height / 2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const drawFn = () => {
      //   const singleNeuron = makeNeuron(origin);
      visualizeNeuron(ctx, F, new Vec2(width - 100, height - 100));
    };

    drawFn();
  }, [cnv, width, height]);

  return (
    <>
      <SimpleBarChart />
      {/* <VisualizeValue val={F} /> */}
      {/* <SimpleReactCanvasComponent
        setCnv={setCnv}
        width={width}
        height={height}
      /> */}
    </>
  );
}

// import Graph from "react-vis-network-graph";

// const ReactGraphDemo = () => {
//   const graph = {
//     nodes: [
//       { id: 1, label: "Node 1", title: "node 1 tootip text" },
//       { id: 2, label: "Node 2", title: "node 2 tootip text" },
//       { id: 3, label: "Node 3", title: "node 3 tootip text" },
//       { id: 4, label: "Node 4", title: "node 4 tootip text" },
//       { id: 5, label: "Node 5", title: "node 5 tootip text" },
//     ],
//     edges: [
//       { from: 1, to: 2 },
//       { from: 1, to: 3 },
//       { from: 2, to: 4 },
//       { from: 2, to: 5 },
//     ],
//   };

//   const options = {
//     layout: {
//       hierarchical: true,
//     },
//     edges: {
//       color: "#000000",
//     },
//     height: "500px",
//   };

//   const events = {
//     select: (event: any) => {
//       const { nodes, edges } = event;
//     },
//   };
//   return (
//     <Graph
//       graph={graph}
//       options={options}
//       events={events}
//       getNetwork={(network: any) => {
//         //  if you want access to vis.js network api you can set the state in a parent component using this property
//       }}
//     />
//   );
// };

// const CytoScapeDemo = () => {
//   return (
//     <ReactCytoscape
//       containerID="cy"
//       elements={this.getElements()}
//       cyRef={(cy) => {
//         this.cy = cy;
//         console.log(this.cy);
//       }}
//       cytoscapeOptions={{ wheelSensitivity: 0.1 }}
//       layout={{ name: "dagre" }}
//     />
//   );
// };

// import CytoscapeComponent from "react-cytoscapejs";
// const CytoScapeDemo = () => {
//   const config = {
//     elements: {
//       nodes: [
//         { data: { id: "cat" } },
//         { data: { id: "bird" } },
//         { data: { id: "ladybug" } },
//         { data: { id: "aphid" } },
//         { data: { id: "rose" } },
//         { data: { id: "grasshopper" } },
//         { data: { id: "plant" } },
//         { data: { id: "wheat" } },
//       ],
//       edges: [
//         { data: { source: "cat", target: "bird" } },
//         { data: { source: "bird", target: "ladybug" } },
//         { data: { source: "bird", target: "grasshopper" } },
//         { data: { source: "grasshopper", target: "plant" } },
//         { data: { source: "grasshopper", target: "wheat" } },
//         { data: { source: "ladybug", target: "aphid" } },
//         { data: { source: "aphid", target: "rose" } },
//       ],
//     },
//     layout: {
//       name: "breadthfirst",
//       directed: true,
//       padding: 10,
//     },
//   };
//   return (
//     <CytoscapeComponent
//       elements={[...config.elements.nodes, ...config.elements.edges]}
//     />
//   );
// };
