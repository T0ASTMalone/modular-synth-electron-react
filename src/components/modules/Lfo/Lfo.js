// test low frequency oscillator
// will be part of the normal oscillator module later

/*
  TODO
  ----
  * find out what why it pops when adjusting the frequency

  * merge with regular oscillator by adding an lfo mode button that will change 
    the regular oscillator's frequency range to that of an lfo (0 - 20 Hz)

*/

import React, { useState, useContext, useEffect, useRef } from "react";
import "./Lfo.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import { useCreateConnection } from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";

const Lfo = (props) => {
  const { id, values } = props;

  const [freq, updateFreq] = useState(1);

  const context = useContext(MsContext);
  const { nodes } = context;

  const refCtx = useRef(context);

  const isOutput = useCreateConnection(id);

  const logger = useLogger("Lfo");
  const refLogger = useRef(logger);

  // update frequency using knob
  const checkDistance = (val) => {
    let maxDistance = 200;
    let distance = Math.abs(val - freq);
    // prevent knob from going past max value
    if (distance > maxDistance) {
      return;
    } else {
      updateFreq(val);
      nodes[id].node.frequency.value = freq / 100;
    }
  };

  useEffect(() => {
    const logger = refLogger.current;
    logger.info("initializing Lfo");
    const context = refCtx.current;
    const { audioCtx } = context;

    const osc = audioCtx.createOscillator();
    // using values passed in as props
    // set osc values
    if (values) {
      logger.info("setting patch settings in lfo ");
      for (let k in values) {
        if (typeof osc[k] === "object" && "value" in osc[k]) {
          osc[k].value = values[k];
          updateFreq(values[k]);
        } else {
          osc[k] = values[k];
        }
      }
    } else {
      osc.frequency.value = 1;
    }
    // start osc
    osc.start();
    // add to nodes object in context
    // uuid as key and osc as value
    context.addNode(id, osc);
  }, [refCtx, values, id, refLogger]);

  // if audio node exists set frequency to current knob value
  if (nodes[id].node) {
    nodes[id].node.frequency.value = freq;
  }

  const updateWav = (wav) => {
    nodes[id].node.type = wav;
  };

  return (
    <div className="module osc">
      {/* remove module button*/}

      <p className="module__text--bold">Lfo</p>

      {/* outputs */}
      <div className="osc__outputs">
        <Output title="out" output={isOutput} id={id} />
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
          onChange={checkDistance.bind(this)}
          min={1}
          max={2000}
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

Lfo.Name = "Lfo";

export default Lfo;
