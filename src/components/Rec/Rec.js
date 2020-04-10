import React, { useContext } from "react";
import "./Rec.css";
import MsContext from "../../context/MsContext";
import { useGetOut } from "../../utils/module-utils";

const Rec = () => {
  const context = useContext(MsContext);
  const dest = context.mediaStreamDestination;
  // get main node
  const main = useGetOut();
  // create MediaRecorder options

  // create media recorder
  let mediaRecorder;

  const rec = () => {
    mediaRecorder = new MediaRecorder(dest.stream);
    // connect main to stream destination
    main.connect(dest);
    // start media recorder
    mediaRecorder.start();
    console.log("started recordingf");
  };

  const ondataavailable = (data) => {
    console.log("formating data and promting user to save data");
    //store data and ask to save
  };

  const stop = () => {
    console.log("stopped recording");
    // stop media recorder
    mediaRecorder.stop();

    // ondataavailable fires so add a call back function to handle that
    mediaRecorder.ondataavailable = ondataavailable;
  };

  const play = () => {
    // play back recording
    console.log("playing back recording");
  };

  return (
    <div className="rack__controls">
      {/* rack controls */}
      <button className="button" onClick={() => stop()}>
        Stop
      </button>
      <button className="button" onClick={() => play()}>
        Play
      </button>
      <button className="button" onClick={() => rec()}>
        Rec
      </button>
    </div>
  );
};

export default Rec;
