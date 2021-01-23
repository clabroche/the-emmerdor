import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'login', path: '/login', component: Login },
  { path: '/:pathMatch(.*)*', redirect: {name: 'home'} },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
