import React, { useContext } from "react";
import "./io.css";
import MsContext from "../../context/MsContext";

const Input = props => {
  const { title, id, name } = props;
  const context = useContext(MsContext);

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

  return (
    <div className="in">
      <p className="in__text">{title}</p>
      <button className="io in__button" onClick={handleConnection}></button>
    </div>
  );
};

const Output = props => {
  const { title, id } = props;
  const context = useContext(MsContext);
  console.log(
    "cables: ",
    context.cables,
    "nodes: ",
    context.nodes,
    "input: ",
    context.input,
    "output: ",
    context.output
  );

  const connectionExists = () => {
    let connections = context.cables;
    console.log(connections);
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

  return (
    <div className="out">
      <p className="out__text">{title}</p>
      <button className="io out__button" onClick={handleConnection}></button>
    </div>
  );
};

export { Input, Output };
