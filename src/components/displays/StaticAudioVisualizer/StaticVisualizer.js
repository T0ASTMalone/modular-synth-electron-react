import React, { useCallback, useContext } from "react";
import MsContext from "../../../context/MsContext";
import StaticCanvas from "../Canvas/StaticCanvas";

const StaticVisualizer = (props) => {
  const { id, dependancies, ...rest } = props;
  const context = useContext(MsContext);
  const { nodes } = context;

  const getFreq = (node) => {
    let freq = 0;  
    const keys = Object.keys(node);
    for(let k of keys){
        if(!node[k].frequency){
            continue;
        } else {
            freq = node[k].frequency.value;
            break;
        }
    }
    freq = !freq ? 1 : Math.floor(freq);

    if(freq > 12000) {
        freq = Math.floor(freq / 600)
    } else if (freq > 6000){
        freq =  Math.floor(freq / 300)
    } else if(freq > 125){
        freq =  Math.floor(freq / 125)
    }
    return freq;
  }

  function draw(ctx) {
    const freq = getFreq(nodes[id]);
    var bufferLength = nodes[id].analyser.frequencyBinCount;
    bufferLength = bufferLength / (freq);
    var dataArray = new Uint8Array(bufferLength);
    nodes[id].analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "rgba(40, 44, 52, 1)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(224, 194, 252)";
    ctx.beginPath();

    var sliceWidth = (ctx.canvas.width * 1.0) / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * ctx.canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
    ctx.stroke();
  }

  const callDraw = useCallback(draw, [...dependancies]);

  return (
    <div>
      <StaticCanvas draw={callDraw} {...rest} />
    </div>
  );
};

export default StaticVisualizer;
