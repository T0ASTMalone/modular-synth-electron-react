import React, { useContext, useState } from "react";
import "./Rec.css";
import MsContext from "../../context/MsContext";
import { useGetOut } from "../../utils/module-utils";
import { saveWave } from "../../utils/app-utils";
import AudioVisualizer from "../displays/AudioVisualizer/AudioVisualizer";

const Rec = () => {
  // set recorder in state when new recording starts
  const [recorder, setRecorder] = useState(null);
  const context = useContext(MsContext);
  const dest = context.mediaStreamDestination;
  const { audioCtx, rootPath, sidebar, toggleSidebar, findMainOut } = context;
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
    audioCtx.decodeAudioData(arrBuffer, (audioBuffer) => {
      // prompt user to save recording
      // or store recording and prompt to save at the end of a session
      // or have allow for user to say save all recordings automatically

      // testing save audio as .wav file
      saveWave(audioBuffer, rootPath);
      audioCtx.resume();

      // clean up recorder
      setRecorder(null);
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
    audioCtx.suspend();
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
      <div id="rack-sb-toggle" className="controls sidebar-toggle">
        <button
          onClick={toggleSidebar}
          className={
            !sidebar
              ? "sidebar-button show"
              : "sidebar-button button--closed hidden"
          }
        >
          &lt;
        </button>
      </div>
      <div className="controls main-controls">
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
      <div className="controls right-controls">
        {audioCtx && findMainOut().mainOutId && <AudioVisualizer id={findMainOut().mainOutId} style={{height: "75px", width: "100%", maxWidth: "300px"}} />}
      </div>
    </div>
  );
};

export default Rec;
