import React, { useContext, useState, useEffect } from "react";
import "./MainGain.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input } from "../../io/io";
import { useCheckDistance } from "../../../utils/module-utils";

const MainGain = props => {
  // gain value
  const [gainValue, setGain] = useState(3.4);
  const [id, setId] = useState(null);
  const [inId, setInId] = useState(null);

  const context = useContext(MsContext);
  const setAudioParam = useCheckDistance();
  const { ctx } = context;
  const { newId } = props;

  const nodeId = newId ? newId : id;

  const updateGain = val => {
    setGain(val);
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

  // if an id was not passed in as props use the
  // generated id

  return (
    <div className='module gain'>
      <h3 className='module__text'>Amp</h3>
      {/* knob for controlling gain */}
      <Knob
        min={0}
        max={6.8}
        value={gainValue}
        onChange={e => setAudioParam(e, "gain", nodeId, updateGain, gainValue)}
      />
      {/* input */}
      <Input title='in' id={nodeId} name='main-in' />
      <Input title='gain' id={nodeId} name='gain' />
    </div>
  );
};

export default MainGain;
