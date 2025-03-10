<template>
  <div v-if="layout == 'list'">
    List
  </div>
  <div v-else class="bg-accent border border-border rounded-lg p-3 flex items-center gap-x-3">
    <FolderIcon v-if="item.status == 1" strokeWidth="1" :size="32" />
    <FolderLockIcon v-if="item.status == 0" strokeWidth="1" :size="32" />
    <div class="flex-1">
      <p class="text-sm font-medium"> {{ item.name }} </p>
      <span class="text-xs text-secondary-foreground">{{ item.itemsNumber }} topics</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '@/types';
import { FolderIcon, FolderLockIcon } from 'lucide-vue-next';


defineProps<{
  item: Folder,
  layout?: 'grid' | 'list'
}>()
</script>

<style scoped>

</style>