// @ts-nocheck
const electron = require('electron')

const closeId = '_cea_:app-windows-all_close'
electron.app.on('will-quit', () => {
  process.send(closeId)
})
