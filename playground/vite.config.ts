import { defineConfig } from 'vite'
import vuePlugin from "@vitejs/plugin-vue";
import UnoCSS from 'unocss/vite'
export default defineConfig(() => {
    return {
        plugins: [vuePlugin(), UnoCSS()]
    }
})
