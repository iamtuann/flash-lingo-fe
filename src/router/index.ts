import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LearnLayout from "@/layouts/LearnLayout.vue";
import SettingLayout from "@/layouts/SettingLayout.vue";
import { useAuthStore } from "@/stores";
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
    path: "/profile/:id",
    component: () => import('@/views/profile/Profile.vue'),
    children: [
      {
        path: "",
        name: "UserProfile",
        component: () => import('@/views/profile/ProfileOverview.vue'),
      },
      {
        path: "topics",
        name: "UserTopics",
        component: () => import('@/views/profile/ProfileTopics.vue'),
      },
      {
        path: "folder",
        name: "UserFolders",
        component: () => import('@/views/profile/ProfileFolders.vue'),
      },
    ],
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
        meta: { layout: DefaultLayout, requiresAuth: true }
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
        meta: { layout: LearnLayout, requiresAuth: true }
      },
      {
        path: "test/result",
        name: 'TestResult',
        component: () => import('@/views/test/TestResult.vue'),
        meta: { layout: LearnLayout, requiresAuth: true }
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
        path: "recent-learning",
        name: 'LibraryRecentLearning',
        component: () => import('@/views/library/LibraryRecent.vue')
      },
      {
        path: "folders",
        name: 'LibraryFolders',
        component: () => import('@/views/library/LibraryFolders.vue')
      },
    ],
    meta: { layout: DefaultLayout, requiresAuth: true }
  },
  {
    path: "/search",
    component: () => import('@/views/search/Index.vue'),
    children: [
      // {
      //   path: "",
      //   alias: "all",
      //   name: 'SearchAll',
      //   component: () => import('@/views/search/SearchAll.vue')
      // },
      {
        path: "topics",
        name: 'SearchTopic',
        component: () => import('@/views/search/SearchTopic.vue')
      },
      {
        path: "users",
        name: 'SearchUser',
        component: () => import('@/views/search/SearchUser.vue')
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
  {
    path: "/ai-supporter",
    name: "AISupporter",
    component: () => import('@/views/AI-supporter/Index.vue'),
    meta: { layout: DefaultLayout, requiresAuth: true },
  },
  {
    path: "/settings",
    component: {render: () => h(RouterView)},
    meta: { layout: SettingLayout, requiresAuth: true },
    children: [
      {
        path: "",
        alias: "profile",
        name: 'SettingProfile',
        component: () => import('@/views/setting/Profile.vue')
      },
      {
        path: "account",
        name: 'SettingAccount',
        component: () => import('@/views/setting/Account.vue')
      },
      {
        path: "appearance",
        name: 'SettingAppearance',
        component: () => import('@/views/setting/Appearance.vue')
      },
    ]
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import('@/views/403Page.vue'),
    meta: { layout: DefaultLayout },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import('@/views/404Page.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const isRequireAuth = to.meta.requiresAuth
  const { isAuthenticated } = useAuthStore()

  if ((to.name == "Login" || to.name == "Signup") && isAuthenticated) {
    next({ name: 'Home' })
  }
  if (!isAuthenticated && (to.name !== "Login" && to.name != "Signup") && isRequireAuth) {
    return next({name: 'Login'})
  }
  next();
})

export default router;