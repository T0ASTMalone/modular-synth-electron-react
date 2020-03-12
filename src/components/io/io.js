import React, { useContext } from "react";
import "./io.css";
import MsContext from "../../context/MsContext";
import { useIsModulated } from "../../utils/module-utils";

const Input = props => {
  const { title, id, name, connected } = props;
  const context = useContext(MsContext);
  const ins = useIsModulated(id);
  const color = ins[name];
  const connectionExists = () => {
    let connections = context.cables;
    for (let key in connections) {
      if (connections[key].mod === id && connections[key].input === name) {
        return true;
      }
    }
    return false;
  };

  const handleConnection = () => {
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
    border: color ? `5px solid ${color}` : "5px solid cadetblue"
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

const Output = props => {
  const { title, id, output } = props;
  const context = useContext(MsContext);

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
    } else {
      context.createOutput(id);
    }
  };

  let buttonStyle = {
    borderRadius: "50%",
    width: " 20px",
    height: "20px",
    border: output ? `5px solid ${output}` : "5px solid cadetblue"
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

export { Input, Output };
