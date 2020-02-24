import React, { useState, useEffect, useContext } from "react";
import "./Filter.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import uuid from "uuid";
import MsContext from "../../../context/MsContext";

const Filter = () => {
  // state
  const [freq, updateFreq] = useState(0);
  const [reso, updateReso] = useState(0);
  const [vol, updateVol] = useState(0);
  const [id, setId] = useState(null);
  const [type, setType] = useState(0);

  const context = useContext(MsContext);
  const audioCtx = context.ctx;
  const nodes = context.nodes;

  const filterTypes = [
    "lowpass",
    "highpass",
    "bandpass",
    "lowshelf",
    "highshelf",
    "peaking",
    "notch",
    "allpass"
  ];

  const checkDistance = (name, currentVal, val) => {
    let maxDistance = 20;
    let distance = Math.abs(val - currentVal);
    if (distance > maxDistance) {
      return;
    } else {
      switch (name) {
        case "freq":
          updateFreq(val);
          break;
        case "reso":
          updateReso(val);
          break;
        default:
          updateVol(val);
          break;
      }
    }
  };

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
    nodes[id].type = filterTypes[newType];
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
    // create filter
    const filter = audioCtx.createBiquadFilter();
    console.log(filter);
    // give filter unique name
    const id = uuid();
    // add to nodes object in context
    // uuid as key and filter as value
    context.addNode(id, filter);
    // set id in state
    setId(id);
  }, []);

  return (
    <div className='filter'>
      {/* inputs for all filter types */}
      <div className='filter__ins'>
        <Input title='HP' id={id} />
      </div>

      {/* Frequency and Reso Knob */}

      <div className='filter__settings'>
        <div className='button-container'>
          <label htmlFor='type'>Filter Type</label>
          <button
            id='type'
            className='filter__type'
            onClick={updateType}
          ></button>
        </div>

        <Knob
          onChange={checkDistance.bind(this, "freq", freq)}
          min={0}
          max={100}
          value={freq}
        />
        <Knob
          onChange={checkDistance.bind(this, "reso", reso)}
          min={0}
          max={100}
          value={reso}
        />
      </div>

      {/* output and volume */}

      <div className='filter__out'>
        <Output title='out' id={id} />
        <Knob
          onChange={checkDistance.bind(this, "vol", vol)}
          min={0}
          max={100}
          value={vol}
        />
      </div>
    </div>
  );
};

export default Filter;
