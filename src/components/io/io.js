import React, { useContext } from "react";
import "./io.css";
import MsContext from "../../context/MsContext";

const Input = props => {
  const { title, id } = props;
  const context = useContext(MsContext);

  return (
    <div className='in'>
      <p className='in__text'>{title}</p>
      <button
        className='io in__button'
        onClick={() => context.createInput(id)}
      ></button>
    </div>
  );
};

const Output = props => {
  const { title, id } = props;
  const context = useContext(MsContext);

  return (
    <div className='out'>
      <p className='out__text'>{title}</p>
      <button
        className='io out__button'
        onClick={() => context.createOutput(id)}
      ></button>
    </div>
  );
};

export { Input, Output };
