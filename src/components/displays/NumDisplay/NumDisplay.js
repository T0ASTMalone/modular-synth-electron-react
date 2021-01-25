import React from "react";
import PropTypes from "prop-types";

import "./NumDisplay.scss";

const NumDisplay = (props) => {
  const { value } = props;

  // const renderValue = () => {
  //   let numV =  Math.floor(value);
  //   return numV > 1000 ? `${(numV / 1000).toFixed(2)} K` : numV;
  // }
  return (
    <div className="display-container">
      <div className="display">{Math.floor(value)}</div>
    </div>
  );
};

NumDisplay.propTypes = {
  value: PropTypes.number,
};

export default NumDisplay;
