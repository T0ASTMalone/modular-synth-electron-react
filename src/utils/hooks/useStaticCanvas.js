import React, { useLayoutEffect, useRef } from 'react'

const useStaticCanvas = (draw) => {
    const canvasRef = useRef(null);

    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      let animationFrameId;

      const render = () => {
        draw(context)
      }

      animationFrameId = window.requestAnimationFrame(render);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };

    }, [draw]);
  
    return canvasRef;
}

export default useStaticCanvas
