import { loadConfig as lc } from "c12";

export interface CeaConfig {
  main?: string
  preload?: string
  html?: string,
  output?: string
}

const CONFIG_NAME = 'cea'

export  async function loadConfig() {
  return await lc<CeaConfig>({
    cwd: process.cwd(),
    name: CONFIG_NAME,
    defaults: {
      main: undefined,
      preload: undefined,
      html: undefined,
      output: '.app'
    }
  })
}

export function defineConfig (config: CeaConfig) {
  return config
}
