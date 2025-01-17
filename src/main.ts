import { createApp } from 'vue'
import router from './router';
import { createPinia } from "pinia";
import './assets/index.css'
import App from './App.vue'

const pinia = createPinia();

const app = createApp(App)
  .use(router)
  .use(pinia);

app.mount('#app');
