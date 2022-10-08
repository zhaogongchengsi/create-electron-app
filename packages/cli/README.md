# create-electron-app

![create-electron-app](https://img.shields.io/npm/v/@zzhaon/create-electron-app?color=red&label=create-electron-app)

🔊 Create electron app only requires lightweight configuration

Using esbuild and vite

- Typescript support
- Hot
- Build and launch fast
- seamless vite

## Example

[Basic use example](https://github.com/zhaogongchengsi/create-electron-app/tree/master/packages/example)
[Development application example](https://github.com/zhaogongchengsi/picture-preview)

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

import { BrowserWindow, app } from "electron";
import { resolve } from "path";

let win: BrowserWindow | undefined = undefined;

const { loadUrl, mode, preload } = import.meta.env; // Get data from environment variables

const getPath = (path: string) => {
  return resolve(__dirname, path);
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: preload && getPath(preload),
    },
  });

  if (mode === "production") {
    win.loadFile(loadUrl); // index.html
  } else {
    win.loadURL(loadUrl); // http:localhost:3000  vite server url
  }
};

app
  .whenReady()
  .then(() => {
    createWindow();

    // current environment
    mode === "development" && win?.webContents.openDevTools();
  })
  .catch(console.error);
```

3. modify the package.json file

   Add entry file and add command

```json
{
  "name": "your app name",
  "private": true,
  "version": "0.0.0",
  "main": "./index.ts",
  "script": {
    "dev": "cea",
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
npm create cea
```

Operate as directed

> Create a js or ts file named cea.config

---

# Configuration

- ### `main`
  `string | {input:string, preload:string}` required
  - `input` Main process entry file
  - `preload` preload entry file
- ### `vite`

  `string | {input:string, preload:string}` required

  Vite's configuration file path

- ### `watch`

  `boolean` default: true

  Whether to restart the application when the main process file changes

- ### `tempDirName`

  `string` default: '.app'

  Generate the name of the temporary run directory, based on the project root directory

- ### `outDir`

  `string` default: dist

  The directory where the built js file is output

- ### `appOutDir`

  `string` default: 'releases'

  The output directory of the application

- ### `staticResource`

  `string` default: ''

  static resource folder, For example, the image icon script

## Environment variables and patterns

Environment variables are mounted on a `import.meta.env` object

- `import.meta.env.loadUrl` 应用运行的渲染线程的路径
  - production `index.html` 文件的路径
  - development [vite.server](https://vitejs.cn/vite3-cn/config/server-options.html#server-port) 的 url 路径
- `import.meta.env.mode` 应用运行的模式
  - `development` 开发模式
  - `production` 生产模式 (应用以打包)
- `import.meta.preload` [Electron BrowserWindow.webPreferences.preload](https://www.electronjs.org/zh/docs/latest/api/context-bridge#exposing-node-global-symbols)
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
