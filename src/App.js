import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import "./App.css";
import {
  saveFile,
  openProject,
  createTmpProject,
  saveExistingProject,
  checkUnsavedRec,
} from "./utils/app-utils";
import Rack from "./components/Rack/Rack";
import Sidebar from "./components/Sidebar/Sidebar";
import MsContext from "./context/MsContext";
import { defaultTemplate } from "./app-menu";
import TitleBar from "frameless-titlebar";
// import Logger from "./services/logger";
import { useLogger } from "./utils/hooks/logger";

const { ipcRenderer, remote } = window.require("electron");
const { dialog, process } = remote;
const currentWindow = remote.getCurrentWindow();
//const logger = new Logger("App");

function App() {
  const context = useContext(MsContext);
  const [modSettings, setModSettings] = useState(null);
  const logger = useLogger("App");
  const { sidebar, sbContent } = context;

  // create reference to context for using its methods
  // inside of use effect
  const refCtx = useRef(context);
  const refLogger = useRef(logger);

  const toggleSidebar = useCallback(
    (e, data) => {
      const logger = refLogger.current;
      logger.info(e.senderId);
      // add function that grabs sidebar and sbContent from context and use
      // those for this function as follows, to remove the need to update the
      // event emitter everytime the sidebar gets updated const {sidebar,
      // sbContent} = context.getSbState();
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
    [refCtx, sidebar, sbContent, refLogger]
  );

  /* 

  update this event emitter like the save file event emitter 
  and move to that useEffect
  
  */
  // set up event emitter for toggling the sidebare from
  // titlebar
  useEffect(() => {
    const logger = refLogger.current;
    logger.info("initializing sidebar toggle");
    // remove all listeners for toggle sidebar
    ipcRenderer.removeAllListeners("toggle-sidebar");
    // create new listener for toggle sidebar
    ipcRenderer.on("toggle-sidebar", (e, data) => toggleSidebar(e, data));
  }, [toggleSidebar, refLogger]);

  // file manegment effect
  useEffect(() => {
    const logger = refLogger.current;
    logger.info("initializing app");
    const context = refCtx.current;
    const { getCurrentState, setTmpobj, setRootPath, setIsExisting } = context;

    // save file
    const save = () => {
      // check for patch.json
      const { nodes, cables, isExisting, rootPath } = getCurrentState();

      if (isExisting) {
        logger.info(`saving existing project at : ${rootPath}/patch.json`);
        // check for unsaved recordings in tmp folder
        const unsavedRec = checkUnsavedRec(rootPath);
        // whether to save unsaved recordings or not
        let saveRec = false;

        if (unsavedRec) {
          // ask user to save or not
          const option = saveUnsavedRecDialog();
          switch (option) {
            case 0:
              saveRec = true;
              break;
            case 1:
              saveRec = false;
              break;
            default:
              return false;
          }
        }
        // update fourth value to the outcome of the previous check
        saveExistingProject(nodes, cables, rootPath, saveRec);
      } else {
        try {
          logger.info("saving patch");
          // if this is a new project
          saveFile(nodes, cables);
        } catch (e) {
          logger.err(`Error saving new patch: ${e}`);
          return false;
        }
        setIsExisting(true);
      }

      return false;
    };

    // create empty patch dir
    const createNewPatch = async () => {
      logger.info("creating new patch");
      // get tmp dir object which contains clean up method
      // that will delete the tmp dir
      const tmpPathobj = await createTmpProject();
      // set tmpPathobj in context
      setTmpobj(tmpPathobj);
      // set project root path in context
      setRootPath(tmpPathobj.name);
    };

    // create initial empty patch
    createNewPatch();

    const saveUnsavedRecDialog = () => {
      const options = {
        type: "question",
        title: "Hol' up?",
        message:
          "There are unsaved recordings in this project would you like to save those too?",
        buttons: ["yes", "no", "cancel"],
        cancelId: 2,
      };
      return dialog.showMessageBoxSync(options);
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
      const { nodes, tmpPathobj } = getCurrentState();

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
            logger.warn("user will not save current patch");
            break;
          default:
            return;
        }
      }

      // open file explorer to have user select a file
      try {
        // have user select project to open
        const project = await openProject();

        // if returns false or invalid path is chosen cancel operation
        if (!project) {
          return;
        }
        // if project is chosen clear old project
        context.clearContext();

        // get project contents
        const { file, path, tmpobj } = project;

        // if there is a previous tmp dir remove it
        if (tmpPathobj.name) {
          logger.info("deleting tmpDir");
          // tmp (npm package) method to remove tmp dir
          tmpPathobj.removeCallback();
        }

        // set new tmp dir
        logger.info("creating tmp dir");
        // set tmp folder object in context
        setTmpobj(tmpobj);
        // set chosen project path in context
        setRootPath(path);
        logger.info(`new dir at : ${path}, named: ${file}`);

        if (!file) {
          logger.info("no file selected...aborting");
          return;
        }

        const { loadedModules, moduleSettings, cables } = file;

        if (!loadedModules || !moduleSettings || !cables) {
          logger.err("file not found");
          throw new Error(
            "sorry something went wrong while reading file content"
          );
        }
        await context.loadPatchCables(cables);
        setModSettings(moduleSettings);
        await context.loadPatch(loadedModules, cables);
        setIsExisting(true);
      } catch (err) {
        dialog.showErrorBox("Error loading patch", err.message);
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
              logger.info("saved patch");
              context.clearContext();
              createNewPatch();
              return;
            }
            break;
          case 1:
            logger.warn("deleting unsaved patch");
            context.clearContext();
            createNewPatch();
            setIsExisting(false);
            break;
          default:
            return;
        }
      } else {
        return;
      }
    });
  }, [refCtx, refLogger]);

  return (
    <div>
      <TitleBar
        // icon={sim} // app icon
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
