import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/css/global.styles.css'

const app = createApp(App)

app.config.globalProperties.$baseUri = "http://127.0.0.1:8000";
app.config.globalProperties.$api = "http://127.0.0.1:8000/api";

app.use(router)
app.mount('#app')
