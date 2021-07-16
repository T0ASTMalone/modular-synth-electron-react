import React, { useContext } from "react";
import "./io.css";
import MsContext from "../../context/MsContext";
import { useIsModulated } from "../../utils/module-utils";
import { useLogger } from "../../utils/hooks/logger";
import { Knob } from "react-rotary-knob";

const Input = (props) => {
  const { title, id, name, number = -1 } = props;
  const context = useContext(MsContext);
  const ins = useIsModulated(id, number);
  const color = ins[name];
  const logger = useLogger("Input");

  const connectionExists = () => {
    let connections = context.cables;
    for (let key in connections) {
      if (connections[key].mod === id && connections[key].input === name) {
        logger.info(`${name} is connected to ${connections[key].mod} `);
        return true;
      }
    }
    return false;
  };

  const mainConnectionExists = () => {
    let connections = context.cables;

    let onlyMainCables = [];

    for (let key in connections) {
      if (connections[key].mod === id) {
        onlyMainCables.push(connections[key]);
        logger.info(`${name} is connected to ${connections[key].mod} `);
      }
    }

    if (onlyMainCables[number]) return true;

    return false;
  };

  const handleConnection = () => {
    const { nodes } = context;
    const node = nodes[id];

    if (node.type === "main-gain" && name === "main-in") {
      return !mainConnectionExists()
        ? context.createMainInput(id, name)
        : context.removeMainInput(number, id);
    }

    if (connectionExists()) {
      context.removeInput(id, name);
    } else {
      context.createInput(id, name);
    }
  };

  let buttonStyle = {
    borderRadius: "50%",
    width: " 20px",
    height: "20px",
    border: color ? `5px solid ${color}` : "5px solid #5a5959",
  };

  return (
    <div className="in">
      <p className="in__text">{title}</p>
      <button
        className={ins[name] ? "in__button connected" : "in__button"}
        style={buttonStyle}
        onClick={handleConnection}
      ></button>
    </div>
  );
};

const Output = (props) => {
  const { title, id, output } = props;
  const context = useContext(MsContext);
  const logger = useLogger("Output");

  const connectionExists = () => {
    let connections = context.cables;

    for (let key in connections) {
      if (key === id) {
        return true;
      }
    }
    return false;
  };

  const handleConnection = () => {
    if (connectionExists()) {
      context.removeOutput(id);
      logger.info(`disconnecting output ${output}`);
    } else {
      logger.info(`connecting output ${output}`);
      context.createOutput(id);
    }
  };

  let buttonStyle = {
    borderRadius: "50%",
    width: " 20px",
    height: "20px",
    border: output ? `5px solid ${output}` : "5px solid #5a5959",
  };

  return (
    <div className="out">
      <p className="out__text">{title}</p>
      <button
        className={output ? "out__button connected" : "out__button"}
        style={buttonStyle}
        onClick={handleConnection}
      ></button>
    </div>
  );
};

const Nob = (props) => {
  const { title, ...rest } = props;
  return (
    <div className="knob">
      <p className="module__text">{title}</p>
      <Knob {...rest} />
    </div>
  );
};

export { Input, Output, Nob };
