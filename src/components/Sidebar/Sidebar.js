import React, { useContext } from "react";
import "./Sidebar.css";

import MsContext from "../../context/MsContext";
import ModulesList from "../ModulesList/ModulesList";
import Search from "../Search/Search";
import CurrentPatch from "../CurrentPatch/CurrentPatch";
import Recordings from "../Recordings/Recordings";
import Toggle from "../../assets/svg/toggle-light.svg";

const Sidebar = (props) => {
  const context = useContext(MsContext);
  const { sbContent, toggleSidebar } = context;
  const { size } = props;

  // make current patch and modules list the same component with different data passed to it.
  const renderSbContent = (c) => {
    let content;
    switch (c) {
      case "recordings":
        content = <Recordings />;
        break;
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
    <div className={size ? "sidebar sidebar-open" : "sidebar"}>
      <div
        className={
          size ? "sidebar-toggle sidebar-toggle--open " : "sidebar-toggle"
        }
      >
        <button
          onClick={toggleSidebar}
          style={{
            width: "25px",
            height: "25px",
            padding: "0px",
            border: "none",
            borderRadius: "50%",
            backgroundColor: "transparent",
          }}
          className={!size ? "hidden" : "button--closed"}
        >
          <img style={{ width: "100%" }} src={Toggle} alt='toggle' />
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
