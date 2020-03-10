import React, { useContext, useEffect } from "react";
import "./App.css";
import { saveFile } from "./utils/app-utils";
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

  // const saveFile = (e) => {
  //   // get settings for each node
  //   const settings = Object.keys(nodes).map(node => {
  //     // get audio module
  //     const mod = nodes[node];
  //     // get audio node from module
  //     const audioNode = mod.node;
  //     // create object that will contain the values of any
  //     // audioParams in the audio node
  //     const audioValues = {};
  //     // if there is a frequency audioParam add to audioValues
  //     if (audioNode.frequency) {
  //       audioValues.frequency = audioNode.frequency.value;
  //     }
  //     // if there is a gain audioParam add to audioValues
  //     if (audioNode.gain) {
  //       audioValues.gain = audioNode.gain.value;
  //     }
  //     // create settings object for each module
  //     const nodeSettings = {
  //       // id
  //       id: node,
  //       // type
  //       type: mod.type,
  //       // audioValues
  //       ...audioValues
  //     };
  //     return nodeSettings;
  //   });

  //   // create connections array to write to file
  //   const connections = Object.keys(cables).map(key => {
  //     //create connection object
  //     const connection = {
  //       out: key,
  //       input: {
  //         mod: cables[key].mod,
  //         input: cables[key].input
  //       }
  //     };
  //     return connection;
  //   });

  //   // stringify to write to file
  //   const saveFile = JSON.stringify({ settings, connections });
  //   // create test file
  //   fs.writeFileSync("test-file.json", saveFile);
  // };

  useEffect(() => {
    // remove all listeners for toggle sidebar
    ipcRenderer.removeAllListeners("toggle-sidebar");
    // create new listener for toggle sidebar
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [sidebar, sbContent]);

  useEffect(() => {
    ipcRenderer.on("save-file", () => saveFile(nodes, cables));
  }, []);

  return (
    <div className="App">
      <TitleBar icon={github} app="Electron" menu={defaultTemplate} />
      <main className="app-main">
        {sidebar ? <Sidebar /> : <></>}
        <Rack />
      </main>
    </div>
  );
}

export default App;
