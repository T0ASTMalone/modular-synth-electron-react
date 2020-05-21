import React from "react";
import "./Recordings.css";

const Recordings = () => {
  let recordings = ["wubwubs.wav", "helloWorld.wav", "patchy.wav"];
  let tmpRec = ["tmp_rec.wav", "tmp_rec1.wav"];

  return (
    <div className="recordings">
      <div className="recordings-saved">Hello</div>

      <div className="recordings-tmp"></div>
    </div>
  );
};

export default Recordings;
