import { createApp } from 'vue'
import App from './SubApp.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

const app = createApp(App)

app.mount('#app')