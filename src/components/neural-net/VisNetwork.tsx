import { Network } from "vis-network-react";

const GraphNetwork = () => {
  const options = {
    // options for the visualization
  };

  const data = {
    nodes: [
      // data for the nodes in the graph network
    ],
    edges: [
      // data for the edges in the graph network
    ],
  };

  return <Network options={options} data={data} />;
};
