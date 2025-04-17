<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores';


const authStore = useAuthStore()

if (authStore.isAuthenticated) {
  authStore.getProfile()
}
</script>

<style scoped>

</style>
