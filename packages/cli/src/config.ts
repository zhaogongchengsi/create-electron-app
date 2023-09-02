import process from 'node:process'
import { loadConfig as lc } from 'c12'
import type { BannerConditions } from '@rspack/core'
import type { Configuration } from 'electron-builder'
import { readPackageJSON } from 'pkg-types'

type Mode = 'production' | 'development' | 'none'

export interface AppConfig {
  output?: string
  name?: string
  appId?: string
}

export interface CeaConfig {
  main?: string
  preload?: string
  html?: string
  output?: string
  root?: string
  mode?: Mode
  appData?: Record<string, any>
  banner?: BannerConditions
  build?: Configuration
}

export type UltimatelyCeaConfig = Required<CeaConfig>

const CONFIG_NAME = 'cea'

export async function loadConfig() {
  const cwd = process.cwd()
  const isProduction = process.env.NODE_ENV === 'production'
  const { name, build } = await readPackageJSON(cwd)

  return await lc<CeaConfig>({
    cwd,
    name: CONFIG_NAME,
    defaults: {
      root: cwd,
      main: undefined,
      preload: undefined,
      html: 'index.html',
      output: isProduction ? './dist/app' : '.app',
      mode: process.env.NODE_ENV || 'production',
      appData: undefined,
      banner: `${name}`,
      build,
    },
  })
}

export function defineConfig(config: CeaConfig) {
  return config
}
