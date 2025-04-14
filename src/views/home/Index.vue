<template>
  <div class="container mt-4">
    <div class="max-w-6xl mx-auto">
      <TopBanner />
      <RecentTopic class="mt-6" v-if="authStore.isAuthenticated" />
      <PopularTopic class="mt-6" />
      <TopCreators class="mt-6" />
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