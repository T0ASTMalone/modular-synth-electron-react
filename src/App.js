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

const menu = electron.app.newMenu;

function App() {
  const context = useContext(MsContext);

  ipcRenderer.on("toggle-sidebar", () => {
    // set sidebare in context
    console.log("ran toggle-sidebar");
  });

  let titleBar = React.useRef();

  return (
    <div className="App">
      <TitleBar icon={github} app="Electron" menu={menu} ref={titleBar} />
      {titleBar.current ? (
        console.log(titleBar.current.Menu.getKeyById("4", "visible"))
      ) : (
        <></>
      )}
      <Sidebar />
      <Rack />
    </div>
  );
}

export default App;
