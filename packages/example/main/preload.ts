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
});
