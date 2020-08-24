import React, { useState, useContext, useEffect, useRef } from "react";
import "./Pulse.scss";
// import { Output, Input } from "../../io/io";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
// import { useLogger } from "../../../utils/hooks/logger";
// import {
//   useCheckDistance,
//   useCreateConnection,
// } from "../../../utils/module-utils";

const Pulse = (props) => {
  const [freq, setFreq] = useState(440);
  const [att, setAtt] = useState(0.2);
  const [rel, setRel] = useState(0.5);
  const [sus, setSus] = useState(1);
  const [bpm, setBpm] = useState(60);
  const [pads, setSelectedPads] = useState({});

  // const setAudioParam = useCheckDistance();
  const context = useContext(MsContext);
  const { ctx } = context;

  const { id, values } = props;

  // update frequency using knob
  const checkDistance = (val, func, maxDistance, param) => {
    const { nodes } = context;
    let distance = Math.abs(val - param);
    // prevent knob from going past max value
    if (distance > maxDistance) {
      return;
    } else {
      func(val);
    }
  };

  const playBeat = () => {
    const sweepLength = 2;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;

    // Envelope
    const env = ctx.createGain();
    env.gain.cancelScheduledValues(ctx.currentTime);
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(1, ctx.currentTime + att);
    env.gain.linearRampToValueAtTime(0, ctx.currentTime + sweepLength - rel);

    osc.connect(env).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + sweepLength);
  };

  const selectPad = (pad) => {
    const selectedPads = pads;
    console.log(selectedPads, pads);
    if (selectedPads[pad]) {
      selectedPads[pad] = false;
      setSelectedPads(selectedPads);
    } else {
      selectedPads[pad] = true;
      setSelectedPads(selectedPads);
    }
  };

  const playBeatRef = useRef(playBeat);
  const play = useRef(() => {});
  const ctxRef = useRef(context);

  useEffect(() => {
    let tempo = bpm;
    const { getCurrentState } = ctxRef.current;
    const { ctx } = getCurrentState();
    const playBeat = playBeatRef.current;

    const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

    let currentNote = 0; // The note we are currently playing
    let nextNoteTime = 0.0; // when the next note is due.

    function nextNote() {
      const secondsPerBeat = 60.0 / tempo;
      nextNoteTime += secondsPerBeat; // Add beat length to last beat time

      // Advance the beat number, wrap to zero
      currentNote++;
      if (currentNote === 4) {
        currentNote = 0;
      }
    }

    // Create a queue for the notes that are to be played, with the current time that we want them to play:
    const notesInQueue = [];

    function scheduleNote(beatNumber, time) {
      // push the note on the queue, even if we're not playing.
      notesInQueue.push({ note: beatNumber, time: time });
      // console.log(beatNumber, time);

      if (pads[currentNote]) {
        playBeat();
      }
    }

    let timerID;
    function scheduler() {
      // while there are notes that will need to play before the next interval,
      // schedule them and advance the pointer.
      while (nextNoteTime < ctx.currentTime + scheduleAheadTime) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
      }
      timerID = window.setTimeout(scheduler, lookahead);
    }

    // We also need a draw function to update the UI, so we can see when the beat progresses.

    // let lastNoteDrawn = 3;
    // function draw() {
    //   let drawNote = lastNoteDrawn;
    //   const currentTime = ctx.currentTime;

    //   while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    //     drawNote = notesInQueue[0].note;
    //     notesInQueue.splice(0, 1); // remove note from queue
    //   }

    //   // We only need to draw if the note has moved.
    //   if (lastNoteDrawn !== drawNote) {
    //     pads.forEach((el) => {
    //       el.children[lastNoteDrawn].style.borderColor = "hsla(0, 0%, 10%, 1)";
    //       el.children[drawNote].style.borderColor = "hsla(49, 99%, 50%, 1)";
    //     });

    //     lastNoteDrawn = drawNote;
    //   }
    //   // set up to draw again
    //   requestAnimationFrame(draw);
    // }
    let isPlaying = false;
    play.current = (ev) => {
      isPlaying = !isPlaying;

      if (isPlaying) {
        // start playing

        // check if context is in suspended state (autoplay policy)
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        currentNote = 0;
        nextNoteTime = ctx.currentTime;
        scheduler(); // kick off scheduling
        //requestAnimationFrame(draw); // start the drawing loop.
        //ev.target.dataset.playing = "true";
      } else {
        window.clearTimeout(timerID);
        //ev.target.dataset.playing = "false";
      }
    };
  }, [bpm, ctxRef, pads, playBeatRef]);

  return (
    <div className="module pulse">
      <div className="pulse-params">
        {/* attack, release, freq, durr, bpm */}
        <Knob
          onChange={(e) => checkDistance(e, setFreq, 2000, freq)}
          step="1"
          min={0}
          max={20000}
          value={freq}
        />
        <Knob
          onChange={(e) => checkDistance(e, setAtt, 0.1, att)}
          step="0.1"
          min={0}
          max={1}
          value={att}
        />
        <Knob
          onChange={(e) => checkDistance(e, setRel, 0.1, rel)}
          step="0.1"
          min={0}
          max={1}
          value={rel}
        />
        <Knob
          onChange={(e) => checkDistance(e, setSus, 0.1, sus)}
          step="0.1"
          min={0}
          max={1}
          value={sus}
        />
        <Knob
          onChange={(e) => checkDistance(e, setBpm, 20, bpm)}
          step="1"
          min={0}
          max={200}
          value={bpm}
        />
      </div>
      <div className="beats">
        {/* pads */}
        <button onClick={() => selectPad(0)} className="pad"></button>
        <button onClick={() => selectPad(1)} className="pad"></button>
        <button onClick={() => selectPad(2)} className="pad"></button>
        <button onClick={() => selectPad(3)} className="pad"></button>
      </div>
      <div className="pulse-io">
        <button onClick={(ev) => play.current(ev)} className="pad"></button>
        {/* <Output /> */}
      </div>
    </div>
  );
};

Pulse.Name = "Pulse";

export default Pulse;
