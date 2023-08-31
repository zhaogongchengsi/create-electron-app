import { defineConfig } from '@zzhaon/create-electron-app'

export default defineConfig({
	mode: 'development',
	main: './app/main.ts',
	preload: './app/preload.ts'
})
