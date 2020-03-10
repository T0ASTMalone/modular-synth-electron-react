import React, { useState, useEffect, useContext } from "react";
import "./Filter.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import shortId from "shortid";
import MsContext from "../../../context/MsContext";

const Filter = props => {
  // state
  const [freq, updateFreq] = useState(0);
  const [reso, updateReso] = useState(0);
  const [vol, updateVol] = useState(0);
  const [inId, setInId] = useState(null);
  const [type, setType] = useState(0);
  const [selected, select] = useState(null);

  const { removeModule, id, values } = props;

  const context = useContext(MsContext);
  const { ctx, nodes, cables, updateCables, updateMod } = context;

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
    console.log(name, currentVal, val);
    let maxDistance = 2000;
    let distance = Math.abs(val - currentVal);
    if (distance > maxDistance) {
      return;
    } else {
      switch (name) {
        case "freq":
          updateFreq(val);
          nodes[id].node.frequency.value = freq;

          break;
        case "reso":
          updateReso(val);
          nodes[id].node.Q.value = reso;

          break;
        default:
          updateVol(val);
          nodes[id].node.gain.value = val;

          break;
      }
      updateMod();
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
    // create filter
    const filter = ctx.createBiquadFilter();
    // give filter unique name
    const inId = shortId.generate();
    // add to nodes object in context
    // uuid as key and filter as value
    context.addNode(id, filter);
    // set id in state

    if (values) {
      // using values passed in as props
      // set module values
      for (let k in values) {
        filter[k].value = values[k];
        console.log(k);
        switch (k) {
          case "frequency":
            updateFreq(values[k]);
            break;
          case "Q":
            updateReso(values[k]);
            break;
          default:
            updateVol(values[k]);
            break;
        }
      }
    }

    setInId(inId);
  }, []);

  // the following will be turned into a hook for all modules to re-use
  // simply pass the output module id and it will create a connection if
  // it sees one
  useEffect(() => {
    const { node } = nodes[id];
    // when there is a change in the cables object, ask two questions

    // am I an input?

    // am I an output?
    const out = cables[id];
    console.log(out);

    // if this module is an output in a current cable
    if (out) {
      // get cables module and input on that module
      const { mod, input } = out;
      console.log(nodes[mod]);
      if (nodes[mod].node) {
        if (input === "main-in") {
          // if input is main in, connect to module
          console.log("connected to module main input");
          node.connect(nodes[mod].node);
        } else {
          // if input is not main connect to corresponding audio parameter
          console.log("connected to module audio param");
          node.connect(nodes[mod].node[input]);
        }

        // return input and true
        // set input modulation to on in state
        // for styling purposes
      } else {
        // if no cable with this module as an output is found
        // disconnect from any connections that the module may have
        if (node) {
          console.log("disconnecting");
          node.disconnect();
        }
        // return input and false
        // set input modulation to off in state
        // for styling purposes
      }
    }
  }, [updateCables]);

  const mouseIn = () => {
    select(true);
  };

  const mouseOut = () => {
    select(false);
  };

  return (
    <div
      className="module filter"
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
    >
      {/* remove module button*/}
      <div className="close-button">
        {selected ? (
          <button className="module__button" onClick={() => removeModule(id)}>
            X
          </button>
        ) : (
          <p className="module__text--bold">{filterTypes[type]}</p>
        )}
      </div>
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
              onChange={checkDistance.bind(this, "freq", freq)}
              min={0}
              max={24000}
              value={freq}
            />
          </div>
          <div className="button-container">
            <p className="module__text">Q</p>
            <Knob
              id="reso"
              onChange={checkDistance.bind(this, "reso", reso)}
              min={0}
              max={100}
              value={reso}
            />
          </div>
        </div>
      </div>

      {/* output and volume */}

      <div className="filter__out">
        <Output title="out" id={id} />
        <div className="button-container">
          <p className="module__text">Gain</p>
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
