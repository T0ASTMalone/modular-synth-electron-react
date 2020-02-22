import React, { useState, useEffect } from "react";
import "./Filter.css";
import { Knob } from "react-rotary-knob";
import { Input, Output } from "../../io/io";
import uuid from "uuid";

const Filter = () => {
  const [freq, updateFreq] = useState(0);
  const [reso, updateReso] = useState(0);
  const [vol, updateVol] = useState(0);
  const [id, setId] = useState(null);

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

  useEffect(() => {
    const id = uuid();
    setId(id);
  }, []);

  return (
    <div className='filter'>
      {/* inputs for all filter types */}
      <div className='filter__ins'>
        <Input title='HP' id={id} />
        <Input title='BP' id={id} />
        <Input title='LP' id={id} />
      </div>

      {/* Frequency and Reso Knob */}

      <div className='filter__settings'>
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
