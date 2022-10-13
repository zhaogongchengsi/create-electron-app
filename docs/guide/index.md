# 开始

## 🔊 温馨提示

:::tip 兼容性说明

Vite 需要 Node.js 版本 14.18+，16+， 所以`create-electron-app`也需要兼容 vite 的 node 版本需求， 当你的包管理器发出警告时，请注意升级你的 Node 版本。

:::

:::tip 使用说明

无论使用哪种方法都需要使用时需要自动下载 electron 和 electron-builder 两个库

:::

```bash
npm install electron electron-builder --save-dev
```

---

## 从 0 创建一个 electron 应用

### 1. 先运行 `vite` 的命令 创建一个基础模板

```bash
npm create vite@latest
```

### 2. 创建入口文件

```js
// index.js

import { BrowserWindow, app } from "electron";
import { resolve } from "path";

let win = undefined;

const getPath = (path: string) => {
  return resolve(__dirname, path);
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: electronAssets.preload && getPath(electronAssets.preload),
    },
  });

  if (electronAssets.mode === "production") {
    win.loadFile(electronAssets.loadUrl);
  } else {
    win.loadURL(electronAssets.loadUrl);
  }
};

app
  .whenReady()
  .then(() => {
    createWindow();
    win?.webContents.openDevTools();
  })
  .catch(console.error);
```

### 3. 修改 package.json

```json
  "main": "./index.js"
  "scritp": {
    "dev:app": "cea",
    "build:app": "cea build"
  }
```

### 4. 安装 create-electron-app

```bash
npm install @zzhaon/create-electron-app --save-dev
```

### 5. 运行命令

```bash
npm run dev:app
```

稍等片刻 即可看见创建好的 桌面应用程序的窗口

## 快速创建一个基础模板

**使用 npm：**

```bash
npm create cea
```

然后按照提示操作即可
