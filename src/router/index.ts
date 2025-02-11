import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    alias: "/",
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { layout: DefaultLayout }
  },
  {
    path: "/signup",
    name: 'Signup',
    component: () => import('@/views/Signup.vue')
  },
  {
    path: "/login",
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: "/flashcards/:id/:slug",
    name: 'EditFlashcardTopic',
    component: () => import('@/views/EditFlashcardTopic.vue'),
    meta: { layout: DefaultLayout }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;