<template>
  <div class="relative bg-accent px-4 pt-4 py-2 border text-card-foreground shadow-sm rounded-lg">
    <div class="flex flex-wrap gap-x-4 gap-y-1 flex-col sm:flex-row">
      <div class="sm:w-1/4 min-w-24 text-wrap" :class="hideTerm && 'blur-md'">
        <p class="text-xl font-semibold leading-none tracking-tight">
          {{ term.term || '- -' }}
        </p>
        <span v-if="term.pronunciation" class="text-muted-foreground font-medium text-sm">{{term.pronunciation}}</span>
      </div>
      <div class="hidden sm:block h-auto border-l-2 border-accent-foreground"></div>
      <div class="flex-1 pr-6 flex justify-between flex-wrap" :class="hideDefinition && 'blur-md'">
        <span>{{ term.definition || '' }}</span>
        <img v-if="term.imageUrl" class="w-32 h-32 object-cover rounded-md" :src="term.imageUrl" :alt="term.term">
      </div>
    </div>
    <div v-if="term.example" class="text-sm text-muted-foreground italic mt-3">
      Example: {{ term.example || '' }}
    </div>
    <div v-if="term.synonyms && term.synonyms.length > 0" class="text-sm italic text-muted-foreground capitalize mt-1">
      Synonyms: <span class="text-teal-600 dark:text-teal-400">{{ term.synonyms.join(', ') }}</span>
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