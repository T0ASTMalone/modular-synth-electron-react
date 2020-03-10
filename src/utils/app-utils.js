const fs = window.require("fs");

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
    // if audioNode has Q audioParam add to audioValues
    if (audioNode.Q) {
      audioValues.Q = audioNode.Q.value;
    }
    // add if statement for filter type

    // create settings object for each module
    const nodeSettings = {
      // id
      id: node,
      // type
      type: mod.type,
      // audioValues
      values: audioValues
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
  console.log(saveFile);
  // create test file
  fs.writeFileSync("test-patch.json", saveFile);
};

export const openFile = async () => {
  // read file selected
  const file = fs.readFileSync("test-patch.json", "utf8");
  // format to json
  const newFile = JSON.parse(file);
  // get settings and connections object
  const { settings, connections } = newFile;
  console.log(settings);
  // format values for modules
  const moduleSettings = {};
  const loadedModules = {};
  Object.keys(settings).map(key => {
    const { id, values, type } = settings[key];
    // create settings obj for each module
    moduleSettings[id] = { ...values };
    // create object of all loaded modules
    loadedModules[key] = { id, type };
  });

  const cables = {};
  // format cables obj to load into context
  Object.keys(connections).map(key => {
    const { out, input } = connections[key];
    cables[out] = input;
  });

  return { loadedModules, moduleSettings, cables };
  // return the file information and values object to app
};
