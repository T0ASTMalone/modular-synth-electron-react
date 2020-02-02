import React from "react";
import Oscillator from "../modules/Oscillator/Oscillator.js";
import Filter from "../modules/Filter/FIlter";
import "./Rack.css";

const Rack = () => {
  return (
    <div className="rack">
      <Oscillator />
      <Oscillator />
      <Filter />
    </div>
  );
};

export default Rack;
