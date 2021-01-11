import React, { useContext, useEffect, useRef, useState } from "react";
import './AudioVisualizer.scss'
import Canvas from "../Canvas/Canvas";
import MsContext from "../../../context/MsContext";

const AudioVisualizer = (props) => {
  const {id, ...rest} = props;
  const context = useContext(MsContext);
  const {nodes} = context;

  // const ctxRef = useRef(context)

  function cdraw(ctx){
    var bufferLength = nodes[id].analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    // let drawVisual = requestAnimationFrame(cdraw);
    nodes[id].analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.beginPath();

    var sliceWidth = ctx.canvas.width * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * ctx.canvas.height/2;

      if(i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(ctx.canvas.width, ctx.canvas.height/2);
    ctx.stroke();
  }
  
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000fff'
    ctx.beginPath()
    ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  return (
    <div className="auido-visualizer">
        <Canvas draw={cdraw} {...rest}/>
    </div>
  );
};


export default AudioVisualizer;
