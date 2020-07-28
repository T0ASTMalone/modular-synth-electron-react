import React, { useState, useEffect, useContext, useRef } from "react";
import "./Recordings.css";
import PatchListItem from "../PatchListItem/PatchListItem";
import { getTmpRec, getRec, mvAllRecordings } from "../../utils/app-utils";
import MsContext from "../../context/MsContext";
import { useLogger } from "../../utils/hooks/logger";

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

  const { update, triggerUpdate } = context;

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
    // delete all selected recordings
  };

  const saveSelectedRecordings = () => {
    // only save selected Tmp recordings
    const recordings = Object.keys(selectedTmp);
    console.log(recordings);
  };

  const saveAllRecordings = () => {

    /* 
      TODO: Need to check if user is in a tmp project or
            if in a saved project root path will change
            depending on that
    */

    // get root path and tmpRec path
    const path = context.rootPath;

    try {
      logger.info(`Saving ${tmpRec.length} recordings`);
      // old and new path are the same because
      // we are saving from within the project
      mvAllRecordings(path, path);
      triggerUpdate();
    } catch (e) {
      logger.err(`Failed to save recordings: ${e.message}`);
    }
  };

  const exportSelectedRecording = () => {
    // export all selected recordings
  };

  return (
    <div className="recordings">
      <div className="recordings-controls">
        <button onClick={() => saveSelectedRecordings()}>Save</button>
        <button onClick={() => saveAllRecordings()}>Save All</button>
        <button onClick={() => deletRecordings()}>Delete</button>
        <button onClick={() => exportSelectedRecording()}>Export</button>
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
        <h3>No recordings here</h3>
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
