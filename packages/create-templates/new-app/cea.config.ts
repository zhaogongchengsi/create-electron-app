import { defineConfig } from '@zzhaon/create-electron-app'
import { resolve } from 'path'

export default defineConfig({
  main: './app/index.ts',
  preload: './app/preload.ts',
  alias: {
    "~": resolve(__dirname, './app')
  }
})
