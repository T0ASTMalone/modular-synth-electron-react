import fs from "fs";

export const saveFile = (nodes, cables) => {
  // get settings for each node
  const settings = Object.keys(nodes).map(node => {
    // get audio module
    const mod = nodes[node];
    // get audio node from module
    const audioNode = mod.node;
    // create object that will contain the values of any
    // audioParams in the audio node
    const audioValues = {};
    // if there is a frequency audioParam add to audioValues
    if (audioNode.frequency) {
      audioValues.frequency = audioNode.frequency.value;
    }
    // if there is a gain audioParam add to audioValues
    if (audioNode.gain) {
      audioValues.gain = audioNode.gain.value;
    }
    // create settings object for each module
    const nodeSettings = {
      // id
      id: node,
      // type
      type: mod.type,
      // audioValues
      ...audioValues
    };
    return nodeSettings;
  });

  // create connections array to write to file
  const connections = Object.keys(cables).map(key => {
    //create connection object
    const connection = {
      out: key,
      input: {
        mod: cables[key].mod,
        input: cables[key].input
      }
    };
    return connection;
  });

  // stringify to write to file
  const saveFile = JSON.stringify({ settings, connections });
  // create test file
  fs.writeFileSync("test-file.json", saveFile);
};
