import { RspackVirtualModulePlugin } from 'rspack-plugin-virtual-module'

// todo: 添加虚拟模块plugins
export const plugins = [
  new RspackVirtualModulePlugin({
    contents: 'export default "Hello World";',
  }),
]
