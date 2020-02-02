const { ipcRenderer, shell } = window.require("electron").remote;

const { openExternal } = shell;

const mainWindow = window.require("electron").remote.getCurrentWindow();

console.log(mainWindow);

export const defaultTemplate = [
  {
    id: "0",
    label: "View",
    modules: false,
    submenu: [
      {
        id: "01",
        label: "current",

        click: data => {
          return mainWindow.webContents.send("toggle-sidebar", data);
        }
      },
      {
        id: "02",
        label: "patches",
        click: data => {
          return mainWindow.webContents.send("toggle-sidebar", data);
        }
      },
      {
        id: "03",
        label: "search",

        click: data => {
          return mainWindow.webContents.send("toggle-sidebar", data);
        }
      }
    ]
  },
  {
    id: "1",
    label: "App",
    submenu: [
      {
        id: "hello",
        label: "Disabled",
        enabled: true,
        after: "2",
        click: (item, win, e) => {
          e.menuBar.setKeyById(item.id, "enabled", !item.enabled);
        }
      },
      {
        id: "2",
        label: "Sub Menu",
        icon:
          "https://www.gstatic.com/images/branding/product/1x/keep_48dp.png",
        submenu: [
          {
            label: "Color Submenu",
            submenu: [
              {
                label: "Light",
                type: "radio",
                checked: false,
                click: (item, win, e) => {
                  document.querySelector("html").style.background =
                    "rgb(240,240,240)";
                }
              },
              {
                label: "Dark",
                type: "radio",
                checked: true,
                click: (item, win, e) => {
                  document.querySelector("html").style.background =
                    "rgb(64,64,64)";
                }
              },
              {
                label: "Black",
                type: "radio",
                checked: false,
                click: (item, win, e) => {
                  document.querySelector("html").style.background =
                    "rgb(0,0,0)";
                }
              }
            ]
          },
          {
            label: "Random 2",
            icon: require("./assets/images/icon.png")
          },
          {
            label: "Random 3",
            submenu: [
              {
                label: "Random 4",
                submenu: [
                  {
                    label: "Random 7"
                  },
                  {
                    label: "Random 8"
                  },
                  {
                    label: "Random 9"
                  },
                  {
                    label: "Random 10"
                  }
                ]
              },
              {
                label: "Random 5"
              },
              {
                label: "Random 6"
              }
            ]
          }
        ]
      },
      {
        id: "4",
        label: "Not visible",
        visible: false
      },
      {
        id: "3",
        icon: require("./assets/images/icon.png"),
        label: "Arguments",
        click: (item, win, e) => {
          console.log(item, win, e);
        }
      },
      {
        id: "5",
        label: "Really Long Menu Label that should be truncated"
      },
      { type: "separator" },
      {
        label: "Test Accelerator",
        accelerator: "CommandOrControl+Y",
        click: (item, win, e) => {
          ipcRenderer.send("Test");
        }
      },
      {
        label: "Open Dev Tools",
        click: (item, win, e) => {
          win.openDevTools();
        }
      },
      {
        label: "Resizable",
        type: "checkbox",
        checked: true,
        click: (item, win, e) => {
          win.setResizable(item.checked);
        }
      },
      {
        label: "Unchecked",
        type: "checkbox",
        checked: false,
        click: (item, win, e) => {
          win.setResizable(item.checked);
        }
      },
      {
        label: "Quit",
        click: () => {
          window.close();
        }
      }
    ]
  },
  {
    id: "2",
    label: "Color",
    before: "1",
    submenu: [
      {
        label: "Light",
        type: "radio",
        checked: false,
        click: (item, win, e) => {
          document.querySelector("html").style.background = "rgb(240,240,240)";
        }
      },
      {
        label: "Dark",
        type: "radio",
        checked: true,
        click: (item, win, e) => {
          document.querySelector("html").style.background = "rgb(64,64,64)";
        }
      },
      {
        label: "Black",
        type: "radio",
        checked: false,
        click: (item, win, e) => {
          document.querySelector("html").style.background = "rgb(0,0,0)";
        }
      }
    ]
  },
  {
    label: "Disabled",
    enabled: false,
    submenu: [
      {
        label: "Light",
        type: "radio",
        checked: false,
        click: (item, win, e) => {
          document.querySelector("html").style.background = "rgb(240,240,240)";
        }
      }
    ]
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Homepage",
        click: () => {
          openExternal("https://github.com/Cristian006/frameless-titlebar");
        }
      }
    ]
  },
  {
    label: "Scrollable",
    submenu: [
      {
        label: "Random 1"
      },
      {
        label: "Random 2"
      },
      {
        label: "Random 3"
      },
      {
        label: "Random 4"
      },
      {
        label: "Random 5"
      },
      {
        label: "Random 6"
      },
      {
        label: "Random 7"
      },
      {
        label: "Random 8"
      },
      {
        label: "Random 9"
      },
      {
        label: "Random 10"
      },
      {
        label: "Random 11"
      },
      {
        label: "Random 12"
      },
      {
        label: "Random 13"
      },
      {
        label: "Random 14"
      },
      {
        label: "Random 15"
      },
      {
        label: "Random 16"
      },
      {
        label: "Random 17"
      },
      {
        label: "Random 18"
      },
      {
        label: "Random 19"
      },
      {
        label: "Random 20"
      }
    ]
  }
];

const Edit = [
  {
    label: "Undo",
    accelerator: "Ctrl+Z"
  },
  {
    label: "Redo",
    accelerator: "Ctrl+Y"
  },
  {
    type: "separator"
  },
  {
    label: "Cut",
    accelerator: "Ctrl+X"
  },
  {
    label: "Copy",
    accelerator: "Ctrl+C"
  },
  {
    label: "Paste",
    accelerator: "Ctrl+V"
  },
  {
    label: "Paste and Match Style",
    accelerator: "Ctrl+Shift+V"
  },
  {
    label: "Delete"
  },
  {
    label: "Select all",
    accelerator: "Ctrl+A"
  }
];

export const githubTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New repository",
        accelerator: "Ctrl+N"
      },
      {
        type: "separator"
      },
      {
        label: "Add local repository",
        accelerator: "Ctrl+O"
      },
      {
        label: "Clone repository",
        accelerator: "Ctrl+Shift+O"
      },
      {
        type: "separator"
      },
      {
        label: "Options",
        accelerator: "Ctrl+,"
      },
      {
        type: "separator"
      },
      {
        label: "Exit"
      }
    ]
  },
  {
    label: "Edit",
    submenu: Edit
  },
  {
    label: "View",
    submenu: []
  },
  {
    label: "Repository",
    submenu: []
  },
  {
    label: "Branch",
    submenu: []
  },
  {
    label: "Help",
    submenu: []
  }
];

export const signalTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Preferences..."
      },
      {
        type: "separator"
      },
      {
        label: "Exit"
      }
    ]
  },
  {
    label: "Edit",
    submenu: Edit
  },
  {
    label: "View",
    submenu: [
      {
        label: "Actual Size",
        accelerator: "Ctrl+0"
      },
      {
        label: "Zoom In",
        accelerator: "Ctrl+Shift+="
      },
      {
        label: "Zoom Out",
        accelerator: "CtrlCtrl+-"
      },
      {
        type: "separator"
      },
      {
        label: "Toggle Full Screen",
        accelerator: "F11"
      },
      {
        type: "separator"
      },
      {
        label: "Debug Log"
      },
      {
        label: "Toggle Developer Tools",
        accelerator: "Ctrl+Shift+I"
      }
    ]
  },
  {
    label: "Window",
    submenu: [
      {
        label: "Minimize",
        accelerator: "Ctrl+M"
      }
    ]
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Go to Release Notes"
      },
      {
        type: "separator"
      },
      {
        label: "Go to Forums"
      },
      {
        label: "Report An Issue"
      },
      {
        type: "separator"
      },
      {
        label: "About Signal Desktop"
      }
    ]
  }
];

export const slackTemplate = [
  {
    label: "File",
    accelerator: "Ctrl+F",
    submenu: [
      {
        label: "Preferences",
        accelerator: "Ctrl+,"
      },
      {
        label: "Close",
        accelerator: "Ctrl+W"
      },
      {
        label: "Quit Slack",
        accelerator: "Ctrl+Q"
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "Ctrl+Z"
      },
      {
        label: "Redo",
        accelerator: "Ctrl+Y"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "Ctrl+X"
      },
      {
        label: "Copy",
        accelerator: "Ctrl+C"
      },
      {
        label: "Paste",
        accelerator: "Ctrl+V"
      },
      {
        label: "Paste and Match Style",
        accelerator: "Ctrl+Shift+V"
      },
      {
        label: "Delete"
      },
      {
        label: "Select all",
        accelerator: "Ctrl+A"
      }
    ]
  },
  {
    label: "View"
  },
  {
    label: "History"
  },
  {
    label: "Window"
  },
  {
    label: "Help",
    accelerator: "Ctrl+H"
  }
];

// const showOpen = function() {
//   dialog.showOpenDialog({
//     properties: ["openFile"],
//     filters: [{ name: "GPX", extensions: ["gpx"] }]
//   });
// };

// export const steveKinneyMenu = [
//   {
//     label: "File",
//     submenu: [
//       {
//         label: "Open",
//         accelerator: "CmdOrCtrl+O",
//         click() {
//           showOpen();
//         }
//       },
//       {
//         label: "Save",
//         accelerator: "CmdOrCtrl+S",
//         click() {
//           // save new comic
//         }
//       }
//     ]
//   },
//   {
//     label: "Edit",
//     submenu: [
//       {
//         label: "Undo",
//         accelerator: "CmdOrCtrl+Z",
//         role: "undo"
//       },
//       {
//         label: "Redo",
//         accelerator: "Shift+CmdOrCtrl+Z",
//         role: "redo"
//       },
//       {
//         type: "separator"
//       },
//       {
//         label: "Cut",
//         accelerator: "CmdOrCtrl+X",
//         role: "cut"
//       },
//       {
//         label: "Copy",
//         accelerator: "CmdOrCtrl+C",
//         role: "copy"
//       },
//       {
//         label: "Paste",
//         accelerator: "CmdOrCtrl+V",
//         role: "paste"
//       },
//       {
//         label: "Select All",
//         accelerator: "CmdOrCtrl+A",
//         role: "selectall"
//       }
//     ]
//   }
// ];

// if (window.process.platform === "darwin") {
//   var name = app.getName();
//   template.unshift({
//     label: name,
//     submenu: [
//       {
//         label: "About " + name,
//         role: "about"
//       },
//       {
//         type: "separator"
//       },
//       {
//         label: "Services",
//         role: "services",
//         submenu: []
//       },
//       {
//         type: "separator"
//       },
//       {
//         label: "Hide " + name,
//         accelerator: "Command+H",
//         role: "hide"
//       },
//       {
//         label: "Hide Others",
//         accelerator: "Command+Alt+H",
//         role: "hideothers"
//       },
//       {
//         label: "Show All",
//         role: "unhide"
//       },
//       {
//         type: "separator"
//       },
//       {
//         label: "Quit",
//         accelerator: "Command+Q",
//         click() {
//           app.quit();
//         }
//       }
//     ]
//   });
// }
