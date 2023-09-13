import { defineConfig } from 'vite'
import vuePlugin from "@vitejs/plugin-vue";
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig(() => {
    return {
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    subpage: resolve(__dirname, 'subpage.html'),
                },
            },
        },
        plugins: [vuePlugin(), UnoCSS()]
    }
})
