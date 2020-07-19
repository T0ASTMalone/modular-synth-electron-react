import React, { useContext } from "react";
import "./CurrentPatch.css";
import MsContext from "../../context/MsContext";
import PatchListItem from "../PatchListItem/PatchListItem";

const CurrentPatch = () => {
  const context = useContext(MsContext);
  const { nodes, unload } = context;

  return (
    <div className="curretn-patch">
      <h3 className="sidebar-title">Current Patch</h3>
      {/* {Object.keys(nodes).map((mod) => renderListItem(nodes[mod].type, mod))} */}
      <ul className="sidebar-list">
        {Object.keys(nodes).map((mod) => {
          const type = nodes[mod].type;
          return (
            <PatchListItem
              key={mod}
              item={type}
              id={mod}
              btnClick={unload}
              ui={type !== "main-gain" ? true : false}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default CurrentPatch;
