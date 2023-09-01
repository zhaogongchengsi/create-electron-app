import { createRequire } from 'node:module'
import type { build, createServer } from 'vite'
import type { UltimatelyCeaConfig } from './config'

const VITE_VERSION = '4.4.9'

export interface ViteModule {
  createServer: typeof createServer
  build: typeof build
}

export function loadVite(config: UltimatelyCeaConfig): ViteModule {
  const require = createRequire(config.root)
  const vite = require('vite')
  return vite
}

export function loadElectron(config: UltimatelyCeaConfig) {
  const require = createRequire(config.root)
  const electron = require('electron')
  return electron as string
}
