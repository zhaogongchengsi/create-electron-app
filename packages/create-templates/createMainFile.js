const createMainTemp = (ts = false) => {
  return `
import { BrowserWindow, app } from "electron";
import { resolve } from "path";

let win: ${ts ? BrowserWindow | undefined : ""} = undefined;

const getPath = (path ${ts ? ":string" : ""} ) => {
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
  .catch(console.error);`;
};

const createMainTempType = () => {
  return `
declare interface ElectronAssets {
  mode: "production" | "development";
  preload: string;
  loadUrl: string;
}

declare const electronAssets: ElectronAssets;

declare module "*.png" {
  const url: string;
  export default url;
}
declare module "*.jpg" {
  const url: string;
  export default url;
}
declare module "*.jpeg" {
  const url: string;
  export default url;
}
`;
};

const createMainReadload = () => {
  return `
import { contextBridge, ipcRenderer } from "electron";
const send = (channel: string, ...params: unknown[]) => {
  ipcRenderer.send(channel, ...params);
};

const on = (channel: string, func: (...params: any[]) => void) => {
  const listener = (_: Electron.IpcRendererEvent, ...params: any[]) => {
    func(...params);
  };
  ipcRenderer.on(channel, listener);
  return () => {
    ipcRenderer.removeListener(channel, listener);
  };
};

const once = (channel: string, func: (...params: unknown[]) => void) => {
  return ipcRenderer.once(channel, func);
};

const removeEventListener = (
  channel: string,
  listener: (...args: any[]) => void
) => {
  ipcRenderer.removeListener(channel, listener);
};

contextBridge.exposeInMainWorld("electron", {
  app: {
    close: () => ipcRenderer.send("close"),
  },
  ipcRenderer: {
    send,
    on,
    once,
    removeEventListener,
  },
});`;
};

module.exports = {
  createMainTemp,
  createMainTempType,
  createMainReadload,
};
