const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const { ipcMain, Menu, globalShortcut } = electron;

const template = require("./app-menu");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 600,
    minHeight: 300,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: { nodeIntegration: true }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  createWindow();
  // globalShortcut.register("CmdOrCtrl+s", () => {
  //   // Do stuff when Y and either Command/Control is pressed.
  //   mainWindow.webContents.send("save-file");
  // });
  globalShortcut.register("Alt+s", () => {
    // Do stuff when Y and either Command/Control is pressed.
    mainWindow.webContents.send("toggle-sidebar");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("display-app-menu", (event, arg) => {
  let appMenu = Menu.buildFromTemplate(template);
  if (mainWindow) {
    appMenu.popup(mainWindow, arg.x, arg.y);
  }
});
