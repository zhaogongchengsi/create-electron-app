import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
	extends: '@nuxt-themes/docus',
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
		},
	},
	css: [
		resolve('./assets/main.css')
	],
})
