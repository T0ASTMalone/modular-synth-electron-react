import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import github from "./assets/images/github.png";
import { defaultTemplate } from "./app-menu";
import Rack from "./components/Rack/Rack";

const TitleBar = window.require("frameless-titlebar");

// const electron = window.require("electron").remote;

// const menu = electron.Menu.getApplicationMenu();

function App() {
  return (
    <div className='App'>
      <TitleBar icon={github} app='Electron' menu={defaultTemplate} />
      <Rack />
    </div>
  );
}

export default App;
