import { useEffect, useContext, useState, useRef } from "react";
import { useLogger } from "./hooks/logger";
import MsContext from "../context/MsContext";

export const useCreateConnection = (id) => {
  const context = useContext(MsContext);
  const { cables, nodes, updateCables } = context;
  const [isConnected, setIsConnected] = useState(false);
  const logger = useLogger("useCreateConnection");

  useEffect(() => {
    const { node } = nodes[id];

    const out = cables[id];
    // if this module is an output in a current cable
    // outputs are the keys for the cables
    // cables = {outputId : {input info}, ...}
    if (out && node) {
      const { mod, input } = out;
      // get cables module and input on that module

      if (nodes[mod].node) {
        if (input === "main-in") {
          // if input is main in, connect to module
          node.connect(nodes[mod].node);
          logger.info(
            `connecting node ${nodes[id].type} to ${nodes[mod].type}`
          );
        } else {
          // if input is not main connect to corresponding audio parameter
          logger.info(
            `connecting node ${nodes[id].type} to ${nodes[mod].type} audio param ${input}`
          );
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

export const useIsOutput = (id) => {
  const context = useContext(MsContext);
  const { cables, updateCables } = context;
  const [isConnected, setIsConnected] = useState({});

  useEffect(() => {
    // input is found
    // add input name to is connected
    for (let k in cables) {
      const color = cables[k];
      if (k === id) {
        setIsConnected(color);
      }
    }
  }, [updateCables]);

  return isConnected;
};

export const useIsModulated = (id) => {
  const context = useContext(MsContext);
  const [isConnected, setIsConnected] = useState({});
  const logger = useLogger("useIsModulated");

  const { updateCables } = context;

  const refContext = useRef(context);
  const refId = useRef(id);
  const refLogger = useRef(logger);

  useEffect(() => {
    const ctx = refContext.current;
    const id = refId.current;
    const logger = refLogger.current;
    const { cables } = ctx.getCurrentState();
    // input is found
    // add input name to is connected
    const inputs = {};
    logger.info(updateCables);
    for (let k in cables) {
      const cable = cables[k];
      if (cable.mod === id) {
        inputs[cable.input] = cable.color;
      }
    }

    setIsConnected(inputs);
  }, [updateCables, refContext, refId, refLogger]);

  return isConnected;
};

/**
 * Calculates the max distance that a knob should be able to travel based on the
 * min and max values for the provided audio parameter
 * @param {AudioParam} audioParam
 */
const getMaxDis = (audioParam) => {
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

const getMaxDisInt = (audioParam) => {
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
      if (nodes[id].node[input]) {
        nodes[id].node[input].value = realVal;
      }

      func(val);
    }
  };

  return setAudioParam;
};

export const useGetOut = () => {
  const context = useContext(MsContext);
  const { nodes } = context;
  let mainGain;
  for (let k in nodes) {
    if (nodes[k].type === "main-gain") {
      mainGain = nodes[k].node;
    }
  }

  return mainGain;
};

export const createPathAndUpdate = (names, areTmp, root, func) => {
  let success = null;

  let path = areTmp ? `${root}\\recordings\\tmpRec` : `${root}\\recordings`;

  const updatedNames = [];
  // create full path names for saved recordings
  for (let rec in names) {
    const name = `${path}\\${rec}`;
    updatedNames.push(name);
    const deleted = func(name);
    success = !success ? deleted : success;
  }

  return success;
};

export const createFullPaths = (names, areTmp, root) => {
  let path = areTmp ? `${root}\\recordings\\tmpRec` : `${root}\\recordings`;

  const updatedNames = [];
  // create full path names for saved recordings
  for (let rec in names) {
    const name = `${path}\\${rec}`;
    updatedNames.push(name);
  }

  return updatedNames;
};
