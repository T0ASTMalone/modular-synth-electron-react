import React, { useState, useContext, useEffect, useRef } from "react";
import "./Oscillator.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import {
  useCreateConnection,
  useCheckDistance,
} from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";

const Oscillator = (props) => {
  const [freq, setFreq] = useState(440);
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
    const { ctx } = context;
    // create oscillator
    const osc = ctx.createOscillator();
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
    // start osc
    osc.start();
    // add to context
    context.addNode(id, osc);
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
      {/* frequency knob */}
      <div className="knob">
        <p className="module__text">Freq</p>
        <Knob
          onChange={(e) => setAudioParam(e, freq, "frequency", id, setFreq)}
          min={0}
          max={24000}
          value={freq}
        />
      </div>

      {/* V/oct input */}
      <div className="osc__inputs">
        <Input title="V/oct" id={id} name="frequency" />
      </div>
    </div>
  );
};

Oscillator.Name = "Oscillator";

export default Oscillator;
