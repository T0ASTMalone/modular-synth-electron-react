import React, { useContext } from "react";
import "./io.css";
import MsContext from "../../context/MsContext";

const Input = props => {
  const { title, id, inputId } = props;
  const context = useContext(MsContext);

  const connectionExists = () => {
    let connections = context.cables;
    console.log(connections);
    for (let key in connections) {
      if (connections[key].mod === id) {
        return true;
      }
    }
    return false;
  };

  const handleConnection = () => {
    if (connectionExists()) {
      console.log("removing input");
      context.removeInput(id, inputId);
    } else {
      console.log("creating input");
      context.createInput(id, inputId);
    }
  };

  return (
    <div className='in'>
      <p className='in__text'>{title}</p>
      <button className='io in__button' onClick={handleConnection}></button>
    </div>
  );
};

const Output = props => {
  const { title, id } = props;
  const context = useContext(MsContext);

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
      console.log("removing output");
      context.removeOutput(id);
    } else {
      console.log("creating output");
      context.createOutput(id);
    }
  };

  return (
    <div className='out'>
      <p className='out__text'>{title}</p>
      <button className='io out__button' onClick={handleConnection}></button>
    </div>
  );
};

export { Input, Output };
