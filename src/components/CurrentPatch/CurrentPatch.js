import React, { useContext } from "react";
import "./CurrentPatch.css";
import MsContext from "../../context/MsContext";

const CurrentPatch = () => {
  const context = useContext(MsContext);

  const { nodes, unload } = context;

  const renderListItem = (type, id) => {
    return (
      <div className="list-item" key={id}>
        <span>{type}</span>
        {type !== "main-gain" ? (
          <button onClick={() => unload(id)}>X</button>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <div className="curretn-patch">
      <h2>Current Patch</h2>
      {Object.keys(nodes).map((mod) => renderListItem(nodes[mod].type, mod))}
    </div>
  );
};

export default CurrentPatch;
