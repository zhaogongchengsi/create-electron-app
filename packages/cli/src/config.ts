import process from 'node:process'
import { loadConfig as lc } from 'c12'

type Mode = 'production' | 'development' | 'none'

export interface CeaConfig {
  main?: string
  preload?: string
  html?: string
  output?: string
  root?: string
  mode: Mode
}

const CONFIG_NAME = 'cea'

export async function loadConfig() {
  const cwd = process.cwd()
  return await lc<CeaConfig>({
    cwd,
    name: CONFIG_NAME,
    defaults: {
      root: cwd,
      main: undefined,
      preload: undefined,
      html: undefined,
      output: '.app',
      mode: 'production',
    },
  })
}

export function defineConfig(config: CeaConfig) {
  return config
}
