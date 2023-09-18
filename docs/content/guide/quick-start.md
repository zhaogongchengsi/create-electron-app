---
fluid: true
---
# Quick start

### Use cli

::code-group
  ```bash [yarn]
  yarn create cea-app
  ```
  ```bash [npm]
  npm create cea-app
  ```
  ```bash [pnpm]
  pnpm  create cea-app
  ```
::

Just follow the prompts.

::alert{type="warning"}
Please pay attention to downloads, necessary dependencies
::

### Create manually

```sh
npm init -y
npm install electron electron-builder vite @vitejs/plugin-vue @zzhaon/create-electron-app unocss @unocss/reset
npm install vue vue-router
```

```json
{
  "scripts": {
    "dev": "cea dev",
    "build": "cea build"
  },
}
```

#### 1. Create main file

[electron main](https://www.electronjs.org/docs/latest/)

```ts
// app/index.ts
import { resolve } from 'node:path';
import { BrowserWindow, app } from 'electron'

const { PROD, DEV } = import.meta.env
const { page, preload } = import.meta.app

let window: BrowserWindow

function createWindow() {
  window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: resolve(__dirname, preload)
    },
  })

  PROD ? window.loadFile(page as string) : window.loadURL(page as string)
  DEV && window.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})
```

#### 2. Create preload file

[electron preload](https://www.electronjs.org/docs/latest/tutorial/quick-start#access-nodejs-from-the-renderer-with-a-preload-script)

```ts
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

```

#### 4. Create a cea.config.ts file
```ts
import { defineConfig } from '@zzhaon/create-electron-app'
import { resolve } from 'path'

export default defineConfig({
  main: './app/index.ts',
  preload: './app/preload.ts',
  alias: {
    "~": resolve(__dirname, './app')
  }
})

```

#### 4. Create a [vite project](https://cn.vitejs.dev/guide)

Create a vue profile
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [UnoCSS(), Vue()],
})
```

#### 5. Create index.ts file

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

const app = createApp(App)

app.mount('#app')
```

#### 6. Create index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<div id="app"></div>
	<script type="module" src="/src/index.ts"></script>
</body>
</html>
```
#### 7. Create App.vue

```vue
<template>
	<div class="w-full h-screen flex flex-col justify-center items-center gap-10">
		<h1 class="text-10 font-bold">Hello electron</h1>
	</div>
</template>
```
#### 8. Run
::code-group
  ```bash [yarn]
  yarn run dev
  ```
  ```bash [npm]
  npm run dev
  ```
  ```bash [pnpm]
  pnpm dev
  ```
::