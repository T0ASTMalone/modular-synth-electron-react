import Logger from "../services/logger";

const fs = window.require("fs");
const tmp = window.require("tmp");
const toWav = require("audiobuffer-to-wav");
const { dialog, process } = window.require("electron").remote;
const logger = new Logger("app-utils");
// add format file for reading and
// add format file for writing functions
// to make saveFile and openFile more readable and to use in
// other files such as in context when opening a saved file
// by double clicking it

tmp.setGracefulCleanup();
// change to variable in settings i.e. wav, mp3
// update constant to use that variable
const audioFormat = ".wav";

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

// create patch.json
const createPatchFile = (nodes, cables) => {
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
  return JSON.stringify({ settings, connections });
};

const mvAllRecordings = (oldPath, newPath) => {
  // get all recording from tmp recordings folder
  const tmpRecordings = fs.readdirSync(`${oldPath}/recordings/tmpRec`);
  console.log(tmpRecordings);
  // if no path is passed ing
  if (!newPath) {
    // make the old path the same as the new path
    // meaning the tmp recordings are in an existing patch
    // and are simply being moved to the recordings folder
    newPath = oldPath;
  }

  for (let name of tmpRecordings) {
    fs.renameSync(
      `${oldPath}/recordings/tmpRec/${name}`,
      `${newPath}/recordings/${name}`
    );
  }
};

// save existing
export const saveExistingProject = (
  nodes,
  cables,
  path,
  saveRecordings = false
) => {
  // write to patch.json at the path provided
  const patch = createPatchFile(nodes, cables);
  try {
    logger.info("updating patch settings");
    fs.writeFileSync(`${path}/patch.json`, patch);
  } catch (err) {
    logger.err(`saveExistingProject: ${err.message}`);
    // dialog.showErrorBox("Failed to Save", err);
    return false;
  }
  // if save recordings is set to true
  if (saveRecordings) {
    // mv all recordings to parent path which would be the recordings path
    mvAllRecordings(path);
  }
};

// "Save as" option
export const saveFile = (nodes, cables, oldPath, saveRecordings = false) => {
  // stringify to write to file
  const saveFile = createPatchFile(nodes, cables);

  const options = {
    title: "Save Patch",
    properties:
      process.platform === "win32" ? "promptToCreate" : "createDirectory",
  };
  // get path to save to
  const path = dialog.showSaveDialogSync(options);

  if (!path) {
    return false;
  }

  // path for patch file
  const pathToPatch = `${path}\\patch.json`;
  // path to recordings folder
  const pathToRecordings = `${path}\\recordings`;

  fs.mkdir(path, { recursive: true }, async (err) => {
    await fs.promises.mkdir(pathToRecordings);
    try {
      console.log("ran save file");
      fs.writeFileSync(pathToPatch, saveFile);
      if (saveRecordings) {
        mvAllRecordings(oldPath, path);
      }
    } catch (err) {
      logger.err(`Faild to save : ${err.message}`);
      dialog.showErrorBox("Failed to Save", err);
      return false;
    }
  });

  return true;
};

// create tmp project folder
export const createTmpProject = () => {
  // set up tmp project for new patches
  const options = {
    prefix: "tmpatch_",
    // remove dir and all contents
    unsafeCleanup: true,
    mode: 0o750,
  };

  // create tmp root dir
  const tmpDir = tmp.dirSync(options);

  // options for recordings dir that will
  // go inside tmpDir
  const recOptions = {
    name: "recordings",
    dir: tmpDir.name,
    mode: 0o750,
  };

  // create tmpdir for recordings
  const recDir = tmp.dirSync(recOptions);

  // create tmpdir for tmp recordings
  createTmpRecDir(recDir.name);

  // return tmpdir object {name(path), removeCallback}
  return tmpDir;
};

const createTmpRecDir = (path) => {
  // options for tmp rec dir
  const options = {
    name: "tmpRec",
    tmpdir: path,
    mode: 0o750,
    // remove dir and all of its contents
    unsafeCleanup: true,
  };

  // create tmp rec dir
  const tmpRecDir = tmp.dirSync(options);

  // return tmpdir object {name(path), removeCallback}
  return tmpRecDir;
};

// load patch function
export const openFile = async (path) => {
  // read file selected
  try {
    const file = fs.readFileSync(path, "utf8");
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
    console.error(err);
    throw new Error(err);
  }
};

export const openProject = async () => {
  // options for electron dialog
  // set to open a directory
  const options = {
    title: "Open Project",
    properties: ["openDirectory"],
  };

  // get path from user
  const path = dialog.showOpenDialogSync(options);

  if (!path) {
    logger.warn("no path selected");
    return false;
  }

  // options for readdir
  // with file types set to true
  const dirOptions = {
    withFileTypes: true,
  };

  // get array of folder contents
  const dir = await fs.promises.readdir(path[0], dirOptions);

  // make sure patch file exists
  const patch = dir.find((file) => file.name === "patch.json");

  if (!patch) {
    logger.err("invalid project selected...aborting");
    throw new Error("There is no valid patch.json file in this project");
  }

  const patchPath = `${path}\\${patch.name}`;
  const pathToRec = `${path}\\recordings`;

  // create tmp rec dir inside pathToRec to store
  // temporary recordings
  const tmpobj = createTmpRecDir(pathToRec);

  try {
    logger.info("loading patch");
    const file = await openFile(patchPath);
    return { file, path: path[0], tmpobj };
  } catch (err) {
    logger.err("failed to load patch");
    return err;
  }
};

export const saveWave = (audiobuffer, path) => {
  const wav = toWav(audiobuffer);
  const chunk = new Uint8Array(wav);
  const time = new Date().getTime();
  const name = `temp_rec_${time}${audioFormat}`;

  try {
    fs.writeFileSync(`${path}/recordings/tmpRec/${name}`, new Buffer(chunk));
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const checkUnsavedRec = (path) => {
  const rec = fs.readdirSync(`${path}/recordings/tmpRec`).length;
  if (rec !== 0) {
    return true;
  } else {
    return false;
  }
};
