import React, { useContext } from "react";
import "./Explorer.css";

import MsContext from "../../context/MsContext";

const Explorer = () => {
  const installed = ["Oscillator", "Filter"];
  const context = useContext(MsContext);

  const addModule = mod => {
    context.load(mod);
  };

  return (
    <div className="explorer">
      <section className="explorer__installed">
        {/* list installed modules */}
        <h3>Installed</h3>
        {installed.map(mod => {
          return (
            <div
              onDoubleClick={() => addModule(mod)}
              className="explorer__module"
            >
              {mod}
            </div>
          );
        })}
      </section>

      <section className="explorer__uninstalled">
        {/* list uninstalled modules */}
        <h3>Explore</h3>
      </section>
    </div>
  );
};

export default Explorer;