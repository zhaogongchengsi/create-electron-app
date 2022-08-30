"use strict";

// <define:electronAssets>
var define_electronAssets_default = {};

// main/index.ts
var import_electron = require("electron");
var import_path = require("path");
var win = void 0;
var getPath = (path) => {
  return (0, import_path.resolve)(__dirname, path);
};
var createWindow = () => {
  win = new import_electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: getPath(define_electronAssets_default.preload ?? "")
    }
  });
  if (define_electronAssets_default.mode === "production") {
    win.loadFile(define_electronAssets_default.loadUrl);
  } else {
    win.loadURL(define_electronAssets_default.loadUrl);
  }
};
import_electron.app.whenReady().then(() => {
  createWindow();
  win?.webContents.openDevTools();
}).catch(console.error);
