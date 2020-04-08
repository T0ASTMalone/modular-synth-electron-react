import React, { useContext, useState, useEffect, useRef } from "react";
import "./Gain.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input, Output } from "../../io/io";
import {
  useCreateConnection,
  useCheckDistance,
} from "../../../utils/module-utils";

const Gain = (props) => {
  // gain value
  const [gainValue, setGain] = useState(4.4);
  const [selected, select] = useState(null);
  const { removeModule, id, values } = props;

  const context = useContext(MsContext);
  const setAudioParam = useCheckDistance();
  const outputting = useCreateConnection(id);

  const refCtx = useRef(context);

  //set up main gain module
  useEffect(() => {
    const context = refCtx.current;
    const { ctx } = context;
    // create main gain node
    const gainNode = ctx.createGain();
    // set value
    // set gainNode values
    if (values) {
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
  }, [refCtx, values, id]);

  // if an id was not passed in as props use the
  // generated id
  const mouseIn = () => {
    select(true);
  };

  const mouseOut = () => {
    select(false);
  };

  return (
    <div className="module gain" onMouseEnter={mouseIn} onMouseLeave={mouseOut}>
      <div className="close-button">
        {selected ? (
          <button className="module__button" onClick={() => removeModule(id)}>
            X
          </button>
        ) : (
          <p className="module__text--bold">Gain</p>
        )}
      </div>
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
