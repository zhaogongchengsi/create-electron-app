# Command Line Interface (CLI)

:::tip 提示
运行命令时 确保安装了 **electron** 若是需要构建可执行文件则需要确保安装了 **electron-builder**
:::

```json
  "scripts": {
    "dev": "cea",
    "build": "cea build --not-build-app",
    "build:app": "cea build"
  }
```

## `cea`

- `configPath` 配置文件路径

启动开发模式下的 app

```sh
# example
cea ./cea.config.ts
```

## `cea build`

- `configPath` 配置文件路径
- `--not-build-app` 是否需要构建可执行文件

运行此命令时，若是添加`--not-build-app`参数 则只会构建 code 以及静态资源 若是不添加则会在构建完静态资源后使用 [electron builder](https://www.electron.build/) 构建 app 的可执行文件

当需要自定义构建可执行文件的配置时可以添加此参数 然后直接使用打包后的 dist 文件夹

## `其他`

- `--help` help [boolean]
- `--version` version number [boolean]
