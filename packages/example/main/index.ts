import { BrowserWindow, app, ipcMain } from "electron";
import { resolve } from "path";

let win: BrowserWindow | undefined = undefined;

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
      preload: preload && getPath(preload),
    },
  });

  if (mode === "production") {
    win.loadFile(loadUrl);
  } else {
    win.loadURL(loadUrl);
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

console.log(import.meta.env.PROD);
console.log(import.meta.env.DEV);

// 禁用硬件加速
app.disableHardwareAcceleration();
