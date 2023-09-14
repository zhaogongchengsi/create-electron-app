# create-electron-app

![create-electron-app](https://img.shields.io/npm/v/@zzhaon/create-electron-app?color=red&label=create-electron-app)

🔊 Create electron app only requires lightweight configuration

Using esbuild and vite

- Typescript support
- Hot
- Build and launch fast
- seamless vite

## Example

[Basic use example](https://github.com/zhaogongchengsi/create-electron-app/playground)

## Install

```sh

npm install  @zzhaon/create-electron-app --save -d

pnpm add  @zzhaon/create-electron-app --save-dev

```

## Tip ❗

Users need to manually download electron and electron-builder by themselves

```sh

npm install electron electron-builder --save -dev

```

## Usage

1. Initialize a [vite](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project) project

```sh
npm create vite@latest
```

2. New program entry file

```ts
// index.ts  You can freely choose ts or js

import { resolve } from 'node:path'
import { BrowserWindow, app } from 'electron'

let win: BrowserWindow | undefined
const { PROD } = import.meta.env
const { page, preload } = import.meta.app // Get data from environment variables

function getPath(path: string) {
  return resolve(__dirname, path)
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: preload && resolve(preload),
    },
  })

  PROD ? win.loadFile(page) : win.loadURL(page) // http:localhost:3000  vite server url

}

app
  .whenReady()
  .then(() => {
    createWindow()

    // current environment
    !PROD && win?.webContents.openDevTools()
  })
  .catch(console.error)
```

3. modify the package.json file

   Add entry file and add command

```json
{
  "name": "your app name",
  "private": true,
  "version": "0.0.0",
  "main": "./dist/index.ts",
  "script": {
    "dev": "cea dev",
    "build": "cea build"
  }
}
```

run command

```sh
# develop
npm run dev

# build production
npm run build
```

## or use npm

Just follow the prompts

```sh
npm create cea-app
```

Operate as directed

> Create a js or ts file named cea.config

---

## Environment variables and patterns

- `import.meta.env.page` 应用运行的渲染线程的路径
  - production `index.html` 文件的路径
  - development [vite.server](https://vitejs.cn/vite3-cn/config/server-options.html#server-port) 的 url 路径
- `import.meta.app.preload` [Electron BrowserWindow.webPreferences.preload](https://www.electronjs.org/zh/docs/latest/api/context-bridge#exposing-node-global-symbols)
- `import.meta.env.mode` 应用运行的模式
  - `development` 开发模式
  - `production` 生产模式 (应用以打包)
- `import.meta.env.DEV`: `{boolean}` Is it running in development mode?
- `import.meta.env.PROD`: `{boolean}` Is it running in production mode?

## .env file

As with Vite, use dotenv to load additional environment variables from the following files in your environment directory

```sh
.env                # Loaded in all cases
.env.local          # Loaded in all cases
.env.[mode]         # Load only in specified mode
.env.[mode].local   # Load only in specified mode

```

The loaded environment variables will also be exposed to the client side source code in the form of strings through import.meta.env

### [Documentation](https://github.com/zhaogongchengsi/create-electron-app)
