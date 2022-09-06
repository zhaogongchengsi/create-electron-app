import { contextBridge, ipcRenderer } from "electron";
const send = (channel, ...params) => {
  ipcRenderer.send(channel, ...params);
};

const on = (channel, func) => {
  const listener = (_, ...params) => {
    func(...params);
  };
  ipcRenderer.on(channel, listener);
  return () => {
    ipcRenderer.removeListener(channel, listener);
  };
};

const once = (channel, func) => {
  return ipcRenderer.once(channel, func);
};

const removeEventListener = (channel, listener) => {
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
