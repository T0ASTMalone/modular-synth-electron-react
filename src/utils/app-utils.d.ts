/**
 * Gets array of tmp_recording names in tmpRec dir
 *
 */
export const getTmpRec: (path: string) => string[];

/**
 * Gets array of recording names in recordings dir
 *
 */
export const getRec: (path: string) => string[];

/**
 * Updates existing project
 *
 */
export const saveExistingProject: (
  nodes: nodes,
  cables: cables,
  path: string,
  saveRecordings: boolean
) => void;

/**
 * Converts AudioBuffer to wav format then turns wav to chunk to write to a new
 * file using fs.writeFileSync at the path provided
 *
 */
export const saveWave: (audioBuffer: AudioBuffer, path: string) => void;

/**
 * Checks if there are any recordings in the tmpRec folder of the current
 * project.
 *
 */
export const checkUnsavedRec: (path: string) => boolean;

/**
 *
 * Prompts user to choos a project folder that contains a valid patch.json file
 * and returns the patch.json contents {loadedModules, moduleSettings, cables},
 * path to the project and the tmpFolder object
 * {name: path to tmp folder, removeCallback(): function that delets tmp folder}
 *
 */
export const openProject: () => Promise<project>;

/**
 * Extracts state of saved project which includes loadedModules, moduleSettings,
 * and cables.
 */
export const openFile: (path: string) => Promise<patch>;

/**
 * Creates a temporary project directory for new projects using the npm package
 * tmp and is deleted when the program is closed or until the user saves the
 * new project
 * @example
 * root
 * |-- recordings
 *     |-- rec*.wav
 *     |-- tmpRec
 *         |-- tmp_rec*.wav
 *
 *
 * Note: There is not patch.json in tmp project dir as this is only created
 * when a project is saved
 */

export const createTmpProject: () => tmpObj;
