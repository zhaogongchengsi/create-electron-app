import process from 'node:process'
import { loadConfig } from '../config'
import { loadVite } from '../load'
import { getPageOutDir } from '../vite'

const BUILD_MODE = 'production'
export async function runPackage() {
  process.env.NODE_ENV = BUILD_MODE
  const config = await loadConfig()

  const { resolveConfig } = loadVite(config)

  const viteConfig = await resolveConfig({ root: config.root }, 'build', 'build')
  const res = getPageOutDir(viteConfig)
}
