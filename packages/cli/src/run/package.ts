import process from 'node:process'
import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import { builder } from '../builder'

const BUILD_MODE = 'production'
export async function runPackage() {
  process.env.NODE_ENV = BUILD_MODE
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  await builder(_config)
}
