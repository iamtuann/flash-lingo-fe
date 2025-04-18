<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
  <Toaster />
</template>

<script setup lang="ts">
import { useAuthStore } from './stores';
import Toaster from '@/components/ui/toast/Toaster.vue'

const authStore = useAuthStore()

if (authStore.isAuthenticated) {
  authStore.getProfile()
}
</script>

<style scoped>

</style>
