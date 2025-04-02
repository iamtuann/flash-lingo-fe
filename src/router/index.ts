import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LearnLayout from "@/layouts/LearnLayout.vue";
import { h } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";

const routes = [
  {
    path: "",
    alias: "/",
    name: 'Home',
    component: () => import('@/views/home/Index.vue'),
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
    path: "/topic-home/:id(\\d+)/:slug?",
    name: 'TopicHome',
    component: () => import('@/views/topic/TopicHome.vue'),
    meta: { layout: DefaultLayout }
  },
  {
    path: "/topic/:id(\\d+)",
    redirect: (to: any) => {
      return {name: 'TopicHome', params: {id: to.params.id}}
    },
    component: {render: () => h(RouterView)},
    children: [
      {
        path: "edit",
        name: 'TopicEdit',
        component: () => import('@/views/topic/TopicEdit.vue'),
        meta: { layout: DefaultLayout }
      },
      {
        path: "flashcards",
        name: 'TopicFlashcards',
        component: () => import('@/views/topic/TopicFlashcard.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "quiz/config",
        name: 'QuizConfig',
        component: () => import('@/views/quiz/QuizConfig.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "quiz/session",
        alias: 'quiz',
        name: 'QuizSession',
        component: () => import('@/views/quiz/QuizSession.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "test",
        name: 'TopicTest',
        component: () => import('@/views/test/Test.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "test/result",
        name: 'TestResult',
        component: () => import('@/views/test/TestResult.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "games",
        name: 'GameBar',
        component: () => import('@/views/game/GameBar.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "games/match-cards",
        name: 'MatchCards',
        component: () => import('@/views/game/MatchCards.vue'),
        meta: { layout: LearnLayout }
      },
      {
        path: "games/word-scramble",
        name: 'WordScramble',
        component: () => import('@/views/game/GameWordScramble.vue'),
        meta: { layout: LearnLayout }
      },
    ]
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
  {
    path: "/folders/:id(\\d+)/:slug?",
    name: "FolderTopics",
    component: () => import('@/views/folder/FolderTopics.vue'),
    meta: { layout: DefaultLayout },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;