import process from 'node:process'
import { loadConfig } from '../config'
import { loadVite } from '../load'
import { getPageOutDir } from '../vite'
import { builder } from '../builder'

const BUILD_MODE = 'production'
export async function runPreview() {
  process.env.NODE_ENV = BUILD_MODE
  const config = await loadConfig()

  await builder(config)
  // const { resolveConfig } = loadVite(config)

  // const viteConfig = await resolveConfig({ root: config.root }, 'build', 'build')
  // const res = getPageOutDir(viteConfig)
}
