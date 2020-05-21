import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import "./App.css";
import { saveFile, openFile } from "./utils/app-utils";
import Rack from "./components/Rack/Rack";
import Sidebar from "./components/Sidebar/Sidebar";
import MsContext from "./context/MsContext";
import sim from "./assets/images/simulation.svg";
import { defaultTemplate } from "./app-menu";
import TitleBar from "frameless-titlebar";

const { ipcRenderer, remote } = window.require("electron");
const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

function App() {
  const context = useContext(MsContext);
  const [modSettings, setModSettings] = useState(null);
  const { sidebar, sbContent } = context;

  // create reference to context for using its methods
  // inside of use effect
  const refCtx = useRef(context);
  const toggleSidebar = useCallback(
    (e, data) => {
      // add function that grabs sidebar and sbContent from context and use
      // those for this function as follows, to remove the need to update the event
      // emitter everytime the sidebar gets updated
      // const {sidebar, sbContent} = context.getSbState();

      const context = refCtx.current;

      if (!data) {
        context.toggleSidebar();
        return;
      }
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
    },
    [refCtx, sidebar, sbContent]
  );

  /* 

  update this event emitter like the save file event emitter 
  and move to that useEffect
  
  */
  // set up event emitter for toggling the sidebare from
  // titlebar
  useEffect(() => {
    // remove all listeners for toggle sidebar
    ipcRenderer.removeAllListeners("toggle-sidebar");
    // create new listener for toggle sidebar
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [toggleSidebar]);

  // file manegment effect
  useEffect(() => {
    const context = refCtx.current;
    const { getCurrentState } = context;

    // save file
    const save = () => {
      const { nodes, cables } = getCurrentState();
      return saveFile(nodes, cables);
    };

    // dialog for confirming open new/saved patch
    const uSure = () => {
      const options = {
        type: "question",
        title: "Hol' up?",
        message:
          "Would you like to save the current patch before opening a new one?",
        buttons: ["yes", "no", "cancel"],
        cancelId: 2,
      };
      return dialog.showMessageBoxSync(options);
    };

    // event emitter for saving file
    ipcRenderer.on("save-patch", () => {
      save();
    });

    // event emitter for opening a save file
    ipcRenderer.on("open-patch", async () => {
      const { nodes } = getCurrentState();
      let confirm = 0;
      if (Object.keys(nodes).length > 1) {
        confirm = uSure();
        switch (confirm) {
          case 0:
            const saved = save();
            if (saved) {
              context.clearContext();
              return;
            }
            break;
          case 1:
            break;
          default:
            return;
        }
      }

      // open file explorer to have user select a file
      try {
        const file = await openFile();
        if (!file) {
          return;
        }
        const { loadedModules, moduleSettings, cables } = file;

        if (!loadedModules || !moduleSettings || !cables) {
          throw new Error(
            "sorry something went wrong while reading file content"
          );
        }
        await context.loadPatchCables(cables);
        setModSettings(moduleSettings);
        await context.loadPatch(loadedModules, cables);
      } catch (err) {
        dialog.showErrorBox("Error loading patch", err);
        return;
      }
    });

    // event emitter for  opening a new project
    ipcRenderer.on("new-patch", async () => {
      const { nodes } = getCurrentState();
      let confirm = 0;
      if (Object.keys(nodes).length > 1) {
        confirm = uSure();
        switch (confirm) {
          case 0:
            const saved = save();
            if (saved) {
              context.clearContext();
              return;
            }
            break;
          case 1:
            context.clearContext();
            break;
          default:
            return;
        }
      } else {
        return;
      }
    });
  }, [refCtx]);

  return (
    <div className="App">
      <TitleBar
        icon={sim} // app icon
        currentWindow={currentWindow} // electron window instance
        platform={process.platform} // win32, darwin, linux
        menu={defaultTemplate}
        title="modSynth"
        onClose={() => currentWindow.close()}
        onMinimize={() => currentWindow.minimize()}
        onMaximize={() => currentWindow.maximize()}
        onDoubleClick={() => currentWindow.maximize()}
      />
      <main className="app-main">
        <Sidebar size={sidebar} />

        <Rack modSettings={modSettings ? modSettings : null} />
      </main>
    </div>
  );
}

export default App;

// the following is for the app icon (build/icon.png) but will change later
/* <div>
  Icons made by{" "}
  <a href="https://www.flaticon.com/authors/wichaiwi" title="Wichai.wi">
    Wichai.wi
  </a>{" "}
  from{" "}
  <a href="https://www.flaticon.com/" title="Flaticon">
    www.flaticon.com
  </a>
</div> */
