import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { saveFile, openFile } from "./utils/app-utils";
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
  const [modSettings, setModSettings] = useState(null);

  const { sidebar, sbContent, nodes, cables, update } = context;

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

  useEffect(() => {
    ipcRenderer.removeAllListeners("save-file");
    ipcRenderer.on("save-file", () => saveFile(nodes, cables));
  }, [update]);

  useEffect(() => {
    ipcRenderer.on("open-file", async () => {
      // open file explorer to have user select a file
      const file = await openFile();
      console.log(file);
      const { loadedModules, moduleSettings, cables } = file;
      await context.loadPatchCables(cables);
      setModSettings(moduleSettings);
      await context.loadPatch(loadedModules, cables);
    });
  }, []);

  return (
    <div className="App">
      <TitleBar icon={github} app="Electron" menu={defaultTemplate} />
      <main className="app-main">
        {sidebar ? <Sidebar /> : <></>}
        <Rack modSettings={modSettings ? modSettings : null} />
      </main>
    </div>
  );
}

export default App;
