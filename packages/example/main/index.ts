import { BrowserWindow, app, ipcMain } from "electron";
import { resolve } from "path";

let win: BrowserWindow | undefined = undefined;
let subWin: BrowserWindow | undefined = undefined;

const { loadUrl, mode, preload } = import.meta.env;

if (import.meta.env.DEV) {
  const install = require("@zzhaon/devtools-install");
  install.devtoolsInstall([
    {
      name: "vue",
      type: "edge",
      id: "khampijcelfojpjcmmiibmhfkhacjhhj",
    },
  ]);
}

const getPath = (path: string) => {
  return resolve(__dirname, path);
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: getPath("public/icon.png"),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      sandbox: true,
      preload: preload && getPath(preload),
    },
  });

  if (mode === "production") {
    win.loadFile(loadUrl);
  } else {
    win.loadURL(loadUrl);
  }
};

const createSubWindow = () => {
  subWin = new BrowserWindow({
    width: 600,
    height: 400,

    icon: getPath("public/icon.png"),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      sandbox: true,
      preload: preload && getPath(preload),
    },
  });

  if (mode === "production") {
    // subWin.loadFile(`${loadUrl}/nested/index.html`);
    subWin.loadFile(`${loadUrl}/subpage.html`);
  } else {
    // subWin.loadURL(`${loadUrl}/nested/index.html`);
    subWin.loadURL(`${loadUrl}/subpage.html`);
  }
};

app
  .whenReady()
  .then(() => {
    createWindow();
    mode === "development" && win?.webContents.openDevTools();
  })
  .catch(console.error);

ipcMain.on("0101", (e: Electron.IpcMainEvent, message: string) => {
  console.log("message", message);
  e.reply("received" + message);
});

ipcMain.on("openSubPage", (e: Electron.IpcMainEvent) => {
  createSubWindow();
});

// 禁用硬件加速
app.disableHardwareAcceleration();
