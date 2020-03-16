// test low frequency oscillator
// will be part of the normal oscillator module later

/*
  TODO
  ----
  * find out what why it pops when adjusting the frequency

  * find out why it sounds distorted when connected to main gain module

  * merge with regular oscillator by adding an lfo mode button that will change 
    the regular oscillator's frequency range to that of an lfo (0 - 20 Hz)

*/

import React, { useState, useContext, useEffect } from "react";
import "./Lfo.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import { useCreateConnection, useIsOutput } from "../../../utils/module-utils";

const Lfo = props => {
  const [freq, updateFreq] = useState(1);

  const [selected, select] = useState(null);

  const { removeModule, id, values } = props;

  const context = useContext(MsContext);
  const { ctx, nodes } = context;
  const isOutput = useCreateConnection(id);

  // update frequency using knob
  const checkDistance = val => {
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
    const osc = ctx.createOscillator();

    // using values passed in as props
    // set osc values
    if (values) {
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
  }, []);

  // if audio node exists set frequency to current knob value
  if (nodes[id].node) {
    nodes[id].node.frequency.value = freq;
  }

  const updateWav = wav => {
    nodes[id].node.type = wav;
  };

  const mouseIn = () => {
    select(true);
  };

  const mouseOut = () => {
    select(false);
  };

  return (
    <div className='module osc' onMouseEnter={mouseIn} onMouseLeave={mouseOut}>
      {/* remove module button*/}
      <div className='close-button'>
        {selected ? (
          <button className='module__button' onClick={() => removeModule(id)}>
            X
          </button>
        ) : (
          <p className='module__text--bold'>Lfo</p>
        )}
      </div>
      {/* outputs */}
      <div className='osc__outputs'>
        <Output title='out' output={isOutput} id={id} />
      </div>
      <div className='osc__types'>
        <div className='button-container'>
          <p className='module__text'>Sin</p>
          <button
            className='param-button'
            onClick={() => updateWav("sine")}
          ></button>
        </div>
        <div className='button-container'>
          <p className='module__text'>Saw</p>
          <button
            className='param-button'
            onClick={() => updateWav("sawtooth")}
          ></button>
        </div>
        <div className='button-container'>
          <p className='module__text'>Sqr</p>
          <button
            className='param-button'
            onClick={() => updateWav("square")}
          ></button>
        </div>
        <div className='button-container'>
          <p className='module__text'>Sub</p>
          <button className='param-button'></button>
        </div>
      </div>
      {/* frequency knob */}
      <div className='knob'>
        <p className='module__text'>Freq</p>
        <Knob
          onChange={checkDistance.bind(this)}
          min={1}
          max={2000}
          value={freq}
        />
      </div>

      {/* V/oct input */}
      <div className='osc__inputs'>
        <Input title='V/oct' id={id} name='frequency' />
      </div>
    </div>
  );
};

export default Lfo;
