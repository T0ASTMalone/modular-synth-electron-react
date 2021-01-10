import React, { useContext, useState, useEffect, useRef } from "react";
import "./Gain.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input, Output } from "../../io/io";
import {
  useCreateConnection,
  useCheckDistance,
} from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";

const Gain = (props) => {
  // gain value
  const [gainValue, setGain] = useState(4.4);
  const { id, values } = props;

  const context = useContext(MsContext);
  const setAudioParam = useCheckDistance();
  const outputting = useCreateConnection(id);

  const refCtx = useRef(context);

  const logger = useLogger("Gain");
  const refLogger = useRef(logger);
  //set up main gain module
  useEffect(() => {
    const logger = refLogger.current;
    logger.info("initializing gain");
    const context = refCtx.current;
    const { audioCtx } = context;
    // create main gain node
    const gainNode = audioCtx.createGain();
    // set value
    // set gainNode values
    if (values) {
      logger.info("implementing patch settings for gain");
      for (let k in values) {
        if (typeof gainNode[k] === "object" && "value" in gainNode[k]) {
          gainNode[k].value = values[k];
          setGain(values[k]);
        } else {
          gainNode[k] = values[k];
        }
      }
    }
    // use id created by context to add node
    context.addNode(id, gainNode);
  }, [refCtx, values, id, refLogger]);

  // if an id was not passed in as props use the
  // generated id

  return (
    <div className="module gain">
      <p className="module__text--bold">Gain</p>

      {/* knob for controlling gain */}
      <Knob
        min={0}
        max={6.8}
        value={gainValue}
        onChange={(e) => setAudioParam(e, gainValue, "gain", id, setGain)}
      />
      {/* input */}
      <div className="gain__outputs">
        <Input title="in" id={id} name="main-in" />
        <Input title="gain" id={id} name="gain" />
        <Output title="out" output={outputting} id={id} />
      </div>
    </div>
  );
};

Gain.Name = "Gain";

export default Gain;
