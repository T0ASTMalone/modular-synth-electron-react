import React, { useContext, useEffect, useState } from "react";
import "./App.css";

// TitleBar imports
import github from "./assets/images/github.png";
import { defaultTemplate } from "./app-menu";
// components
import Rack from "./components/Rack/Rack";
import Sidebar from "./components/Sidebar/Sidebar";
import MsContext from "./context/MsContext";

const TitleBar = window.require("frameless-titlebar");

// const electron = window.require("electron").remote;

const { ipcRenderer } = window.require("electron");

//const menu = electron.app.newMenu;

function App() {
  const context = useContext(MsContext);

  const { sidebar, sbContent } = context;

  const toggleSidebar = (e, data) => {
    console.log("ran");
    // get label of clicked menu item
    const label = data.label;
    console.log(label);
    // if sidebar is open and it's content is the
    // same as the selected menu item
    if (sidebar && sbContent === label) {
      // close sidebar
      context.toggleSidebar();
    }
    // if sidebar is open and it's content
    // is not the same as the menu item
    else if (sidebar) {
      // update the sidebar content
      context.setSbContent(label);
    } else if (sidebar === false) {
      console.log("ran opening sidebar");
      // set sidebar content
      context.setSbContent(label);
      // render sidebar
      context.toggleSidebar();
    }
  };

  useEffect(() => {
    // remove all listeners for toggle sidebar
    ipcRenderer.removeAllListeners("toggle-sidebar");
    // create new listener for toggle sidebar
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [sidebar, sbContent]);

  return (
    <div className="App">
      <TitleBar icon={github} app="Electron" menu={defaultTemplate} />

      {sidebar ? <Sidebar /> : <></>}

      <Rack />
    </div>
  );
}

export default App;
