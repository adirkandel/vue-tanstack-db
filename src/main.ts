import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import Home from './views/Home.vue'
import Assignees from './views/Assignees.vue'
import './app.css'

// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/assignees', component: Assignees }
  ]
})

// Create Vue app
const app = createApp(App)

// Configure PrimeVue in unstyled mode for Volt compatibility
app.use(PrimeVue, {
  unstyled: true
})

// Configure router
app.use(router)

// Mount app
app.mount('#app')
