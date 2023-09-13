import { BrowserWindow, app } from 'electron'

const { PROD } = import.meta.env
const { page, preload } = import.meta.app

let window: BrowserWindow

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload
    },
  })

  PROD ? window.loadFile(page as string) : window.loadURL(page as string)
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
