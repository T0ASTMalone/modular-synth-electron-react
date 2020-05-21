import React, { useContext } from "react";
import "./ModulesList.css";
import MsContext from "../../context/MsContext";

const ModulesList = () => {
  const installed = ["Oscillator", "Filter", "Lfo", "Gain", "Reverb"];
  const context = useContext(MsContext);

  const addModule = (mod) => {
    context.load(mod);
  };

  return (
    <div className="explorer">
      <section className="explorer__installed">
        {/* list installed modules */}
        <h3 className="explorer__title">Modules</h3>
        <ul className="explorer__modules">
          {installed.map((mod, i) => {
            return (
              <li
                key={i}
                onDoubleClick={() => addModule(mod)}
                className="explorer__module"
              >
                {mod}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default ModulesList;
