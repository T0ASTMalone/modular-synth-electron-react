import React, { useContext } from "react";
import "./io.css";
import MsContext from "../../context/MsContext";

const Input = props => {
  const { title, id } = props;
  const context = useContext(MsContext);

  return (
    <div className='in'>
      <button
        className='in__button'
        onClick={() => context.createInput(id)}
      ></button>
      <p className='in__text'>{title}</p>
    </div>
  );
};

const Output = props => {
  const { title, id } = props;
  const context = useContext(MsContext);

  return (
    <div className='out'>
      <button
        className='out__button'
        onClick={() => context.createOutput(id)}
      ></button>
      <p className='out__text'>{title}</p>
    </div>
  );
};

export { Input, Output };
