import { BrowserWindow, app, ipcMain } from 'electron'
import { createSubWindow } from './subpage'

const { PROD, DEV } = import.meta.env
const { page, preload } = import.meta.app

let window: BrowserWindow
let subwindow : BrowserWindow

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload
    },
  })

  const { main } = page as MultiplePage
  
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

ipcMain.on('say', ({ reply }, message) => {
  reply('say-reply', `${message} reply`)
})

ipcMain.on('open-window', ({ reply }, name) => {
  reply('open-window-state' ,name)
  subwindow = createSubWindow()
})