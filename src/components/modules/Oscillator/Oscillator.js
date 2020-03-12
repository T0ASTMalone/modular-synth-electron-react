import React, { useState, useContext, useEffect } from "react";
import "./Oscillator.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import {
  useCreateConnection,
  useCheckDistance,
  useIsModulated
} from "../../../utils/module-utils";

const Oscillator = props => {
  const [freq, setFreq] = useState(440);
  const [selected, select] = useState(null);

  const { removeModule, id, values } = props;

  const context = useContext(MsContext);
  const setAudioParam = useCheckDistance();
  const { ctx, nodes } = context;

  const { node } = nodes[id];
  const outputting = useCreateConnection(id);

  useEffect(() => {
    // create oscillator
    const osc = ctx.createOscillator();
    // using values passed in as props
    // set osc values
    if (values) {
      for (let k in values) {
        if (typeof osc[k] === "object" && "value" in osc[k]) {
          osc[k].value = values[k];
          setFreq(values[k]);
        } else {
          osc[k] = values[k];
        }
      }
    }
    // start osc
    osc.start();
    // add to nodes object in context
    // uuid as key and osc as value
    context.addNode(id, osc);
  }, []);

  const updateWav = wav => {
    node.type = wav;
  };

  const mouseIn = () => {
    select(true);
  };

  const mouseOut = () => {
    select(false);
  };

  return (
    <div className='module osc' onMouseEnter={mouseIn} onMouseLeave={mouseOut}>
      {/* remove module button*/}
      <div className='close-button'>
        {selected ? (
          <button className='module__button' onClick={() => removeModule(id)}>
            X
          </button>
        ) : (
          <p className='module__text--bold'>Oscillator</p>
        )}
      </div>
      {/* {selected ? <button className='module__button'>X</button> : <></>} */}
      {/* outputs */}
      <div className='osc__outputs'>
        <Output title='out' output={outputting} id={id} />
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
          onChange={e => setAudioParam(e, freq, "frequency", id, setFreq)}
          min={0}
          max={24000}
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
