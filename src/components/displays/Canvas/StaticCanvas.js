import React from 'react'
import useStaticCanvas from "../../../utils/hooks/useStaticCanvas";

const StaticCanvas = (props) => {
    const {draw, ...rest} = props;
    const canvasRef = useStaticCanvas(draw);
    return (
        <canvas ref={canvasRef} {...rest}></canvas>       
    )
}

export default StaticCanvas
