// test low frequency oscillator
// will be part of the normal oscillator module later

/*
  TODO
  ----
  * find out what why it pops when adjusting the frequency

  * find out why it sounds distorted when connected to main gain module

  * add to sidebar

  * merge with regular oscillator by adding an lfo mode button that will change 
    the regular oscillator's frequency range to that of an lfo (0 - 20 Hz)

*/

import React, { useState, useContext, useEffect } from "react";
import "./Lfo.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import shortId from "shortid";

const Lfo = () => {
  const [freq, updateFreq] = useState(1);
  const [id, createId] = useState(null);

  const context = useContext(MsContext);
  const { ctx, cables, nodes } = context;

  // update frequency using knob
  const checkDistance = val => {
    let maxDistance = 200;
    let distance = Math.abs(val - freq);
    // prevent knob from going past max value
    if (distance > maxDistance) {
      return;
    } else {
      updateFreq(val);
      nodes[id].frequency.value = freq / 100;
    }
  };

  useEffect(() => {
    // create oscillator
    const osc = ctx.createOscillator();
    // give osc unique name
    const oscId = shortId.generate();

    osc.frequency.value = 1;
    // start osc
    osc.start();
    // add to nodes object in context
    // uuid as key and osc as value
    context.addNode(oscId, osc);
    // add uuid to state for use elsewhere
    createId(oscId);
  }, []);

  // if audio node exists set frequency to current knob value
  if (id) {
    nodes[id].frequency.value = freq;
  }

  const updateWav = wav => {
    nodes[id].type = wav;
  };

  // the following will be turned into a hook for all modules to re-use
  // simply pass the output module id and it will create a connection if
  // it sees one
  useEffect(() => {
    // when there is a change in the cables object, ask two questions

    // am I an input?

    // am I an output?
    const out = cables[id];

    // if this module is an output in a current cable
    if (out) {
      // get cables module and input on that module
      const { mod, input } = out;

      if (input === "main-in") {
        // if input is main in, connect to module
        console.log(nodes[mod]);
        nodes[id].connect(nodes[mod]);
      } else {
        // if input is not main connect to corresponding audio parameter
        console.log(nodes[mod][input]);
        nodes[id].connect(nodes[mod][input]);
      }

      // return input and true
      // set input modulation to on in state
      // for styling purposes
    } else {
      // if no cable with this module as an output is found
      // disconnect from any connections that the module may have
      if (nodes[id]) {
        console.log("disconnecting");
        nodes[id].disconnect();
      }
      // return input and false
      // set input modulation to off in state
      // for styling purposes
    }
  }, [Object.keys(cables).length]);

  return (
    <div className='module osc'>
      {/* outputs */}
      <div className='osc__outputs'>
        <Output title='out' id={id} />
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
