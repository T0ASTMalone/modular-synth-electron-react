import React, { useContext } from "react";
import "./Sidebar.css";

import MsContext from "../../context/MsContext";

const Sidebar = () => {
  const context = useContext(MsContext);

  const content = context.sbContent;

  return (
    <div className="sidebar">
      <p className="test-content">{content}</p>
    </div>
  );
};

export default Sidebar;
