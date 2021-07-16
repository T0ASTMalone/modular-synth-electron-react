import React, { useContext } from "react";
import './AudioVisualizer.scss'
import Canvas from "../Canvas/Canvas";
import MsContext from "../../../context/MsContext";

const AudioVisualizer = (props) => {
  const {id, ...rest} = props;
  const context = useContext(MsContext);
  const {nodes} = context;

  function cdraw(ctx){
    var bufferLength = nodes[id].analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    // let drawVisual = requestAnimationFrame(cdraw);
    nodes[id].analyser.getByteTimeDomainData(dataArray);
    // console.log(bufferLength);
    ctx.fillStyle = 'rgba(40, 44, 52, 1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(224, 194, 252)';
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

  return (
      <div className="auido-visualizer">
          <Canvas draw={cdraw} {...rest}/>
      </div>

  );
};


export default AudioVisualizer;
