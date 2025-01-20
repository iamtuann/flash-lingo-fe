import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    alias: "/",
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: "/signup",
    name: 'Signup',
    component: () => import('@/views/Signup.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;