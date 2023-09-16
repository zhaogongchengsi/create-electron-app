import { contextBridge, ipcRenderer } from 'electron'

function send(channel: string, ...params: unknown[]) {
  ipcRenderer.send(channel, ...params)
}

function on(channel: string, func: (...params: any[]) => void) {
  const listener = (_: Electron.IpcRendererEvent, ...params: any[]) => {
    func(...params)
  }
  ipcRenderer.on(channel, listener)
  return () => {
    ipcRenderer.removeListener(channel, listener)
  }
}

function once(channel: string, func: (...params: unknown[]) => void) {
  return ipcRenderer.once(channel, func)
}

function removeEventListener(channel: string,
  listener: (...args: any[]) => void) {
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
