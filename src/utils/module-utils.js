import { useEffect, useContext } from "react";
import MsContext from "../context/MsContext";

export const useCreateConnection = id => {
  const context = useContext(MsContext);
  const { cables, nodes, updateCables } = context;

  useEffect(() => {
    const { node } = nodes[id];

    console.log(node);
    const out = cables[id];
    // if this module is an output in a current cable
    if (out && node) {
      console.log("ran update connections");
      const { mod, input } = out;
      // get cables module and input on that module

      if (nodes[mod].node) {
        if (input === "main-in") {
          // if input is main in, connect to module
          console.log("connected to module main input");
          node.connect(nodes[mod].node);
        } else {
          // if input is not main connect to corresponding audio parameter
          console.log("connected to module audio param");
          node.connect(nodes[mod].node[input]);
        }
      }
    } else {
      // if no cable with this module as an output is found
      // disconnect from any connections that the module may have
      if (node) {
        console.log("disconnecting");
        node.disconnect();
      }
    }
  }, [updateCables]);
};
