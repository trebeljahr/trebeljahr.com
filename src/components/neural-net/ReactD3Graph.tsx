import { Graph, GraphData } from "react-d3-graph";
import { F, Value } from "./Value";

type CustomGraphData = GraphData<
  {
    id: string;
  },
  {
    source: string;
    target: string;
  }
>;

function transformToGraph(value: Value) {
  const data: CustomGraphData = {
    nodes: [],
    links: [],
  };

  function addToGraphDataRecursively(val: Value) {
    data.nodes.push({ id: val.id });
    for (let child of val.children) {
      addToGraphDataRecursively(child);
      data.links.push({ source: child.id, target: val.id });
    }
  }

  addToGraphDataRecursively(value);

  console.log(data);

  return data;
}

export const MyGraph = () => {
  // const data = {
  //   nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  //   links: [
  //     { source: "Harry", target: "Sally" },
  //     { source: "Harry", target: "Alice" },
  //   ],
  // };
  const data = transformToGraph(F);

  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
  };

  const onClickNode = (nodeId: string) => {
    // window.alert(`Clicked node ${nodeId}`);
  };

  const onClickLink = (source: string, target: string) => {
    // window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
    <Graph
      id="graph-id" // id is mandatory
      data={data}
      config={myConfig}
      onClickNode={onClickNode}
      onClickLink={onClickLink}
    />
  );
};
