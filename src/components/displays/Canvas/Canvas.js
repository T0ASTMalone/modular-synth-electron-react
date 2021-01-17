import React from "react";
import PropTypes from "prop-types";
import useCanvas from "../../../utils/hooks/canvas-hook";

const Canvas = (props) => {
  const {draw, ...rest} = props;
  const canvasRef = useCanvas(draw);
  return <canvas ref={canvasRef} {...rest}></canvas>
};

Canvas.propTypes = {
  draw: PropTypes.func
};

export default Canvas;
