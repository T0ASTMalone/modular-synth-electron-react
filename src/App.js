import React, { useContext } from "react";
import "./App.css";

// TitleBar imports
import github from "./assets/images/github.png";
import { defaultTemplate } from "./app-menu";
// components
import Rack from "./components/Rack/Rack";
import Sidebar from "./components/Sidebar/Sidebar";
import MsContext from "./context/MsContext";

const TitleBar = window.require("frameless-titlebar");

const electron = window.require("electron").remote;

const { ipcRenderer } = window.require("electron");

const menu = electron.app.newMenu;

function App() {
  const context = useContext(MsContext);

  ipcRenderer.once("toggle-sidebar", () => {
    console.log("ran toggle-sidebar");
    context.toggleSidebar();
  });

  let titleBar = React.useRef();

  console.log(context.sidebar);

  return (
    <div className="App">
      <TitleBar
        icon={github}
        app="Electron"
        menu={defaultTemplate}
        ref={titleBar}
      />
      {context.sidebar ? <Sidebar /> : <></>}

      <Rack />
    </div>
  );
}

export default App;
