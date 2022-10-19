# 功能

基于 [esbuild](https://esbuild.docschina.org/) + [vite](https://cn.vitejs.dev/)

## 构建

- 主进程 和 预加载脚本 会通过 esbuild 直接打包成 `CommonJS` 模块 直接交给 electron 进程

- 渲染进程 `cea` 使用 vite 构建渲染进程代码 但不会控制任何 vite 行为 可直接使用 vite 的[插件](https://cn.vitejs.dev/guide/using-plugins.html) 例如
  [nuocss](https://github.com/unocss/unocss) 等


## 预设配置

- 主进程代码有一套 内置的`esbuild`配置

- 渲染进程归`vite`管

## 热重载

开发模式下当主进程代码更改后会自动重启app类似于热重载
