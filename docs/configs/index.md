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
