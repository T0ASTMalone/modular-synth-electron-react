import React, { useContext, useEffect, useState, useRef } from "react";
import "./Rec.css";
import MsContext from "../../context/MsContext";
import { useGetOut } from "../../utils/module-utils";
import { saveWave } from "../../utils/app-utils";

const Rec = () => {
  // set recorder in state when new recording starts
  const [recorder, setRecorder] = useState(null);
  const context = useContext(MsContext);
  const dest = context.mediaStreamDestination;
  const { ctx, rootPath } = context;
  // get main node
  const main = useGetOut();

  // create MediaRecorder options
  // audioBitsPerSecond : will be set in settings of app

  let mediaRecorder;

  const rec = () => {
    // create new recorder
    mediaRecorder = new MediaRecorder(dest.stream);

    // connect main output to stream destination
    main.connect(dest);

    // start media recorder
    mediaRecorder.start();

    // set recorder in state
    setRecorder(mediaRecorder);
  };

  const ondataavailable = async (e) => {
    // get array buffer from media recodrer
    const arrBuffer = await e.data.arrayBuffer();

    // decode audio data
    ctx.decodeAudioData(arrBuffer, (audioBuffer) => {
      // prompt user to save recording
      // or store recording and prompt to save at the end of a session
      // or have allow for user to say save all recordings automatically

      // testing save audio as .wav file
      saveWave(audioBuffer, rootPath);
      ctx.resume();
    });
  };

  const stop = () => {
    // if there is no recorder in state do nothing
    if (!recorder) {
      return;
    }
    // using the recorder in state

    // stop media recorder
    recorder.stop();
    // pause audio context output
    ctx.suspend();
    // disconnect main out from media stream destination
    main.disconnect(dest);
    // set ondataavailble
    recorder.ondataavailable = ondataavailable;
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
