import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
	extends: '@nuxt-themes/docus',
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
			meta: [
				{ name: 'description', content: 'Auxiliary development of electron app' },
				{ name: 'keywords', content: 'vite, electron, rspack, webpack, cli' }
			],
		},
	},
	css: [
		resolve('./assets/main.css')
	],
})
