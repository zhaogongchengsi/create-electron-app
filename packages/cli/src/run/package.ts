import process from 'node:process'
import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import { loadVite } from '../load'
import { getPageOutDir } from '../vite'

const BUILD_MODE = 'production'
export async function runPackage() {
  process.env.NODE_ENV = BUILD_MODE
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  const { resolveConfig } = loadVite(_config)

  const viteConfig = await resolveConfig({ root: _config.root }, 'build', 'build')
  const res = getPageOutDir(viteConfig)
  console.log(res)
}
