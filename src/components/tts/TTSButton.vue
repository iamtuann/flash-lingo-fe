<template>
  <div :class="cn(props.class)">
    <Button
      id="tts-button"
      variant="ghost" size="icon"
      class="hover:bg-secondary rounded-full"
      @pointerdown.stop="playAudio"
    >
      <Volume2 class="h-4 w-4" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-vue-next';

const props = defineProps<{
  text: string,
  lang?: string,
  class?: HTMLAttributes['class']
}>()

const baseUrl = import.meta.env.VITE_APP_BASE_URL

function playAudio() {
  const audio = new Audio(`${baseUrl}/tts/speech?text=${props.text}`);
  audio.play();
}

</script>

<style lang="scss" scoped>

</style>