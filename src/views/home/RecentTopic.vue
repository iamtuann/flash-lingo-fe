<template>
  <section v-if="!isLoading && topics.length > 0">
    <h3 class="font-semibold text-lg mb-3">Recents learning</h3>
    <TopicGroupSkeleton v-if="isLoading" />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
      <template v-for="item in topics" :key="item.id">
        <TopicItem :to="{name: 'TopicHome', params: {id: item.id, slug: item.slug}}" :topic="item" layout="grid" />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TopicGroupSkeleton, TopicItem } from '@/components/topic';
import { useUserStore } from '@/stores';
import type { Topic } from '@/types';
import { ref } from 'vue';

const userStore = useUserStore()
const isLoading = ref(true)
const topics = ref<Topic[]>([])

async function getData() {
  try {
    const res = await userStore.getRecentTopics("", 1, 4);
    topics.value = res.content
    isLoading.value = false
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
}

getData()

</script>

<style scoped>

</style>