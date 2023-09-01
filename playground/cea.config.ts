import { defineConfig } from '@zzhaon/create-electron-app'

export default defineConfig({
  main: './app/main.ts',
  preload: './app/preload.ts',
  output: './dist/app'
})
