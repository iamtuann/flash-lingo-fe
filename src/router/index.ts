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
    path: "/flashcards/:id/edit",
    name: 'EditFlashcards',
    component: () => import('@/views/flashcard/EditFlashcards.vue'),
    meta: { layout: DefaultLayout }
  },
  {
    path: "/flashcards/:id/:slug",
    name: 'FlashcardsHome',
    component: () => import('@/views/flashcard/FlashcardsHome.vue'),
    meta: { layout: DefaultLayout }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;