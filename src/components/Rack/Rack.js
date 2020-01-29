import React from "react";
import Oscillator from "../modules/Oscillator/Oscillator.js";
import "./Rack.css";

const Rack = () => {
  return (
    <div className='rack'>
      <Oscillator />
      <Oscillator />
      <Oscillator />
      <Oscillator />
      <Oscillator />
      <Oscillator />
    </div>
  );
};

export default Rack;
