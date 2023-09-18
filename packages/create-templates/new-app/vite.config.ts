import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [UnoCSS(), Vue()],
})
