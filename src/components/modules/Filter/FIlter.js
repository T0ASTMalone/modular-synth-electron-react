import React, { useState, useEffect, useContext } from "react";
import "./Filter.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
// import uuid from "uuid";
import shortId from "shortid";
import MsContext from "../../../context/MsContext";

const Filter = () => {
  // state
  const [freq, updateFreq] = useState(0);
  const [reso, updateReso] = useState(0);
  const [vol, updateVol] = useState(0);
  const [id, setId] = useState(null);
  const [inId, setInId] = useState(null);
  const [type, setType] = useState(0);

  const context = useContext(MsContext);
  const { ctx, nodes, cables } = context;

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
    let maxDistance = 2000;
    let distance = Math.abs(val - currentVal);
    if (distance > maxDistance) {
      return;
    } else {
      switch (name) {
        case "freq":
          updateFreq(val);
          nodes[id].frequency.value = freq;
          break;
        case "reso":
          updateReso(val);
          nodes[id].Q.value = reso;
          break;
        default:
          updateVol(val);
          nodes[id].gain.value = val;
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
    const filter = ctx.createBiquadFilter();
    // give filter unique name
    const id = shortId.generate();
    const inId = shortId.generate();
    // add to nodes object in context
    // uuid as key and filter as value
    context.addNode(id, filter);
    // set id in state
    setId(id);
    setInId(inId);
  }, []);

  // the following will be turned into a hook for all modules to re-use
  // simply pass the output module id and it will create a connection if
  // it sees one
  useEffect(() => {
    let input;
    // if this module is an output in a current cable
    const out = cables[id];

    if (out) {
      input = out.input;
      if (input === "main-in") {
        // if input is main in, connect to modules input
        nodes[id].connect(nodes[out.mod]);
      } else {
        // if input is not main connect to corresponding audio parameter
        nodes[id].connect(nodes[out.mod][out.input]);
      }
    } else {
      // if no cable with this module as an output is found
      // disconnect from any connections that the module may have
      if (nodes[id]) {
        console.log("disconnecting");
        nodes[id].disconnect();
      }
    }
  }, [Object.keys(cables).length]);

  return (
    <div className='module filter'>
      <p className='module__text'>{filterTypes[type]}</p>
      {/* inputs for all filter types */}
      <div className='filter__ins'>
        <Input title='in' id={id} name='main-in' />
        <Input title='freq/in' id={id} name='frequency' />
      </div>

      {/* Frequency and Reso Knob */}
      <div className='filter__settings'>
        <div id='filter-type' className='button-container'>
          <p className='module__text'>Type</p>
          <button
            id='type'
            className='param-button'
            onClick={updateType}
          ></button>
        </div>
        <div className='filter__knobs'>
          <div className='button-container'>
            <p className='module__text'>Freq</p>
            <Knob
              onChange={checkDistance.bind(this, "freq", freq)}
              min={0}
              max={24000}
              value={freq}
            />
          </div>
          <div className='button-container'>
            <p className='module__text'>Q</p>
            <Knob
              id='reso'
              onChange={checkDistance.bind(this, "reso", reso)}
              min={0}
              max={100}
              value={reso}
            />
          </div>
        </div>
      </div>

      {/* output and volume */}

      <div className='filter__out'>
        <Output title='out' id={id} />
        <div className='button-container'>
          <p className='module__text'>Gain</p>
          <Knob
            onChange={checkDistance.bind(this, "vol", vol)}
            min={0}
            max={100}
            value={vol}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
