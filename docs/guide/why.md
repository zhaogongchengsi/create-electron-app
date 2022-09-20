# 为什么选 Create-Electron-App

## 主线程

使用 Nodejs 作为主线程的开发语言 构建 nodejs 程序的需求没有构建 web 程序的要求多所以选择生产环境下使用 esbuild

1. 🚩 支持 Typescript
2. 🚩 速度快
3. 🚩 可使用插件扩展
4. 👎 Webpack 太慢了
5. 👎 Rollup 一般般慢

随着 esbuild 的生态越来越好 所以选择 esbuild 没有任何问题

## 渲染线程

由于 Electron 的架构将 app 分为主线程和渲染线程 渲染线程使用 web 技术让当前生机勃勃的前端生态可以应用于 app 开发 所以渲染线程使用当下最火热的 工具 [Vite](https://cn.vitejs.dev/)
