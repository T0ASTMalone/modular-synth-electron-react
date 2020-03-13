import { useEffect, useContext, useState } from "react";
import MsContext from "../context/MsContext";

export const useCreateConnection = id => {
  const context = useContext(MsContext);
  const { cables, nodes, updateCables } = context;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const { node } = nodes[id];

    const out = cables[id];
    // if this module is an output in a current cable
    if (out && node) {
      const { mod, input } = out;
      // get cables module and input on that module

      if (nodes[mod].node) {
        if (input === "main-in") {
          // if input is main in, connect to module
          node.connect(nodes[mod].node);
        } else {
          // if input is not main connect to corresponding audio parameter
          node.connect(nodes[mod].node[input]);
        }
        setIsConnected(out.color);
      }
    } else {
      // if no cable with this module as an output is found
      // disconnect from any connections that the module may have
      if (node) {
        node.disconnect();
      }
      setIsConnected(false);
    }
  }, [updateCables]);

  return isConnected;
};

export const useIsModulated = id => {
  const context = useContext(MsContext);
  const { cables, updateCables } = context;
  const [isConnected, setIsConnected] = useState({});

  useEffect(() => {
    // input is found
    // add input name to is connected
    const inputs = {};
    for (let k in cables) {
      const cable = cables[k];
      if (cable.mod === id) {
        inputs[cable.input] = cable.color;
      }
    }

    setIsConnected(inputs);
  }, [updateCables]);

  return isConnected;
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

const getMaxDisInt = audioParam => {
  let { minValue, maxValue } = audioParam;
  const mDis = Math.abs(minValue - maxValue) * 0.1;
  return mDis;
};

export const useCheckDistance = () => {
  const context = useContext(MsContext);
  const { nodes } = context;

  const setAudioParam = (val, oldVal, input, id, func) => {
    const { node } = nodes[id];

    let maxDistance;
    let modifier = 3.4;
    if (input === "frequency") {
      modifier = 0;
      maxDistance = getMaxDisInt(node[input]);
    } else {
      maxDistance = getMaxDis(node[input]);
    }

    let distance = Math.abs(val - oldVal);
    // prevent knob from going past max value

    if (distance > maxDistance) {
      return;
    } else {
      // update function and audioNode value
      const realVal = val - modifier;
      nodes[id].node[input].value = realVal;
      func(val);
    }
  };

  return setAudioParam;
};
