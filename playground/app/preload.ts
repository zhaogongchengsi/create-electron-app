import { ipcRenderer, contextBridge } from 'electron'

const say = (message: string) => {
    ipcRenderer.send('say', message)
}

const on = (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
}

const openSubpage = () => {
    ipcRenderer.send('open-window', 'subpage')
}

contextBridge.exposeInMainWorld(
    'electron',
    {
        say,
        on,
        openSubpage
    }
)
