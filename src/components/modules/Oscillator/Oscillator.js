import React, { useState, useContext, useEffect, useRef } from "react";
import "./Oscillator.css";
import { Input, Nob, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import {
  useCreateConnection,
  useCheckDistance,
} from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";
import AudioVisualizer from "../../displays/AudioVisualizer/AudioVisualizer";

const Oscillator = (props) => {
  const [freq, setFreq] = useState(440);
  // const [analyser, setAnalyser] = useState(null);
  const { id, values } = props;

  const context = useContext(MsContext);
  const setAudioParam = useCheckDistance();
  const outputting = useCreateConnection(id);

  const { nodes } = context;
  const { node } = nodes[id];

  const refCtx = useRef(context);

  const logger = useLogger("Oscillator");
  const refLogger = useRef(logger);

  useEffect(() => {
    const logger = refLogger.current;
    logger.info("initializing Osillator");
    const context = refCtx.current;
    const { audioCtx } = context;
    // create oscillator
    const osc = audioCtx.createOscillator();
    // using values passed in as props
    // set osc values
    if (values) {
      for (let k in values) {
        if (typeof osc[k] === "object" && "value" in osc[k]) {
          osc[k].value = values[k];
          setFreq(values[k]);
        } else {
          osc[k] = values[k];
        }
      }
    }

    const analyser = audioCtx.createAnalyser();
    // start osc
    osc.start();
    osc.connect(analyser);
    // add to context
    context.addNode(id, osc, analyser);
  }, [refCtx, values, id, refLogger]);

  const updateWav = (wav) => {
    node.type = wav;
  };

  return (
    <div className="module osc">
      <h3 className="module__text--bold">Oscillator</h3>
      {/* outputs */}
      <div className="osc__outputs">
        <Output title="out" output={outputting} id={id} />
      </div>
      <div className="osc__types">
        <div className="button-container">
          <p className="module__text">Sin</p>
          <button
            className="param-button"
            onClick={() => updateWav("sine")}
          ></button>
        </div>
        <div className="button-container">
          <p className="module__text">Saw</p>
          <button
            className="param-button"
            onClick={() => updateWav("sawtooth")}
          ></button>
        </div>
        <div className="button-container">
          <p className="module__text">Sqr</p>
          <button
            className="param-button"
            onClick={() => updateWav("square")}
          ></button>
        </div>
      </div>
      <Nob
        title="freq"
        onChange={(e) => setAudioParam(e, freq, "frequency", id, setFreq)}
        min={0}
        max={24000}
        value={freq}
      />

      {/* V/oct input */}
      <div className="osc__inputs">
        {/* {nodes[id].node && nodes[id].analyser && (
          <AudioVisualizer id={id} height="50" width="50" />
        )} */}
        <Input title="V/oct" id={id} name="frequency" />
      </div>
    </div>
  );
};

Oscillator.Name = "Oscillator";

export default Oscillator;
