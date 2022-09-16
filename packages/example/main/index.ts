import { BrowserWindow, app } from "electron";
import { resolve } from "path";

let win: BrowserWindow | undefined = undefined;

const getPath = (path: string) => {
  return resolve(__dirname, path);
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: electronAssets.preload && getPath(electronAssets.preload),
    },
  });

  if (electronAssets.mode === "production") {
    win.loadFile(electronAssets.loadUrl);
  } else {
    win.loadURL(electronAssets.loadUrl);
  }
};

app
  .whenReady()
  .then(() => {
    createWindow();
    win?.webContents.openDevTools();
  })
  .catch(console.error);

  
console.log("node env:",process.env)