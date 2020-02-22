import React, { useState, useContext, useEffect } from "react";
import "./Oscillator.css";
import { Knob, ContextConsumer } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import uuid from "uuid";

const Oscillator = () => {
  const [freq, updateFreq] = useState(0);
  const [id, createId] = useState(null);

  const context = useContext(MsContext);
  const audioCtx = context.ctx;

  console.log(context.nodes);

  const checkDistance = val => {
    let maxDistance = 20;
    let distance = Math.abs(val - freq);
    if (distance > maxDistance) {
      return;
    } else {
      updateFreq(val);
    }
  };

  useEffect(() => {
    const osc = audioCtx.createOscillator();
    const oscId = uuid();
    context.addNode(oscId, osc);
    createId(oscId);
  }, []);

  const turnOn = () => {
    context.nodes[id].connect(audioCtx.destination);
    context.nodes[id].start();
    setTimeout(() => {
      context.nodes[id].stop();
    }, 1000);
  };

  return (
    <div className='osc'>
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
        <button onClick={turnOn}></button>
        <Output title='sin' onClick={turnOn} />
        <Output title='saw' />
        <Output title='sqr' />
        {/* sub will be set to half the current freq */}
        <Output title='sub' />
      </div>

      {/* frequency knob */}
      <div className='knob'>
        <Knob
          onChange={checkDistance.bind(this)}
          min={0}
          max={100}
          value={freq}
        />
        <p className='osc__text'>Freq</p>
      </div>

      {/* V/oct input */}
      <div className='osc__inputs'>
        <Input title='V/oct' />
      </div>
    </div>
  );
};

export default Oscillator;
