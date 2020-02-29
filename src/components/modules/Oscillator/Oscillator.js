import React, { useState, useContext, useEffect } from "react";
import "./Oscillator.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
// import uuid from "uuid";
import shortId from "shortid";

const Oscillator = () => {
  const [freq, updateFreq] = useState(440);
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
      nodes[id].frequency.value = freq;
    }
  };

  useEffect(() => {
    // create oscillator
    const osc = ctx.createOscillator();
    // give osc unique name
    const oscId = shortId.generate();
    // start osc
    osc.start();
    // add to nodes object in context
    // uuid as key and osc as value
    context.addNode(oscId, osc);
    // add uuid to state for use elsewhere
    createId(oscId);
  }, []);

  // in production this will read the connections object in context
  // and if there is a connection, connect output to the appropriate
  // input
  const turnOn = () => {
    // testing audio by connecting to ctx destination
    nodes[id].connect(ctx.destination);
    // running for five seconds
    setTimeout(() => {
      // disconnecting from audio context
      nodes[id].disconnect(ctx.destination);
    }, 5000);
  };

  // if audio node exists set frequency to current knob value
  // if (id) {
  //   nodes[id].frequency.value = freq;
  // }

  const updateWav = wav => {
    nodes[id].type = wav;
  };

  // the following will be turned into a hook for all modules to re-use
  // simply pass the output module id and it will create a connection if
  // it sees one
  useEffect(() => {
    // if this module is an output in a current cable
    const out = cables[id];

    if (out) {
      const { mod, input } = out;

      if (input === "main-in") {
        // if input is main in, connect to modules input'
        console.log(nodes[mod]);
        nodes[id].connect(nodes[mod]);
      } else {
        // if input i not main connect to corresponding audio parameter
        console.log(nodes[mod][input]);
        nodes[id].connect(nodes[mod][input]);
      }
    } else {
      // if no cable with this module as an output is found
      // disconnect from any connections that the module may have
      if (nodes[id]) {
        console.log("disconnecting");
        nodes[id].disconnect();
      }
    }
  }, [Object.keys(cables).length]);

  return (
    <div className='module osc'>
      {/* 
      V/oct input,

      output that plays the selected wave shape 
      or
      outputs for each of the wave shapes and a sub.
      where the sub might be half the core frequency
    */}

      {/* outputs */}
      <div className='osc__outputs'>
        {/* 
        all outputs except the sub will be set to the current frequency 
      */}
        {/* <button onClick={turnOn}></button> */}
        {/* sub will be set to half the current freq */}
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
          min={0.01}
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

export default Oscillator;
