<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'


const sidebarNavItems = [
  {
    title: 'Profile',
    link: {name: 'SettingProfile'},
  },
  {
    title: 'Account',
    link: {name: 'SettingAccount'},
  },
  {
    title: 'Appearance',
    link: {name: 'SettingAppearance'},
  },
]
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <Button
      v-for="item in sidebarNavItems"
      :key="item.title"
      :as="RouterLink"
      :to="item.link"
      variant="ghost"
      class="w-full text-left justify-start"
      exact-active-class="bg-muted hover:bg-muted"
    >
      {{ item.title }}
    </Button>
  </nav>
</template>