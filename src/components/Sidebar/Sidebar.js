import React, { useContext } from "react";
import "./Sidebar.css";

import MsContext from "../../context/MsContext";
import Explorer from "../Explorer/Explorer";

const Sidebar = props => {
  const context = useContext(MsContext);

  const { sbContent, toggleSidebar } = context;
  const { size } = props;
  return (
    <div className={size ? "sidebar" : "sidebar sidebar--small"}>
      <div
        className={
          size
            ? "sidebar-toggle sidebar-toggle--open"
            : "sidebar-toggle sidebar-toggle--closed"
        }
      >
        <button
          onClick={toggleSidebar}
          className={size ? "sidebar-button" : "sidebar-button button--closed"}
        >
          &lt;
        </button>
      </div>
      {/* <p className="test-content">{content}</p> */}
      <div
        className={
          size ? "sidebar-content" : "sidebar-content sidebar-content--small"
        }
      >
        <Explorer />
      </div>
    </div>
  );
};

export default Sidebar;
