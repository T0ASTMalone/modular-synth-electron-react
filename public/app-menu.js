const { ipcRenderer, shell, app, template, dialog} = require("electron");

const { openExternal } = shell;

const defaultTemplate = [
  {
    id: "0",
    label: "View",
    show: false,
    submenu: [
      {
        id: "22",
        label: "modules",
        show: false,
        click: () => {
          mainWindow.webContents.send("toggle-sidebar");
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
            icon: ""
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
        icon: "",
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
app.newMenu = defaultTemplate;

// const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(defaultTemplate);

module.exports = defaultTemplate;
