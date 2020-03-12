import React, { useContext, useState, useEffect } from "react";
import "./MainGain.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input } from "../../io/io";

const MainGain = props => {
  // gain value
  const [gainValue, setGain] = useState(0);
  const [id, setId] = useState(null);
  const [inId, setInId] = useState(null);

  const context = useContext(MsContext);
  const { ctx, nodes } = context;
  const { newId } = props;

  const checkDistance = val => {
    let maxDistance = 3.4;
    let distance = Math.abs(val - gainValue);
    // prevent knob from going past max value
    if (distance > maxDistance) {
      return;
    } else {
      setGain(val);
    }
    newId
      ? (nodes[newId].node.gain.value = val)
      : (nodes[id].node.gain.value = val);
  };

  //set up main gain module
  useEffect(() => {
    // create main gain node
    const gainNode = ctx.createGain();
    // connect to ctx destination
    gainNode.connect(ctx.destination);
    // set value
    gainNode.gain.value = gainValue;
    // add to context
    const id = context.load("main-gain");
    // use id created by context to add node
    context.addNode(id, gainNode);
    // set to id
    setId(id);
    //set input ids
    setInId(inId);
  }, []);

  return (
    <div className="module gain">
      <h3 className="module__text">Amp</h3>
      {/* knob for controlling gain */}
      <Knob
        min={-3.4}
        max={3.4}
        value={gainValue}
        onChange={checkDistance.bind(this)}
      />
      {/* input */}
      <Input title="in" id={newId ? newId : id} name="main-in" />
      <Input title="gain" id={newId ? newId : id} name="gain" />
    </div>
  );
};

export default MainGain;
