import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

window.emitter = mitt()

const app = createApp(App)
// app.use(router)
app.mount('#app')
