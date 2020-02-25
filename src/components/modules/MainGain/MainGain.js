import React, { useContext, useState, useEffect } from "react";
import "./MainGain.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input } from "../../io/io";
import uuid from "uuid";

const MainGain = () => {
  // gain value
  const [gainValue, setGain] = useState(0);
  const [id, setId] = useState(null);

  const context = useContext(MsContext);
  const audioCtx = context.ctx;
  const nodes = context.nodes;

  const checkDistance = val => {
    let maxDistance = 3.4;
    let distance = Math.abs(val - gainValue);
    // prevent knob from going past max value
    if (distance > maxDistance) {
      return;
    } else {
      setGain(val);
    }
    nodes[id].gain.value = val;
  };

  //set up main gain module
  useEffect(() => {
    // create unique id
    const id = uuid();
    // create main gain node
    const gainNode = audioCtx.createGain();
    // connect to ctx destination
    gainNode.connect(audioCtx.destination);
    // set value
    gainNode.gain.value = gainValue;
    // add to context
    context.addNode(id, gainNode);
    // set to id
    setId(id);
  }, []);

  return (
    <div className='module gain'>
      <h3 className='module__text'>Amp</h3>
      {/* knob for controlling gain */}
      <Knob
        min={-3.4}
        max={3.4}
        value={gainValue}
        onChange={checkDistance.bind(this)}
      />
      {/* input */}
      <Input title='in' />
    </div>
  );
};

export default MainGain;
