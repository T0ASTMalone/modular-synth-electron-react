import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import "./Filter.css";
import { Input, Nob, Output } from "../../io/io";
import MsContext from "../../../context/MsContext";
import {
  useCreateConnection,
  useCheckDistance,
} from "../../../utils/module-utils";
import { useLogger } from "../../../utils/hooks/logger";

const Filter = (props) => {
  const { id, values } = props;
  const [freq, setFreq] = useState(0);
  const [reso, setReso] = useState(3.4);
  const [gain, setGain] = useState(3.4);
  // const [inId, setInId] = useState(null);
  const [type, setType] = useState(0);
  const context = useContext(MsContext);
  const output = useCreateConnection(id);
  const setAudioParam = useCheckDistance();
  const refCtx = useRef(context);
  const logger = useLogger("Filter");
  const refLogger = useRef(logger);
  const { nodes } = context;
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

  const updateCallback = useCallback(updateType, []);

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

  // set up filter
  useEffect(() => {
    const updateType = updateCallback;
    const logger = refLogger.current;
    logger.info("initializing filter");
    const context = refCtx.current;
    const { audioCtx } = context;
    // create filter
    const filter = audioCtx.createBiquadFilter();
    // add to nodes object in context
    // uuid as key and filter as value
    context.addNode(id, filter);
    // set id in state

    if (values) {
      logger.info("implementing patch settings");
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
  }, [refCtx, values, id, refLogger, updateCallback]);

  return (
    <div className="module filter">
      <p className="module__text--bold">{filterTypes[type]}</p>
      <div className="filter__ins">
        <Input title="in" id={id} name="main-in" />
        <Input title="freq/in" id={id} name="frequency" />
      </div>
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
          <Nob
            title="freq"
            onChange={(e) => setAudioParam(e, freq, "frequency", id, setFreq)}
            min={0}
            max={24000}
            value={freq}
          />
          <Nob
            title="reso"
            id="reso"
            onChange={(e) => setAudioParam(e, reso, "Q", id, setReso)}
            min={0}
            max={6.8}
            value={reso}
          />
        </div>
      </div>
      {/* output and volume */}
      <div className="filter__out">
        <Output title="out" output={output} id={id} />
        <Nob
          title="gain"
          onChange={(e) => setAudioParam(e, gain, "gain", id, setGain)}
          min={0}
          max={6.8}
          value={gain}
        />
      </div>
    </div>
  );
};

Filter.Name = "Filter";

export default Filter;
