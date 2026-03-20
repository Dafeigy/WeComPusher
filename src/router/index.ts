import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '@/pages/HomeView.vue'
import Settings from '@/pages/SettingsView.vue'

const routes = [
  { 
    path: '/', 
    component: Home,
    name:"/"
   },
   { 
    path: '/settings', 
    component: Settings,
    name: "/settings"
   }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router