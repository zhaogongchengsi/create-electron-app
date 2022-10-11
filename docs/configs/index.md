# 配置 create-electron-app

:::tip 目录说明
所有的目录都是基于项目根目录计算 非必要情况 不推荐使用 `path.resolve(__dirname, path)` 等重新计算目录
:::

## main

- **类型:** `string | {input:string, preload:string}`
- **默认值:** 必填 无默认值
  - `input` 入口文件的路径
  - `preload` [preload](https://www.electronjs.org/zh/docs/latest/api/context-bridge#exposing-node-global-symbols) 的文件路径

## vite

- **类型:** `string`
- **默认值:** 必填 无默认值

  Vite 的配置文件路径

## watch

- **类型:** `boolean`

- **默认值:** `true`

  是否开启热更新 当主进程文件变更之后 重启应用

## tempDirName

- **类型:** `string`
- **默认值:** `".app"`

开发时会生成一个临时打包的目录 该目录的名字

## outDir

- **默认值:** `"dist"`

- **类型:** `string`

应用构建完成后的输出目录包括 png js 等 该目录的名字

## appOutDir

- **类型:** `string`
- **默认值:** `"releases"`

应用代码构建完成后生成的 xxx.exe 等应用输出的目录 该目录的名字

## plugins

- **类型** `{name: string; setup: (build: PluginBuild) => (void | Promise<void>)}[]`
- **默认值** `[]`

和 esbuild 插件是一样的 理论上来讲支持所有的 esbuild 插件

[esbuild.plugins](https://esbuild.docschina.org/plugins/#using-plugins)

## external

- **类型:** `string[]`
- **默认值:** `[]`

[esbuild.external](https://esbuild.docschina.org/api/#external)

需要忽略的外部依赖

## define

- **类型:** `{[string]: string | number | boolean | Object | Array}`
- **默认值:** `undefined`

定义全局常量替换 在构建时被静态替换 值必须是可以被 `JSON.stringify` 序列化的值

## sourcemap

- **类型:** `"both" | "external" | "inline" | "linked"`
- **默认值:** `both`

Source map 可以使调试代码更容易。它们编码从生成的输出文件中的行/列偏移量转换回 对应的原始输入文件中的行/列偏移量所需的信息

## staticResource

- **类型:** `string`
- **默认值:** `''`

静态资源文件夹 可以存放 图片 字体等

## debug

- **类型:** `{port: number} | boolean`
- **默认值:** `undefined`

调试 主线程 的有关配置

## alias

- **类型:** `{string: string}`
- **默认值:** `{}`

设置文件夹别名 在使用时 若是 `#/index` 则需要补全后缀 `#/index.js` 若是 `#/index/index` 则不需要
