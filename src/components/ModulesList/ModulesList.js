import React, { useContext } from "react";
import "./ModulesList.css";
import MsContext from "../../context/MsContext";
import PatchListItem from "../PatchListItem/PatchListItem";

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
        <ul className="sidebar-list">
          {installed.map((mod, i) => {
            return (
              <PatchListItem
                key={mod}
                ui={false}
                dbClick={addModule}
                item={mod}
              />
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default ModulesList;
