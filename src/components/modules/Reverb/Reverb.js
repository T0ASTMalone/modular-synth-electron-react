import React, { useContext, useState, useEffect, useRef } from "react";
import "./Reverb.css";
import { Knob } from "react-rotary-knob";
import MsContext from "../../../context/MsContext";
import { Input, Output } from "../../io/io";
import { useCreateConnection } from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";

const Reverb = (props) => {
  // reverb value
  const [reverb, setReverb] = useState(3.4);
  const [duration, setDuration] = useState(4);
  const [decay, setDecay] = useState(4);
  const [reverse, setReverse] = useState(false);
  const { id, values } = props;

  const context = useContext(MsContext);
  const outputting = useCreateConnection(id);

  const logger = useLogger("Reverb");

  const { ctx, nodes } = context;

  const refCtx = useRef(context);
  const refLogger = useRef(logger);

  // todo
  // make knobs for duration, decay, and a button for reverse
  function impulseResponse(duration, decay, reverse) {
    logger.info("setting inpules response for reverb");
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

  const refImpulseResponse = useRef(impulseResponse);
  const refDec = useRef(decay);
  const refDur = useRef(duration);
  const refRev = useRef(reverse);
  const refVal = useRef(values);

  //set up main reverb module
  useEffect(() => {
    const reverse = refRev.current;
    const duration = refDur.current;
    const decay = refDec.current;
    const values = refVal.current;
    const impulseResponse = refImpulseResponse.current;
    const logger = refLogger.current;
    const context = refCtx.current;
    const { ctx } = context;
    logger.info("initializing reverb");
    // create main reverb node
    const convolverNode = ctx.createConvolver();
    // setting up convolver node buffer
    convolverNode.buffer = impulseResponse(duration, decay, reverse);

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
  }, [
    refLogger,
    refCtx,
    id,
    refImpulseResponse,
    refDec,
    refDur,
    refRev,
    refVal,
  ]);

  const checkDistance = (val, oldVal, input) => {
    let roundNew = Math.round(val);
    let roundOld = Math.round(oldVal);
    let maxDistance = 5;

    let distance = Math.abs(val - oldVal);
    // prevent knob from going past max value

    if (distance > maxDistance) {
      return;
    } else if (roundNew !== roundOld) {
      roundNew += 0.1;
      updateBuffer(roundNew, input);
    }
  };

  // add function that will update the buffer and will be passed to
  // the check distance hook

  const updateBuffer = (val, param) => {
    logger.info("updating buffer for reverb");
    switch (param) {
      case "reverse":
        nodes[id].node.buffer = impulseResponse(duration, decay, val);
        setReverse(val);
        break;
      case "duration":
        nodes[id].node.buffer = impulseResponse(val, decay, reverse);
        setDuration(val);
        break;
      default:
        nodes[id].node.buffer = impulseResponse(duration, val, reverse);
        setDecay(val);
        break;
    }
  };

  // if an id was not passed in as props use the
  // generated id

  return (
    <div className="module reverb">
      <p className="module__text--bold">
        Reverb <span>{reverb}</span>
      </p>

      {/* knob for controlling reverb duration */}

      <Knob
        min={0.1}
        max={5}
        step={1}
        value={duration}
        onChange={(e) => checkDistance(e, duration, "duration")}
      />
      {/* knob for controlling reverb decay */}
      <Knob
        min={0.1}
        max={5}
        step={1}
        value={decay}
        onChange={(e) => checkDistance(e, decay, "decay")}
      />
      {/* button to control reverse */}
      <button
        className="reverb__reverse"
        onClick={() => updateBuffer(!reverse, "reverse")}
      >
        reverse
      </button>
      {/* input */}
      <div className="reverb__outputs">
        <Input title="in" id={id} name="main-in" />
        <Output title="out" output={outputting} id={id} />
      </div>
    </div>
  );
};

Reverb.Name = "Reverb";

export default Reverb;
