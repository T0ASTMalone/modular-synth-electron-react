const fs = window.require("fs");
const toWav = require("audiobuffer-to-wav");
const { dialog } = window.require("electron").remote;

// add format file for reading and
// add format file for writing functions
// to make saveFile and openFile more readable and to use in
// other files such as in context when opening a saved file
// by double clicking it

// change to variable in settings i.e. wav, mp3
// update constant to use that variable
const audioFormat = "*.wav";

const createSettings = (nodes) => {
  // get settings for each node
  const settings = Object.keys(nodes).map((mod) => {
    const { node, type } = nodes[mod];
    // array of possible audioParams
    const saveValues = ["frequency", "gain", "Q", "type", "buffer"];
    // create object that will contain the values of any audioParams in the audio node
    const audioValues = {};

    saveValues.forEach((value) => {
      if (value !== "type" && value in node) {
        audioValues[value] = node[value].value;
      } else {
        audioValues[value] = node[value];
      }
    });
    // create settings object for each module
    const nodeSettings = {
      id: mod,
      type,
      values: audioValues,
    };
    return nodeSettings;
  });
  return settings;
};

export const saveFile = (nodes, cables) => {
  const settings = createSettings(nodes);

  // create connections array to write to file
  const connections = Object.keys(cables).map((key) => {
    //create connection object
    const connection = {
      out: key,
      input: {
        color: cables[key].color,
        mod: cables[key].mod,
        input: cables[key].input,
      },
    };
    return connection;
  });

  // stringify to write to file
  const saveFile = JSON.stringify({ settings, connections });

  const options = {
    filters: [{ name: "patch", extensions: ["json"] }],
    title: "Save Patch",
  };
  // get path to save to
  const path = dialog.showSaveDialogSync(options);

  // create test file
  if (!path) {
    return false;
  }
  fs.mkdir(path, { recursive: true }, (path) => {
    try {
      console.log("ran save file");
      fs.writeFileSync(path, saveFile);
    } catch (err) {
      dialog.showErrorBox("Failed to Save", err);
      return false;
    }
  });

  // try {
  //   console.log("ran save file");
  //   fs.writeFileSync(path, saveFile);
  // } catch (err) {
  //   dialog.showErrorBox("Failed to Save", err);
  //   return false;
  // }
  return true;
};

// load patch function

export const openFile = async () => {
  const options = {
    title: "Open Patch",
    filters: [{ name: "patch", extensions: ["json"] }],
  };
  // choose file
  const path = dialog.showOpenDialogSync(options);
  // if no path was provided i.e. open dialog was canceled
  // return
  if (!path) {
    return;
  }

  // read file selected
  try {
    const file = fs.readFileSync(path[0], "utf8");
    // format to json
    const newFile = JSON.parse(file);
    // get settings and connections object
    const { settings, connections } = newFile;

    if (!settings || !connections) {
      throw new Error("sorry something went wrong");
    }
    // format values for modules
    const moduleSettings = {};
    const loadedModules = {};
    Object.keys(settings).forEach((key) => {
      const { id, values, type } = settings[key];
      // create settings obj for each module
      moduleSettings[id] = { ...values };
      // create object of all loaded modules
      loadedModules[key] = { id, type };
    });

    const cables = {};
    // format cables obj to load into context
    Object.keys(connections).forEach((key) => {
      const { out, input } = connections[key];
      cables[out] = input;
    });

    return { loadedModules, moduleSettings, cables };
    // return the file information and values object to app
  } catch (err) {
    return err;
  }
};

export const saveWave = (audiobuffer) => {
  const options = {
    filters: [{ name: audioFormat, extensions: [audioFormat] }],
    title: "Save Recording",
  };

  const path = dialog.showSaveDialogSync(options);

  if (!path) {
    return;
  }

  const wav = toWav(audiobuffer);
  const chunk = new Uint8Array(wav);
  try {
    fs.writeFileSync(path, new Buffer(chunk));
  } catch (err) {
    console.log(err);
    return err;
  }
};
