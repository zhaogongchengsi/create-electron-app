/* eslint-disable import/default */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import type vite from 'vite'
import type electronBuilder from 'electron-builder'

export type ViteModule = typeof vite
export type ElectronBuilderModule = typeof electronBuilder

const VITE_NAME = 'vite'
const require = createRequire(fileURLToPath(import.meta.url))

export function loadVite(): ViteModule {
  return require(VITE_NAME)
}

const ELECTRON_NAME = 'electron'
export function loadElectron() {
  const electron = require(ELECTRON_NAME)
  return electron as string
}

const ELECTRON_BUILDER_NAME = 'electron-builder'
export function loadElectronBuilder(): ElectronBuilderModule {
  return require(ELECTRON_BUILDER_NAME)
}
