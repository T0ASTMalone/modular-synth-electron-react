import React, { useContext, useEffect } from "react";
import "./App.css";

// components
import Rack from "./components/Rack/Rack";
import Sidebar from "./components/Sidebar/Sidebar";
import MsContext from "./context/MsContext";

// TitleBar
import github from "./assets/images/github.png";
import { defaultTemplate } from "./app-menu";
const TitleBar = window.require("frameless-titlebar");
const { ipcRenderer } = window.require("electron");

function App() {
  const context = useContext(MsContext);

  const { sidebar, sbView } = context;

  const toggleSidebar = (e, data) => {
    const label = data.label;
    if (sidebar && sbView === label) {
      context.toggleSidebar();
    } else if (sidebar) {
      context.setSbView(label);
    } else if (sidebar === false) {
      context.setSbView(label);
      context.toggleSidebar();
    }
  };

  useEffect(() => {
    ipcRenderer.removeAllListeners("toggle-sidebar");
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [sidebar, sbView]);

  return (
    <div className="App">
      <TitleBar icon={github} app="Electron" menu={defaultTemplate} />
      {sidebar ? <Sidebar /> : <></>}
      <Rack />
    </div>
  );
}

export default App;
