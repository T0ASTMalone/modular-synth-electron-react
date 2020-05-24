import React, { useState, useEffect, useContext, useRef } from "react";
import "./Filter.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import {
  useCreateConnection,
  useCheckDistance,
} from "../../../utils/module-utils";

const Filter = (props) => {
  // state
  const [freq, setFreq] = useState(0);
  const [reso, setReso] = useState(3.4);
  const [gain, setGain] = useState(3.4);
  // const [inId, setInId] = useState(null);
  const [type, setType] = useState(0);

  const { id, values } = props;

  const context = useContext(MsContext);
  const output = useCreateConnection(id);
  const setAudioParam = useCheckDistance();
  const { nodes } = context;

  const refCtx = useRef(context);

  const filterTypes = [
    "lowpass",
    "highpass",
    "bandpass",
    "lowshelf",
    "highshelf",
    "peaking",
    "notch",
    "allpass",
  ];

  // filter types
  // lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass

  const updateType = () => {
    let newType = type;
    // if type is less than filterTypes.length
    // increment type
    if (newType < 7) {
      newType++;
    }
    // else set to 0
    else {
      newType = 0;
    }
    // set new type of filter
    nodes[id].node.type = filterTypes[newType];
    // set type value in state
    setType(newType);
  };

  // Though the AudioParam objects returned are read-only, the values they represent are not.

  // BiquadFilterNode.frequency Read only
  // Is an a-rate AudioParam, a double representing a frequency in the current filtering algorithm measured in hertz (Hz).
  // BiquadFilterNode.detune Read only
  // Is an a-rate AudioParam representing detuning of the frequency in cents.
  // BiquadFilterNode.Q Read only
  // Is an a-rate AudioParam, a double representing a Q factor, or quality factor.
  // BiquadFilterNode.gain Read only
  // Is an a-rate AudioParam, a double representing the gain used in the current filtering algorithm.
  // BiquadFilterNode.type
  // Is a string value defining the kind of filtering algorithm the node is implementing.

  // use effect

  // set up filter
  useEffect(() => {
    const context = refCtx.current;
    const { ctx } = context;
    // create filter
    const filter = ctx.createBiquadFilter();
    // add to nodes object in context
    // uuid as key and filter as value
    context.addNode(id, filter);
    // set id in state

    if (values) {
      // using values passed in as props
      // set module values
      for (let k in values) {
        if (typeof filter[k] === "object" && "value" in filter[k]) {
          filter[k].value = values[k];
          switch (k) {
            case "frequency":
              setFreq(values[k]);
              break;
            case "Q":
              setReso(values[k]);
              break;
            default:
              setGain(values[k]);
              break;
          }
        } else {
          filter[k] = values[k];
          updateType(values[k]);
        }
      }
    }

    // setInId(inId);
  }, [refCtx, values, id]);

  return (
    <div className="module filter">
      {/* remove module button*/}

      <p className="module__text--bold">{filterTypes[type]}</p>

      {/* inputs for all filter types */}
      <div className="filter__ins">
        <Input title="in" id={id} name="main-in" />
        <Input title="freq/in" id={id} name="frequency" />
      </div>

      {/* Frequency and Reso Knob */}
      <div className="filter__settings">
        <div id="filter-type" className="button-container">
          <p className="module__text">Type</p>
          <button
            id="type"
            className="param-button"
            onClick={updateType}
          ></button>
        </div>
        <div className="filter__knobs">
          <div className="button-container">
            <p className="module__text">Freq</p>
            <Knob
              // onChange={checkDistance.bind(this, "freq", freq)}
              onChange={(e) => setAudioParam(e, freq, "frequency", id, setFreq)}
              min={0}
              max={24000}
              value={freq}
            />
          </div>
          <div className="button-container">
            <p className="module__text">Q</p>
            <Knob
              id="reso"
              onChange={(e) => setAudioParam(e, reso, "Q", id, setReso)}
              // onChange={checkDistance.bind(this, "reso", reso)}
              min={0}
              max={6.8}
              value={reso}
            />
          </div>
        </div>
      </div>

      {/* output and volume */}

      <div className="filter__out">
        <Output title="out" output={output} id={id} />
        <div className="button-container">
          <p className="module__text">Gain</p>
          <Knob
            onChange={(e) => setAudioParam(e, gain, "gain", id, setGain)}
            min={0}
            max={6.8}
            value={gain}
          />
        </div>
      </div>
    </div>
  );
};

Filter.Name = "Filter";

export default Filter;
