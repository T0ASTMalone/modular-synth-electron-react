import React, { useContext, useState, useEffect } from "react";
import "./Reverb.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input, Output } from "../../io/io";
import {
  useCreateConnection,
  useCheckDistance
} from "../../../utils/module-utils";

const Reverb = props => {
  // reverb value
  const [reverb, setReverb] = useState(3.4);
  const [selected, select] = useState(null);
  const { removeModule, id, values } = props;

  const context = useContext(MsContext);
  const outputting = useCreateConnection(id);

  const { ctx, nodes } = context;

  // todo

  // make knobs for duration, decay, and a button for reverse
  function impulseResponse(duration, decay, reverse) {
    var sampleRate = ctx.sampleRate;
    var length = sampleRate * duration;
    var impulse = ctx.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay) decay = 2.0;
    for (var i = 0; i < length; i++) {
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
  }

  //set up main reverb module
  useEffect(() => {
    // create main reverb node
    const convolverNode = ctx.createConvolver();
    // setting up convolver node buffer
    convolverNode.buffer = impulseResponse(4, 4, false);
    console.log(convolverNode);

    if (values) {
      for (let k in values) {
        if (
          typeof convolverNode[k] === "object" &&
          "value" in convolverNode[k]
        ) {
          convolverNode[k].value = values[k];
          setReverb(values[k]);
        } else {
          convolverNode[k] = values[k];
        }
      }
    }
    // use id created by context to add node
    context.addNode(id, convolverNode);
  }, []);

  // if an id was not passed in as props use the
  // generated id
  const mouseIn = () => {
    select(true);
  };

  const mouseOut = () => {
    select(false);
  };

  return (
    <div
      className="module reverb"
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
    >
      <div className="close-button">
        {selected ? (
          <button className="module__button" onClick={() => removeModule(id)}>
            X
          </button>
        ) : (
          <p className="module__text--bold">Reverb</p>
        )}
      </div>
      {/* knob for controlling reverb duration */}

      <Knob min={0} max={6.8} value={reverb} />
      {/* knob for controlling reverb decay */}
      <Knob min={0} max={6.8} value={reverb} onChange={e => setReverb(e)} />
      {/* button to control reverse */}
      {/* input */}
      <div className="reverb__outputs">
        <Input title="in" id={id} name="main-in" />
        <Output title="out" output={outputting} id={id} />
      </div>
    </div>
  );
};

export default Reverb;
