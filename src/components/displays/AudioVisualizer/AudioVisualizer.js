import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";

const AudioVisualizer = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      let frameCount = 0
      let animationFrameId
      
      //Our draw came here
      const render = () => {
        frameCount++
        draw(context, frameCount)
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
  }, [canvasRef, draw])
  return <div>
      <canvas width="135" height="300" ref={canvasRef}></canvas>
  </div>;
};

AudioVisualizer.propTypes = {};

export default AudioVisualizer;
