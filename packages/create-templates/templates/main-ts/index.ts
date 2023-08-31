import { resolve } from 'node:path'
import { BrowserWindow, app } from 'electron'

let win: BrowserWindow | undefined

const { loadUrl, mode, preload } = import.meta.env

function getPath(path: string) {
  return resolve(__dirname, path)
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: preload && getPath(preload),
    },
  })

  if (mode === 'production')
    win.loadFile(loadUrl)
  else
    win.loadURL(loadUrl)
}

app
  .whenReady()
  .then(() => {
    createWindow()
    mode === 'development' && win?.webContents.openDevTools()
  })
  .catch(console.error)
