import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import SimpleReactCanvasComponent from "simple-react-canvas-component";
import { useActualSize } from "../../hooks/useWindowSize";
import { circle, line } from "../../lib/math/drawHelpers";
import { Vec2 } from "../../lib/math/Vector";
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
      {/* <VisualizeValue val={F} /> */}
      <SimpleReactCanvasComponent
        setCnv={setCnv}
        width={width}
        height={height}
      />
    </>
  );
}
