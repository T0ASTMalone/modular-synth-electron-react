import React, { useState, useEffect, useContext, useRef } from "react";
import "./Recordings.css";
import PatchListItem from "../PatchListItem/PatchListItem";
import { getTmpRec, getRec } from "../../utils/app-utils";
import MsContext from "../../context/MsContext";
import { useLogger } from "../../utils/hooks/logger";

const Recordings = () => {
  // logger hook
  const logger = useLogger("Recordings");
  // reference to logger for use in useEffect without retriggering it
  const refLogger = useRef(logger);
  // for selecting recordings to save, delete or export
  const [selected, setSelected] = useState({});
  const context = useContext(MsContext);
  // ref to context for use in useEffect without retriggering it
  const refCtx = useRef(context);
  // recordings in tmp folder
  const [tmpRec, setTmpRecordings] = useState([]);
  // project recordings
  const [recordings, setRecordings] = useState([]);

  const btnClick = (name) => {
    const items = selected;
    // if rec is already selected
    if (items[name]) {
      // remove from selected list (deselect)
      delete items[name];
    } else {
      // add to selected list
      items[name] = name;
    }
    // updated list
    setSelected({ ...items });
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
  }, [refCtx, refLogger]);

  // const renameRecording = () => {
  //   // rename recording
  //   console.log("renaming Recording");
  // };

  const deletRecordings = () => {
    console.log("deleting recordings", selected);
  };

  const saveSelectedRecordings = () => {
    console.log("saving selected recording", selected);
  };

  const saveAllRecordings = () => {
    console.log("saving all selected recordings", tmpRec);
  };

  const exportSelectedRecording = () => {
    console.log("exporting to user specified file", selected);
  };

  console.log(tmpRec);
  console.log(recordings);

  return (
    <div className="recordings">
      <div className="recordings-controls">
        <button onClick={() => saveSelectedRecordings()}>Save</button>
        <button onClick={() => saveAllRecordings()}>Save All</button>
        <button onClick={() => deletRecordings()}>Delete</button>
        <button onClick={() => exportSelectedRecording()}>Export</button>
      </div>

      <div className="recordings-saved">
        <h3>Saved</h3>
        <ul className="sidebar-list">
          {recordings.map((rec, i) => {
            let active = selected[rec] ? true : false;
            return (
              <PatchListItem
                key={i}
                item={rec}
                ui={false}
                click={btnClick}
                active={active}
              />
            );
          })}
        </ul>
      </div>
      <div className="recordings-tmp">
        <h3>Unsaved</h3>
        <ul className="sidebar-list">
          {tmpRec.map((rec, i) => {
            let active = selected[rec] ? true : false;
            return (
              <PatchListItem
                key={i}
                item={rec}
                ui={false}
                click={btnClick}
                active={active}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Recordings;
