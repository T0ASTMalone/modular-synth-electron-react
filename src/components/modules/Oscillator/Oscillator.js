import React, { useState } from "react";
import "./Oscillator.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";

const Oscillator = () => {
  const [freq, updateFreq] = useState(0);

  const checkDistance = val => {
    let maxDistance = 20;
    let distance = Math.abs(val - freq);
    if (distance > maxDistance) {
      return;
    } else {
      updateFreq(val);
    }
  };

  return (
    <div className="osc">
      {/* 
      V/oct input,

      output that plays the selected wave shape 
      or
      outputs for each of the wave shapes and a sub.
      where the sub might be half the core frequency
    */}

      {/* outputs */}
      <div className="osc__outputs">
        {/* 
        all outputs except the sub will be set to the current frequency 
      */}
        <Output title="sin" />
        <Output title="saw" />
        <Output title="sqr" />
        {/* sub will be set to half the current freq */}
        <Output title="sub" />
      </div>

      {/* frequency knob */}
      <div className="knob">
        <Knob
          onChange={checkDistance.bind(this)}
          min={0}
          max={100}
          value={freq}
        />
        <p className="osc__text">Freq</p>
      </div>

      {/* V/oct input */}
      <div className="osc__inputs">
        <Input title="V/oct" />
      </div>
    </div>
  );
};

export default Oscillator;
