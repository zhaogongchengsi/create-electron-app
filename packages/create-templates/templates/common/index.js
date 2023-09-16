import { resolve } from 'node:path';
import { BrowserWindow, app } from 'electron'

const { PROD, DEV } = import.meta.env
const { page, preload } = import.meta.app

let window

function createWindow() {
  window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: resolve(__dirname, preload)
    },
  })

  const { main } = page

  PROD ? window.loadFile(main) : window.loadURL(main)
  DEV && window.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})