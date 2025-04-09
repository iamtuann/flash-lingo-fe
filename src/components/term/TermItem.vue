<template>
  <div class="relative bg-accent p-4 border text-card-foreground shadow-sm rounded-lg">
    <div class="flex flex-wrap gap-x-4 gap-y-1 flex-col sm:flex-row pb-3">
      <div class="sm:w-1/4 min-w-24 text-wrap" :class="hideTerm && 'blur-md'">
        <span class="text-xl font-semibold leading-none tracking-tight">{{ term.term || '- -' }}</span>
        <span v-if="term.pronunciation" class="text-muted-foreground text-sm ml-2">{{term.pronunciation}}</span>
      </div>
      <div class="hidden sm:block h-auto border-l-2 border-accent-foreground"></div>
      <div class="flex-1 pr-6 flex justify-between flex-wrap" :class="hideDefinition && 'blur-md'">
        <span>{{ term.definition || '' }}</span>
        <img v-if="term.imageUrl" class="w-32 h-32 object-cover rounded-md" :src="term.imageUrl" :alt="term.term">
      </div>
    </div>
    <div v-if="term.example" class="text-sm text-muted-foreground italic">
      Example: {{ term.example || '' }}
    </div>
    <TTSButton class="absolute top-2 right-2" :text="term.term" />
  </div>
</template>

<script setup lang="ts">
import type { Term } from '@/types';
import TTSButton from '@/components/tts/TTSButton.vue';


defineProps<{
  term: Term,
  hideTerm?: boolean,
  hideDefinition?: boolean,
}>()
</script>

<style scoped>

</style>