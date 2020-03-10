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

const fs = window.require("fs");

function App() {
  const context = useContext(MsContext);

  const { sidebar, sbContent, nodes, cables } = context;

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

  const saveFile = e => {
    const settings = Object.keys(nodes).map(node => {
      const x = nodes[node];
      const audioNode = x.node;
      const audioValues = {};

      const nodeSettings = {
        type: x.type
      };
      return nodeSettings;
    });

    console.log(settings);
    const saveFile = JSON.stringify({ settings });

    console.log(saveFile);

    fs.writeFileSync("test-file.txt", saveFile);
  };

  useEffect(() => {
    // remove all listeners for toggle sidebar
    ipcRenderer.removeAllListeners("toggle-sidebar");
    // create new listener for toggle sidebar
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [sidebar, sbContent]);

  useEffect(() => {
    ipcRenderer.on("save-file", e => saveFile(e));
  }, []);

  return (
    <div className='App'>
      <TitleBar icon={github} app='Electron' menu={defaultTemplate} />
      <main className='app-main'>
        {sidebar ? <Sidebar /> : <></>}
        <Rack />
      </main>
    </div>
  );
}

export default App;
