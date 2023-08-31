# electronAssets

## `electronAssets`

**类型签名:**

```TypeScript
interface ElectronAssets {
  mode: "development" | "production";
  preload?: string;
  loadUrl: string | number;
}
```

**使用示例:**

```js
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload:
        electronAssets.preload && resolve(__dirname, electronAssets.preload),
    },
  })

  if (electronAssets.mode === 'production')
    win.loadFile(electronAssets.loadUrl)
  else
    win.loadURL(electronAssets.loadUrl)

}
```

## mode

- **类型:** `"development" | "production"`

当前开发环境 当值处于 `production` 时 则说明 app 已经处于生产环境

## loadUrl

- **类型:** `string`

在开发模式下 当前值为 一个 url 例如：`http:localhost:3000` 端口为 [vite.server.port](https://cn.vitejs.dev/config/server-options.html#server-host)

在生产环境下 当前值为 一个本地 html 的文件地址 例如：`./index.html`

## preload

- **类型:** `string`

如果指定了 [preload](https://www.electronjs.org/zh/docs/latest/api/context-bridge#exposing-node-global-symbols) 文件 则为 preload 的文件地址 例如 `./preload.cjs`
