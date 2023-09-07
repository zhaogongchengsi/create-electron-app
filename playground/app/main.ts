import { BrowserWindow, app } from 'electron'

const { PROD } = import.meta.env
const { baseUrl, pages } = import.meta.app

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: preloadUrl
    },
  })

  PROD ? win.loadFile(baseUrl + pages) : win.loadURL(baseUrl + pages)
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
