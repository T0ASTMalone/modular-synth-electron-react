import React from "react";
import './io.css'

const Input = props => {
  const { title } = props;
  return (
    <div className="in">
      <button className="in__button"></button>
      <p className="in__text">{title}</p>
    </div>
  );
};

const Output = props => {
  const { title } = props;
  return (
    <div className="out">
      <button className="out__button"></button>
      <p className="out__text">{title}</p>
    </div>
  );
};


export {Input, Output}