# 调试

## 调试渲染线程

1. 调试渲染线程可以使用 `win?.webContents.openDevTools();` 打开浏览器的开发者调试工具
2. [将本地下载好的谷歌浏览器插件安装到electron内](/devtools_install/)

![web debug](/webdebug.png)

## 调试主线程

```ts
{
    // ...其他配置
    debug: { port: 5678, },
}
```

配置 debug 后会在控制台输出调试端口

![main debug](/nodedebug-1.png)

把`a`连接复制到浏览器打开之后会获取一个 json 数据

![main debug](/nodedebug-2.png)

复制 devtoolsFrontendUrl 属性 黏贴到谷歌浏览器打开 就可以开始调试主线程了

![main debug](/nodedebug-3.png)
