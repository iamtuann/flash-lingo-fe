<template>
  <div v-if="layout == 'list'">
    Topic
  </div>
  <div v-else class="border border-border bg-accent rounded-md py-3 px-3">
    <div class="flex items-center">
      <p class="text-xl font-medium">{{ topic.name }} <span v-if="topic.status == 2">(Draft)</span></p>
      
      <span v-if="topic.status == 0" class="ml-2">
        <Lock :size="12" />
      </span>
    </div>
    <span class="text-sm">{{ topic.termsNumber }} terms</span>
    <div class="mt-1">
      <AvatarUser :user="topic.createdBy" size="5" />
      <span class="text-xs ml-2">{{ topic.createdBy.firstName +' '+ topic.createdBy.lastName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AvatarUser } from "@/components/ui/avatar";
import type { Topic } from '@/types';
import { Lock } from 'lucide-vue-next';

defineProps<{
  topic: Topic,
  layout?: 'list' | 'grid'
}>()
</script>

<style scoped>

</style>