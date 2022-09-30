import { BrowserWindow, app } from "electron";
import { resolve } from "path";
import img from "#/vite.svg";

let win: BrowserWindow | undefined = undefined;

const { loadUrl, mode, preload } = import.meta.env;

const getPath = (path: string) => {
  return resolve(__dirname, path);
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: preload && getPath(preload),
    },
    titleBarStyle: "hidden",
    titleBarOverlay: true,
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

console.log(img);

// 禁用硬件加速
app.disableHardwareAcceleration();
