import type { ResolvedConfig } from 'vite'

export function VitePluginGetConfig(cb?: (config: ResolvedConfig) => void) {
  return {
    name: 'vite-plugin-cea_get_config',
    configResolved(resolvedConfig: ResolvedConfig) {
      cb && cb(resolvedConfig)
    },
  }
}
