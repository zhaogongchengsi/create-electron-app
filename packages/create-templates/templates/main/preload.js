import { contextBridge, ipcRenderer } from 'electron'

function send(channel, ...params) {
  ipcRenderer.send(channel, ...params)
}

function on(channel, func) {
  const listener = (_, ...params) => {
    func(...params)
  }
  ipcRenderer.on(channel, listener)
  return () => {
    ipcRenderer.removeListener(channel, listener)
  }
}

function once(channel, func) {
  return ipcRenderer.once(channel, func)
}

function removeEventListener(channel, listener) {
  ipcRenderer.removeListener(channel, listener)
}

contextBridge.exposeInMainWorld('electron', {
  app: {
    close: () => ipcRenderer.send('close'),
  },
  ipcRenderer: {
    send,
    on,
    once,
    removeEventListener,
  },
})
