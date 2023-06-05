import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

window.addEventListener('load', async () => {
  const response = await fetch('/api/nihao')
  const json = await response.json()
  console.log('nihao json:', json)
  console.log(  json.message)
})
