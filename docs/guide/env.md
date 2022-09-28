# 环境变量与模式
环境变量会挂载在一个`import.meta.env`的对象上
- `import.meta.env.loadUrl` 应用运行的渲染线程的路径
    - 生产环境下是 `index.html` 文件的路径
    - 开发环境下是 [vite.server](https://vitejs.cn/vite3-cn/config/server-options.html#server-port) 的 url 路径
- `import.meta.env.mode` 应用运行的模式
    - `development` 开发模式
    - `production` 生产模式 (应用以打包)
- `import.meta.preload` [Electron BrowserWindow.webPreferences.preload](https://www.electronjs.org/zh/docs/latest/api/context-bridge#exposing-node-global-symbols)
- `import.meta.env.DEV`: `{boolean}` 是否运行在开发模式下 
- `import.meta.env.PROD`: `{boolean}` 是否运行在生产模式下

## .env 文件

和 Vite 一样 使用 dotenv 从你的 环境目录 中的下列文件加载额外的环境变量：

```sh
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载

```

:::tip 小提示
多个文件的环境变量不可重名否则会被覆盖
:::

加载的环境变量也会通过 `import.meta.env` 以字符串形式暴露给客户端源码。
