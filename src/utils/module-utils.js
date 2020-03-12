import { useEffect, useContext } from "react";
import MsContext from "../context/MsContext";

export const useCreateConnection = id => {
  const context = useContext(MsContext);
  const { cables, nodes, updateCables } = context;

  useEffect(() => {
    const { node } = nodes[id];

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

const getMaxDis = audioParam => {
  let { minValue, maxValue } = audioParam;
  const min = minValue.toFixed(3).split("");
  const max = maxValue.toFixed(3).split("");

  let miniVal;
  min.forEach((char, i) => {
    if (!miniVal) {
      miniVal = char;
    } else if (i < 5) miniVal += char;
  });

  let maxVal;
  max.forEach((char, i) => {
    if (!maxVal) {
      maxVal = char;
    } else if (i < 5) maxVal += char;
  });

  const mDis =
    Math.abs(parseFloat(miniVal).toFixed(2) - parseFloat(maxVal).toFixed(2)) *
    0.1;
  return mDis;
};

export const useCheckDistance = () => {
  const context = useContext(MsContext);
  const { nodes } = context;

  const setAudioParam = (val, input, id, func, oldVal) => {
    const { node } = nodes[id];

    console.log(oldVal, val);

    let maxDistance = getMaxDis(node[input]);

    let distance = Math.abs(val - oldVal);
    // prevent knob from going past max value

    if (distance > maxDistance) {
      return;
    } else {
      console.log(val);
      // update function
      const gainNodeVal = val - 3.4;
      nodes[id].node[input].value = gainNodeVal;
      func(val);
    }
  };

  return setAudioParam;
};
