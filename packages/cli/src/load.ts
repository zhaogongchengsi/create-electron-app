/* eslint-disable import/default */
import { createRequire } from 'node:module'
import type vite from 'vite'
import type electronBuilder from 'electron-builder'
import type { ResolveConfig } from './config'

export type ViteModule = typeof vite
export type ElectronBuilderModule = typeof electronBuilder

const VITE_NAME = 'vite'
export function loadVite(config: ResolveConfig): ViteModule {
  const require = createRequire(config.root)
  return require(VITE_NAME)
}

const ELECTRON_NAME = 'electron'
export function loadElectron(config: ResolveConfig) {
  const require = createRequire(config.root)
  const electron = require(ELECTRON_NAME)
  return electron as string
}

const ELECTRON_BUILDER_NAME = 'electron-builder'
export function loadElectronBuilder(config: ResolveConfig): ElectronBuilderModule {
  const require = createRequire(config.root)
  return require(ELECTRON_BUILDER_NAME)
}
