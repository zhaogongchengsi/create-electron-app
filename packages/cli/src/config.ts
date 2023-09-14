import process from 'node:process'
import { loadConfig as lc } from 'c12'
import type { BannerConditions, ModuleOptions } from '@rspack/core'
import type { Configuration } from 'electron-builder'
import { readPackageJSON } from 'pkg-types'

const CONFIG_NAME = 'cea'

export type Mode = 'production' | 'development' | 'none'

export interface ElectronConfig {
  program?: string
  parameter?: string[]
}

export type Alias = Record<string, false | string | (string | false)[]>

export interface CeaConfig {
  assets?: string
  baseUri?: string
  alias?: Alias
  main?: string
  preload?: string
  output?: string
  root?: string
  mode?: Mode
  banner?: BannerConditions
  build?: Configuration
  electron?: ElectronConfig
  modules?: ModuleOptions
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
      assets: 'public',
      baseUri: undefined,
      root: cwd,
      alias: {},
      main: undefined,
      preload: undefined,
      electron: {
        program: undefined,
        parameter: [],
      },
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
