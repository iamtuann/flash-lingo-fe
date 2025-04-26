<template>
  <div class="grid grid-cols-12 mt-6 gap-4">
    <div class="col-span-12 md:col-span-8 bg-secondary p-4 md:p-4 rounded-lg">
      <p class="text-center mb-3 text-muted-foreground">Study time in the 7 days ago</p>
      <StudyTimeChart :user-id="userId" class="max-h-56" />
    </div>
    <div class="col-span-12 sm:col-span-6 md:col-span-4 bg-secondary p-4 rounded-lg flex flex-col gap-4 justify-center items-center text-lg">
      <p>Number of Topic</p>
      <span>{{ user?.topicsNumber || 0 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import StudyTimeChart from '@/components/user/StudyTimeChart.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { User } from '@/types';

defineProps<{user: User}>()

const route = useRoute()
const userId = computed<string>(() => route.params.id as string)

</script>

<style scoped>

</style>