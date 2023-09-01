import { createRequire } from 'node:module'
import type { build, createServer } from 'vite'
import type { UltimatelyCeaConfig } from './config'

const VITE_VERSION = '4.4.9'

export interface ViteModule {
  createServer: typeof createServer
  build: typeof build
}

export async function loadVite(config: UltimatelyCeaConfig): Promise<ViteModule> {
  const require = createRequire(config.root)
  const vite = require('vite')
  return vite
}
