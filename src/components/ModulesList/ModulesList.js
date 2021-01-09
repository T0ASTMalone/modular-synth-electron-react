import React, { useContext, useRef } from "react";
import "./ModulesList.css";
import MsContext from "../../context/MsContext";
import PatchListItem from "../PatchListItem/PatchListItem";
import { getModulesList } from "../../utils/app-utils";

const ModulesList = () => {
  const context = useContext(MsContext);
  const installed = useRef(getModulesList());

  const addModule = (mod) => {
    context.load(mod);
  };

  return (
    <div className="explorer">
      <section className="explorer__installed">
        {/* list installed modules */}
        <h3 className="sidebar-title">Modules</h3>
        <ul className="sidebar-list">
          {installed.current.map((mod) => {
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
