import { useEffect, useContext, useState } from "react";
import MsContext from "../context/MsContext";

export const useCreateConnection = id => {
  const context = useContext(MsContext);
  const { cables, nodes, updateCables } = context;
  const [isModded, setIsModded] = useState({});

  const getInputs = () => {
    const inputs = {};
    for (let k in cables) {
      const { mod, input } = cables[k];
      if (mod === id) {
        inputs[input] = true;
      }
    }

    return inputs;
  };

  useEffect(() => {
    const { node } = nodes[id];

    const inputs = getInputs();
    setIsModded(inputs);
    const out = cables[id];
    // if this module is an output in a current cable
    if (out) {
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

  return isModded;
};

export const useCheckDistance = () => {};
