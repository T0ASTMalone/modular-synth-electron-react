import React, { useState, useContext, useEffect, useRef } from "react";
import { Knob } from "react-rotary-knob";
import { useLogger } from "../../../utils/hooks/logger";
import AudioVisualizer from "../../displays/AudioVisualizer/AudioVisualizer";

const Blank = (props) => {
  const logger = useLogger("blank");


  return (
    <div className="module blank">
        <AudioVisualizer/>
    </div>
  );
};

Blank.Name = "Blank";

export default Blank;
