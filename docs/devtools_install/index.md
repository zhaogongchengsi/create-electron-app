# chorme 浏览器扩展下载

:::warning 注意
[Electron](https://www.electronjs.org/zh/docs/latest/api/extensions) 不支持商店中的任意 Chrome 扩展，Electron 项目的目标不是与 Chrome 的扩展实现完全兼容。
:::

将本地 chrome 内核的浏览器插件安装到 electron 中

#### 支持的插件

- [Vue.js devtools](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl?hl=zh-CN)
- [React Developer Tools](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil?hl=zh-CN)
- [jQuery Debugger](https://chrome.google.com/webstore/detail/jquery-debugger/dbhhnnnpaeobfddmlalhnehgclcmjimi)
- [Redux DevTools Extension](https://microsoftedge.microsoft.com/addons/detail/redux-devtools/nnkgneoiohoecpdiaponcejilbhhikei?hl=zh-CN)

- [更多插件列表查看](https://www.electronjs.org/zh/docs/latest/tutorial/devtools-extension)

```sh
npm install @zzhaon/devtools-install
```

# Usage

```ts
// index.ts
import { devtoolsInstall } from '@zzhaon/devtools-install'

devtoolsInstall([
  {
    name: 'vue',
    type: 'edge',
    id: 'sadfijoaigoerigerwgergi', // id
  },
])
```

![extensions id 示意图](/extensions.png)

### `name`

插件的名字 意义不大 安装发生错误报错使用

### `type`

插件安装在哪个浏览器里面 chrome | edge 必填

### `id`

插件的 id 安装使用 必填

