import React from "react";
import "./Explorer.css";

const Explorer = () => {
  const installed = ["Oscillator", "Filter"];

  return (
    <div className="explorer">
      <section className="explorer__installed">
        <h3>Installed</h3>
        {installed.map(mod => {
          return <button className="">{mod}</button>;
        })}
      </section>

      <section className="explorer__uninstalled">
        <h3>Explore</h3>
      </section>
    </div>
  );
};

export default Explorer;
