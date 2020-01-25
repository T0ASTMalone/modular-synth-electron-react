import React from "react";
import logo from "./logo.svg";
import "./App.css";
import github from "./assets/images/github.png";

const TitleBar = window.require("frameless-titlebar");

const electron = window.require("electron").remote;

const menu = electron.Menu.getApplicationMenu();

function App() {
  return (
    <div className="App">
      <TitleBar icon={github} app="Electron" menu={menu} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
