import React, { useContext } from "react";
import "./Sidebar.css";

import MsContext from "../../context/MsContext";
import ModulesList from "../ModulesList/ModulesList";
import Search from "../Search/Search";
import CurrentPatch from "../CurrentPatch/CurrentPatch";

const Sidebar = (props) => {
  const context = useContext(MsContext);

  const { sbContent, toggleSidebar } = context;
  const { size } = props;

  const renderSbContent = (c) => {
    let content;
    switch (c) {
      case "current":
        content = <CurrentPatch />;
        break;
      case "search":
        content = <Search />;
        break;
      default:
        content = <ModulesList />;
    }
    return content;
  };

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
      <div
        className={
          size ? "sidebar-content" : "sidebar-content sidebar-content--small"
        }
      >
        {renderSbContent(sbContent)}
      </div>
    </div>
  );
};

export default Sidebar;
