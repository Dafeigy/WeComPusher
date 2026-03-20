import { createApp } from "vue";
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from "./pages/HomeView.vue";
import AboutView from "./pages/AboutView.vue";

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
//   { path: '/settings', component: AboutView },
//   { path: '/manage', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
import App from "./App.vue";

const app = createApp(App)
app.use(router)
app.mount('#app')
