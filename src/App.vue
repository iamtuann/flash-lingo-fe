<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
  <Toaster />
  <AuthDialog />
</template>

<script setup lang="ts">
import AuthDialog from './components/AuthDialog.vue';
import { createAuthGuard } from './composable/use-auth-guard';
import { useTheme } from './composable/use-theme';
import { useAuthStore } from './stores';
import Toaster from '@/components/ui/toast/Toaster.vue'

const authStore = useAuthStore()
useTheme()
createAuthGuard()

if (authStore.isAuthenticated) {
  authStore.getProfile()
}
</script>

<style scoped>

</style>
