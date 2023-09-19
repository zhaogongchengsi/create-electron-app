import type { ResolvedConfig as ViteResolvedConfig } from 'vite'
import type { ResolveConfig } from './config'

export interface loaderOptions {
  vite: ViteResolvedConfig
  ceaConfig: ResolveConfig
}

export function getOptions(that: any) {
  return that.getOptions() as loaderOptions
}
