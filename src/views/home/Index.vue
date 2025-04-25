<template>
  <div class="container mt-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <TopBanner />
      <RecentTopic v-if="authStore.isAuthenticated" />
      <PopularTopic />
      <TopCreators />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores';
import RecentTopic from './RecentTopic.vue';
import PopularTopic from './PopularTopic.vue';
import TopBanner from './TopBanner.vue';
import TopCreators from './TopCreators.vue';


const authStore = useAuthStore()
</script>

<style scoped>

</style>