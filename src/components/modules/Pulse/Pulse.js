import React, { useState, useContext, useEffect, useRef } from "react";
import "./Pulse.scss";
import MsContext from "../../../context/MsContext";
// import { useLogger } from "../../../utils/hooks/logger";
import { Nob, Output } from "../../io/io";
import { useCreateConnection } from "../../../utils/module-utils";
import NumDisplay from "../../displays/NumDisplay/NumDisplay";
// import {
//   useCheckDistance,
//   useCreateConnection,
// } from "../../../utils/module-utils";

const Pulse = (props) => {
  const { id } = props;

  const [freq, setFreq] = useState(440);
  const [att, setAtt] = useState(0.2);
  const [rel, setRel] = useState(0.5);
  const [sus, setSus] = useState(1);
  const [bpm, setBpm] = useState(60);
  const [pads, setSelectedPads] = useState({});
  const [playing, setPlaying] = useState(false);
  const [currPad, setCurrPad] = useState({ 0: { note: 8 } });
  const [timerId, setTimerId] = useState(undefined);
  const outputting = useCreateConnection(id);
  // const Logger = useLogger("Pulse");

  // const setAudioParam = useCheckDistance();
  const context = useContext(MsContext);
  // const { id, values } = props;
  // update frequency using knob
  const checkDistance = (val, func, maxDistance, param) => {
    return Math.abs(val - param) <= maxDistance ? func(val) : null;
  };

  const selectPad = (pad) => {
    if (pads[pad]) {
      delete pads[pad];
    } else {
      pads[pad] = true;
    }
    setSelectedPads({ ...pads });
  };

  // const playBeatRef = useRef(playBeat);
  const playBeatRef = useRef(() => {});
  const play = useRef(() => {});
  const scheduleNote = useRef(() => {});
  const bpmRef = useRef(bpm);
  const ctxRef = useRef(context);

  useEffect(() => {
    const { getCurrentState } = ctxRef.current;
    const { audioCtx, nodes } = getCurrentState();
    bpmRef.current = bpm;

    // get existing node from context
    let osc = nodes[id].node;
    let passthrough = nodes[id].analyser;

    // only add node if not created yet
    if (osc === null) {
      osc = audioCtx.createOscillator();
      passthrough = audioCtx.createGain();
      passthrough.value = 1;

      osc.connect(passthrough);
      ctxRef.current.addNode(id, osc, passthrough);
    }
    const lookahead = 10.0; // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.5; // How far ahead to schedule audio (sec)
    let currentNote = 0; // The note we are currently playing
    let nextNoteTime = 0.0; // when the next note is due.

    function nextNote() {
      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTime += secondsPerBeat; // Add beat length to last beat time
      // Advance the beat number, wrap to zero
      currentNote++;

      const currentPad = currPad;
      currentPad[0].note = currentNote;

      if (currentNote === 8) {
        currentPad[0].note = 0;
        currentNote = 0;
      }

      setCurrPad(currentPad);
    }

    // Create a queue for the notes that are to be played, with the current time that we want them to play:
    const notesInQueue = [];

    // let timerID;
    function scheduler() {
      // while there are notes that will need to play before the next interval,
      // schedule them and advance the pointer.
      while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote.current(currentNote, nextNoteTime);
        nextNote();
      }
      // timerID = window.setTimeout(scheduler, lookahead);
      setTimerId(window.setTimeout(scheduler, lookahead));
    }

    scheduleNote.current = (beatNumber, time) => {
      // push the note on the queue, even if we're not playing.
      notesInQueue.push({ note: beatNumber, time: time });
      if (pads[currPad[0].note]) {
        playBeatRef.current();
      }
    };

    playBeatRef.current = () => {
      const sweepLength = sus;

      const osc = audioCtx.createOscillator();
      osc.type = "square";
      osc.frequency.value = freq;
      // Envelope
      const env = audioCtx.createGain();
      env.gain.cancelScheduledValues(audioCtx.currentTime);
      env.gain.setValueAtTime(0, audioCtx.currentTime);
      env.gain.linearRampToValueAtTime(1, audioCtx.currentTime + att);
      env.gain.linearRampToValueAtTime(
        0,
        audioCtx.currentTime + sweepLength - rel
      );

      osc.connect(env);
      osc.start();
      osc.connect(passthrough);
      osc.stop(audioCtx.currentTime + sweepLength);
    };

    play.current = () => {
      let isPlaying = !playing;

      if (isPlaying) {
        // start playing
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }

        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler(); // kick off scheduling
        //requestAnimationFrame(draw); // start the drawing loop.
        //ev.target.dataset.playing = "true";
        setPlaying(true);
      } else {
        window.clearTimeout(timerId);
        //ev.target.dataset.playing = "false";
        setPlaying(false);
      }
    };
  }, [
    bpm,
    ctxRef,
    pads,
    playing,
    timerId,
    playBeatRef,
    att,
    sus,
    rel,
    freq,
    bpmRef,
    currPad,
    id,
  ]);

  const renderPads = () => {
    const padsArr = [];
    let curr = currPad[0].note - 1;
    if (curr === -1) {
      curr = 7;
    }
    for (let i = 0; i <= 7; i++) {
      padsArr.push(
        <button
          key={i}
          onClick={() => selectPad(i)}
          className={
            (curr === i ? "current-note " : "") +
            (pads[i] ? "selected-pad pad" : "pad")
          }
        ></button>
      );
    }
    return padsArr;
  };

  return (
    <div className="module pulse">
      <div className="pulse-params">
        <Nob
          title="freq"
          onChange={(e) => checkDistance(e, setFreq, 2000, freq)}
          step="1"
          min={0}
          max={10000}
          value={freq}
        />
        <Nob
          title="att"
          onChange={(e) => checkDistance(e, setAtt, 0.1, att)}
          step="0.1"
          min={0.01}
          max={1}
          value={att}
        />
        <Nob
          title="rel"
          onChange={(e) => checkDistance(e, setRel, 0.1, rel)}
          step="0.1"
          min={0}
          max={1}
          value={rel}
        />
        <Nob
          title="sus"
          onChange={(e) => checkDistance(e, setSus, 0.1, sus)}
          step="0.1"
          min={0}
          max={1}
          value={sus}
        />
        <Nob
          title="bpm"
          onChange={(e) => checkDistance(Math.floor(e), setBpm, 20, bpm)}
          step={1}
          min={0}
          max={800}
          value={bpm}
        />
        <NumDisplay value={bpm} label="BPM" />
      </div>
      <div className="beats">
        {/* pads */}
        {renderPads()}
      </div>
      <div className="pulse-io">
        <div
          className={
            playing
              ? "toggle-container toggle-container-on"
              : "toggle-container"
          }
        >
          <button
            onClick={(ev) => play.current(ev)}
            className="toggle-switch"
          ></button>
        </div>
        <Output title="out" output={outputting} id={id} />
      </div>
    </div>
  );
};

Pulse.Name = "Pulse";

export default Pulse;
