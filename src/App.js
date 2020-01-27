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

const electron = window.require("electron").remote;

const menu = electron.app.newMenu;

console.log(menu);

function App() {
  const context = useContext(MsContext);

  //console.log(window);
  const [show, toggleShow] = useState();

  let titleBar = React.useRef();

  useEffect(() => {
    if (titleBar.current) {
      const sBarState = titleBar.current.Menu.getKeyById("4", "show");

      context.toggleSidebar(sBarState);
    }
  }, [titleBar]);

  console.log(context.sidebar);

  return (
    <div className='App'>
      <TitleBar icon={github} app='Electron' menu={menu} ref={titleBar} />
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
