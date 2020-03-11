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
const { ipcRenderer, remote } = window.require("electron");
const { dialog } = remote;

function App() {
  const context = useContext(MsContext);
  const [modSettings, setModSettings] = useState(null);

  const { sidebar, sbContent, getCurrentState } = context;

  const toggleSidebar = (e, data) => {
    // add function that grabs sidebar and sbContent from context and use
    // those for this function as follows, to remove the need to update the event
    // emitter everytime the sidebar gets updated
    // const {sidebar, sbContent} = context.getSbState();

    // get label of clicked menu item
    const label = data.label;
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
      // set sidebar content
      context.setSbContent(label);
      // render sidebar
      context.toggleSidebar();
    }
  };

  /* 

  update this event emitter like the save file event emitter 
  and move to that useEffect
  
  */
  useEffect(() => {
    // remove all listeners for toggle sidebar
    ipcRenderer.removeAllListeners("toggle-sidebar");
    // create new listener for toggle sidebar
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [sidebar, sbContent]);

  useEffect(() => {
    // event emitter for saving file
    ipcRenderer.on("save-file", () => {
      const { nodes, cables } = getCurrentState();
      saveFile(nodes, cables);
    });
    ipcRenderer.on("open-file", async () => {
      // open file explorer to have user select a file
      try {
        const file = await openFile();
        if (!file) {
          return;
        }
        const { loadedModules, moduleSettings, cables } = file;

        if (!loadedModules || !moduleSettings || !cables) {
          throw "sorry something went wrong while reading file content";
        }
        await context.loadPatchCables(cables);
        setModSettings(moduleSettings);
        await context.loadPatch(loadedModules, cables);
      } catch (err) {
        dialog.showErrorBox("Error loading patch", err);
        return;
      }
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
