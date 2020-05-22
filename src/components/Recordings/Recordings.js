import React, { useState, useEffect } from "react";
import "./Recordings.css";
import PatchListItem from "../PatchListItem/PatchListItem";

const Recordings = () => {
  let recordings = ["wubwubs.wav", "helloWorld.wav", "patchy.wav"];
  let tmpRec = ["tmp_rec.wav", "tmp_rec1.wav"];
  const [selected, setSelected] = useState({});

  const btnClick = (name) => {
    const items = selected;
    if (items[name]) {
      delete items[name];
    } else {
      items[name] = name;
    }

    setSelected({ ...items });
  };

  useEffect(() => {
    // read recordings folder for project or tmp folder
    // for new patches
  }, []);

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
