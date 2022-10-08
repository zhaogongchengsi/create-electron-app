import { BrowserWindow, app } from "electron";
import { resolve } from "path";

let win: BrowserWindow | undefined = undefined;

const { loadUrl, mode, preload } = import.meta.env;

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

// 禁用硬件加速
app.disableHardwareAcceleration();

console.log("12311212331122s3");
