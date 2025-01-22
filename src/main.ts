import { createApp } from 'vue'
import router from './router';
import { createPinia } from "pinia";
import './assets/index.css'
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login';

const pinia = createPinia();

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
  });

app.mount('#app');
