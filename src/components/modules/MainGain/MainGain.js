import React, { useContext, useState, useEffect, useRef } from "react";
import "./MainGain.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input } from "../../io/io";
import { useCheckDistance } from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";

const MainGain = (props) => {
  // gain value
  const [gainValue, setGain] = useState(4.4);
  const [id, setId] = useState(null);
  const [inputCount, setInputCount] = useState(0);
  const logger = useLogger("Main Gain");

  const context = useContext(MsContext);
  const setAudioParam = useCheckDistance();

  const refCtx = useRef(context);
  const refLogger = useRef(logger);
  const { newId } = props;
  const { updateCables } = context;

  const nodeId = newId ? newId : id;

  //set up main gain module
  useEffect(() => {
    const logger = refLogger.current;
    logger.info("initializing Main gain");
    // create main gain node
    const context = refCtx.current;
    const ctx = context.ctx;
    const gainNode = ctx.createGain();

    // connect to ctx destination
    gainNode.connect(ctx.destination);
    logger.info("connecting main gain to audio destination");
    // add to context
    const id = context.load("main-gain");
    // use id created by context to add node
    context.addNode(id, gainNode);
    // set to id
    setId(id);
    //set input ids
  }, [refCtx, refLogger]);

  useEffect(() => {
    const ctx = refCtx.current;
    const { cables } = ctx.getCurrentState();
    let count = 0;

    for (let c in cables) {
      if (cables[c].mod === id) {
        count++;
      }
    }
    setInputCount(count);
  }, [updateCables, refCtx, id]);

  const renderInputs = () => {
    const inputs = [];

    console.log(inputCount);
    inputs.push(<Input key={0} title="in" id={nodeId} name="main-in" />);
    for (let i = 1; i < inputCount + 1; i++) {
      inputs.push(<Input key={i} title="in" id={nodeId} name="main-in" />);
    }

    return inputs;
  };

  // if an id was not passed in as props use the
  // generated id

  return (
    <div className="module gain">
      <h3 className="module__text">Amp</h3>
      {/* knob for controlling gain */}
      <Knob
        min={0}
        max={6.8}
        value={gainValue}
        onChange={(e) => setAudioParam(e, gainValue, "gain", nodeId, setGain)}
      />
      {/* input */}
      {renderInputs()}
      <Input title="gain" id={nodeId} name="gain" />
    </div>
  );
};

MainGain.Name = "MainGain";

export default MainGain;
