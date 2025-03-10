import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LearnLayout from "@/layouts/LearnLayout.vue";
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
    path: "/flashcards-home/:id/:slug?",
    name: 'FlashcardsHome',
    component: () => import('@/views/flashcard/FlashcardsHome.vue'),
    meta: { layout: DefaultLayout }
  },
  {
    path: "/learn/:id/flashcards",
    name: 'FlashcardsLearn',
    component: () => import('@/views/flashcard/FlashcardsLearn.vue'),
    meta: { layout: LearnLayout }
  },
  {
    path: "/library",
    component: () => import('@/views/library/LibraryHome.vue'),
    children: [
      {
        path: "",
        alias: "topics",
        name: 'LibraryFlashcards',
        component: () => import('@/views/library/LibraryTopics.vue')
      },
      {
        path: "folders",
        name: 'LibraryFolders',
        component: () => import('@/views/library/LibraryFolders.vue')
      },
    ],
    meta: { layout: DefaultLayout }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;