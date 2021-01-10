import React from "react";
import PropTypes from "prop-types";

import "./NumDisplay.scss";

const NumDisplay = (props) => {
  const { value } = props;
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
