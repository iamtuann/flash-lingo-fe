<template>
  <div class="min-h-screen flex flex-col">
    <div class="px-6 md:px-8 py-3 flex justify-between items-center border-b border-border">
      <div>
        <Button 
          :as="RouterLink" :to="{'name': 'TopicHome', params: {id: topicId, slug: topic?.slug || ''}}"
          variant="ghost" class="rounded-full w-10 h-10 border-2 border-border"
      >
          <ChevronLeft class="!size-6" />
        </Button>
      </div>
      <div>
        <h2 class="text-lg font-semibold ">{{ topic?.name }}</h2>
      </div>
      <div class="size-10">

      </div>
    </div>
    <div class="flex-1">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTopicStore } from '@/stores';
import { RouterLink, useRoute } from 'vue-router';
import type { Topic } from "@/types";
import { Button } from "@/components/ui/button";
import { ref } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';

const route = useRoute()
const topicStore = useTopicStore()
const topicId = ref(route.params.id as string)
const topic = ref<Topic | null>(null)

async function getTopic() {
  try {
    const res = await topicStore.getById(topicId.value)
    topic.value = res
  } catch (e) {
    console.error(e)
  }
}

getTopic()
</script>

<style scoped>

</style>