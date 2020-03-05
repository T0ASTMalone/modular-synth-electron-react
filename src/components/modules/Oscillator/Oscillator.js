import React, { useState, useContext, useEffect } from "react";
import "./Oscillator.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import shortId from "shortid";

const Oscillator = props => {
  const [freq, updateFreq] = useState(440);
  const [id, createId] = useState(null);
  const [selected, select] = useState(null);

  const { removeModule, index } = props;

  const context = useContext(MsContext);
  const { ctx, cables, nodes } = context;

  // update frequency using knob
  const checkDistance = val => {
    let maxDistance = 200;
    let distance = Math.abs(val - freq);
    // prevent knob from going past max value
    if (distance > maxDistance) {
      return;
    } else {
      updateFreq(val);
      nodes[id].frequency.value = freq;
    }
  };

  useEffect(() => {
    // create oscillator
    const osc = ctx.createOscillator();
    // give osc unique name
    const oscId = shortId.generate();
    // start osc
    osc.start();
    // add to nodes object in context
    // uuid as key and osc as value
    context.addNode(oscId, osc);
    // add uuid to state for use elsewhere
    createId(oscId);
  }, []);

  // if audio node exists set frequency to current knob value
  // if (id) {
  //   nodes[id].frequency.value = freq;
  // }

  const updateWav = wav => {
    nodes[id].type = wav;
  };

  // the following will be turned into a hook for all modules to re-use
  // simply pass the output module id and it will create a connection if
  // it sees one
  useEffect(() => {
    // when there is a change in the cables object, ask two questions

    // am I an input?

    // am I an output?
    const out = cables[id];

    // if this module is an output in a current cable
    if (out) {
      // get cables module and input on that module
      const { mod, input } = out;

      if (input === "main-in") {
        // if input is main in, connect to module
        console.log(nodes[mod]);
        nodes[id].connect(nodes[mod]);
      } else {
        // if input is not main connect to corresponding audio parameter
        console.log(nodes[mod][input]);
        nodes[id].connect(nodes[mod][input]);
      }

      // return input and true
      // set input modulation to on in state
      // for styling purposes
    } else {
      // if no cable with this module as an output is found
      // disconnect from any connections that the module may have
      if (nodes[id]) {
        console.log("disconnecting");
        nodes[id].disconnect();
      }
      // return input and false
      // set input modulation to off in state
      // for styling purposes
    }
  }, [Object.keys(cables).length]);

  const mouseIn = () => {
    select(true);
  };

  const mouseOut = () => {
    select(false);
  };

  console.log(id, index);

  return (
    <div className='module osc' onMouseEnter={mouseIn} onMouseLeave={mouseOut}>
      {/* remove module button*/}
      <div className='close-button'>
        {selected ? (
          <button
            className='module__button'
            onClick={() => removeModule(id, index)}
          >
            X
          </button>
        ) : (
          <p className='module__text--bold'>Oscillator</p>
        )}
      </div>
      {/* {selected ? <button className='module__button'>X</button> : <></>} */}
      {/* outputs */}
      <div className='osc__outputs'>
        <Output title='out' id={id} />
      </div>
      <div className='osc__types'>
        <div className='button-container'>
          <p className='module__text'>Sin</p>
          <button
            className='param-button'
            onClick={() => updateWav("sine")}
          ></button>
        </div>
        <div className='button-container'>
          <p className='module__text'>Saw</p>
          <button
            className='param-button'
            onClick={() => updateWav("sawtooth")}
          ></button>
        </div>
        <div className='button-container'>
          <p className='module__text'>Sqr</p>
          <button
            className='param-button'
            onClick={() => updateWav("square")}
          ></button>
        </div>
        <div className='button-container'>
          <p className='module__text'>Sub</p>
          <button className='param-button'></button>
        </div>
      </div>

      {/* frequency knob */}
      <div className='knob'>
        <p className='module__text'>Freq</p>
        <Knob
          onChange={checkDistance.bind(this)}
          min={0}
          max={2000}
          value={freq}
        />
      </div>

      {/* V/oct input */}
      <div className='osc__inputs'>
        <Input title='V/oct' id={id} name='frequency' />
      </div>
    </div>
  );
};

export default Oscillator;
