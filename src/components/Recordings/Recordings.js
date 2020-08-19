import React, { useState, useEffect, useContext, useRef } from "react";
import "./Recordings.css";
import PatchListItem from "../PatchListItem/PatchListItem";
import MsContext from "../../context/MsContext";
import { useLogger } from "../../utils/hooks/logger";
import { createPathAndUpdate } from "../../utils/module-utils";
import SaveAll from "../../assets/svg/layers.svg";
import Save from "../../assets/svg/layer.svg";
import Delete from "../../assets/svg/delete.svg";
import Export from "../../assets/svg/export.svg";
import {
  getPath,
  confirm,
  mvSelectedRecordings,
  deleteFile,
  exportRec,
  getTmpRec,
  getRec,
  mvAllRecordings,
} from "../../utils/app-utils";

const Recordings = () => {
  // logger hook
  const logger = useLogger("Recordings");
  // reference to logger for use in useEffect without retriggering it
  const refLogger = useRef(logger);

  // for selecting recordings to save, delete or export
  const [selectedRec, setSelectedRec] = useState({});
  const [selectedTmp, setSelectedTmp] = useState({});
  // recordings in tmp folder
  const [tmpRec, setTmpRecordings] = useState([]);
  // project recordings
  const [recordings, setRecordings] = useState([]);

  const context = useContext(MsContext);
  // ref to context for use in useEffect without retriggering it
  const refCtx = useRef(context);

  const { update, triggerUpdate, isExisting, rootPath } = context;

  const selectRec = (name) => {
    const items = selectedRec;
    // if rec is already selected
    if (items[name]) {
      // remove from selected list (deselect)
      delete items[name];
    } else {
      // add to selected list
      items[name] = name;
    }
    // updated list
    setSelectedRec({ ...items });
  };

  const selectTmp = (name) => {
    const items = selectedTmp;
    // if rec is already selected
    if (items[name]) {
      // remove from selected list (deselect)
      delete items[name];
    } else {
      // add to selected list
      items[name] = name;
    }
    // updated list
    setSelectedTmp({ ...items });
  };

  useEffect(() => {
    const ctx = refCtx.current;
    const logger = refLogger.current;

    const { getCurrentState } = ctx;

    // get most recent root path
    const { rootPath } = getCurrentState();

    let recordings;
    let tmpRecordings;

    try {
      logger.info("(useEffect) Getting recordings");
      // get recordings
      recordings = getRec(rootPath);
      // ignore tmpRec folder
      recordings = recordings.filter((rec) => rec !== "tmpRec");

      logger.info("(useEffect) Getting tmp recordings");
      tmpRecordings = getTmpRec(rootPath);
    } catch (err) {}
    setTmpRecordings(tmpRecordings);
    setRecordings(recordings);
    // read recordings folder for project or tmp folder
    // for new patches
  }, [refCtx, refLogger, update]);

  // const renameRecording = () => {
  //   // rename recording
  //   console.log("renaming Recording");
  // };

  const deletRecordings = () => {
    logger.warn("deleting all selected recordings...");
    // delete all selected recordings
    const tmpRec = selectedTmp;
    const savedRec = selectedRec;

    let success = null;

    success = createPathAndUpdate(tmpRec, true, rootPath, deleteFile);

    const deleted = createPathAndUpdate(savedRec, false, rootPath, deleteFile);

    success = !success ? deleted : success;

    if (success) {
      // clear selected
      completeAction();
    }
  };

  const saveSelectedRecordings = () => {
    // only save selected Tmp recordings
    const recordings = Object.keys(selectedTmp);

    if (!isExisting) return mvFromTmp(recordings);

    if (mvSelectedRecordings(recordings, rootPath, rootPath)) {
      completeAction();
    }
  };

  const mvFromTmp = (names) => {
    // TODO: change if is existing 'Whould you like to save these recordings (list recordings)'
    const title = "This is not a saved project!";
    const msg = "Would you like to save your recordings to their own folder?";
    const conf = confirm(title, msg);

    if (conf === 2 || conf === 1) return;

    const options = {
      title: "Select a folder to save all recordings",
      properties: ["openDirectory"],
    };

    const old = `${rootPath}/recordings/tmpRec`;

    exportToPath(names, old, options);

    completeAction();
  };

  const saveAllRecordings = () => {
    if (!isExisting) return mvFromTmp(tmpRec);

    try {
      logger.info(`Saving ${tmpRec.length} recordings`);
      // just passing root path as recordings are just being
      // moved within the project
      mvAllRecordings(rootPath);
    } catch (e) {
      logger.err(`Failed to save recordings: ${e.message}`);
    }

    completeAction();
  };

  const exportSelectedRecording = () => {
    // export all selected recordings
    if (!isExisting) return mvFromTmp(selectedTmp);

    const options = {
      title: "Select a folder to export selected recordings",
      properties: ["openDirectory"],
    };

    let savedRec = Object.keys(selectedRec);
    let tmpRec = Object.keys(selectedTmp);

    let path = exportToPath(tmpRec, `${rootPath}\\recordings\\tmpRec`, options);

    logger.info(`exporting selected recordings to ${path}`);
    exportToPath(savedRec, `${rootPath}\\recordings`, null, path);
  };

  const exportToPath = (names, old, options, p = null) => {
    let path = !p ? getPath(options)[0] : p;

    if (!path) {
      return;
    }

    // export to folder path
    if (exportRec(names, old, path)) {
      completeAction();
    }

    return path;
  };

  const completeAction = () => {
    setSelectedRec({});
    setSelectedTmp({});
    triggerUpdate();
  };

  return (
    <div className="recordings">
      <div className="recordings-controls">
        <button className="sidebar-button" onClick={() => saveAllRecordings()}>
          <img className="button-img" src={SaveAll} alt="Save All" />
        </button>
        <button
          className="sidebar-button"
          onClick={() => saveSelectedRecordings()}
        >
          <img className="button-img" src={Save} alt="Save" />
        </button>
        <button className="sidebar-button" onClick={() => deletRecordings()}>
          <img className="button-img" src={Delete} alt="Delete" />
        </button>
        <button
          className="sidebar-button"
          onClick={() => exportSelectedRecording()}
        >
          <img className="button-img" src={Export} alt="Export" />
        </button>
      </div>
      {recordings.length >= 1 ? (
        <div className="recordings-container recordings-saved">
          <h3 className="sidebar-title">Saved</h3>
          <ul className="sidebar-list">
            {recordings.map((rec, i) => {
              let active = selectedRec[rec] ? true : false;
              return (
                <PatchListItem
                  key={i}
                  item={rec}
                  ui={false}
                  click={selectRec}
                  active={active}
                />
              );
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}

      {tmpRec.length >= 1 ? (
        <div className="recordings-container recordings-tmp">
          <h3 className="sidebar-title">Unsaved</h3>
          <ul className="sidebar-list">
            {tmpRec.map((rec, i) => {
              let active = selectedTmp[rec] ? true : false;
              return (
                <PatchListItem
                  key={i}
                  item={rec}
                  ui={false}
                  click={selectTmp}
                  active={active}
                />
              );
            })}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Recordings;
