import process from 'node:process'
import { loadConfig as lc } from 'c12'
import type { BannerConditions } from '@rspack/core'
import type { Configuration } from 'electron-builder'
import { readPackageJSON } from 'pkg-types'

const CONFIG_NAME = 'cea'

export type Mode = 'production' | 'development' | 'none'

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
  banner?: BannerConditions
  build?: Configuration
}

export type ResolveConfig = Required<Omit<CeaConfig, 'preload'>> & { preload?: string }

export async function loadConfig() {
  const cwd = process.cwd()
  const isProduction = process.env.NODE_ENV === 'production'
  const { name, build } = await readPackageJSON(cwd)

  const { config } = await lc<CeaConfig>({
    cwd,
    name: CONFIG_NAME,
    defaults: {
      root: cwd,
      main: undefined,
      preload: undefined,
      html: 'index.html',
      output: isProduction ? 'app' : '.app',
      mode: process.env.NODE_ENV || 'production',
      banner: `${name}`,
      build,
    },
  })

  return config! as ResolveConfig
}

export function defineConfig(config: CeaConfig) {
  return config
}
