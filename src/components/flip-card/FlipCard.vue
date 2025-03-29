<template>
  <div class="flip-card text-3xl" >
    <div class="flip-card-inner" :class="{ flipped: isFlipped, 'no-transition': isResetting }">
      <div class="flip-card-face" :class="`!border-opacity-[${borderOpacity}] ${borderColor}`">
        <div></div>
        <TTSButton class="absolute top-2 right-2" :text="term.term" />
        <div class="flex-1 flex flex-col items-center justify-center">
          <h3>{{ term.term }}</h3>
          <span v-if="term.pronunciation" class="block text-base text-muted-foreground mt-2">
            {{ term.pronunciation }}
          </span>
        </div>
        <Button variant="ghost" @click.stop="toggleFlipCard">
          <Repeat />
        </Button>
      </div>
      <div class="flip-card-face back" :class="`!border-opacity-[${borderOpacity}] ${borderColor}`">
        <div></div>
        <TTSButton class="absolute top-2 right-2" :text="term.term" />
        <div class="flex-1 flex flex-col items-center justify-center">
          <p>{{ term.definition }}</p>
          <span v-if="term.example" class="block text-base text-muted-foreground mt-3 italic">
            &ldquo; {{ term.example }} &rdquo;
          </span>
        </div>
        <Button id="flip-btn" variant="ghost" class="rounded-full" @click.stop="toggleFlipCard">
          <Repeat />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Term } from "@/types";
import { Button } from "../ui/button";
import { Repeat } from "lucide-vue-next";
import TTSButton from '@/components/tts/TTSButton.vue';

const props = withDefaults(defineProps<{
  term: Term,
  borderColor?: string,
  borderOpacity?: number
}>(), {
  borderColor: 'border-gray-600',
  borderOpacity: 1
})
const isFlipped = ref(false);
const isResetting = ref(false)


watch(() => props.term, () => {
  isResetting.value = true;
  isFlipped.value = false;
  
  setTimeout(() => {
    isResetting.value = false;
  }, 100);
})

function toggleFlipCard() {
  isFlipped.value = !isFlipped.value
}
</script>

<style scoped>
.flip-card {
  perspective: 1000px;
  min-width: 300px;
  min-height: 300px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.flip-card-inner.no-transition {
  transition: none;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-face {
  backface-visibility: hidden;
  @apply absolute w-full h-full flex flex-col items-center justify-center bg-accent rounded-xl border-[3px] overflow-hidden
}
.flip-card-face.back {
  transform: rotateY(180deg);
}
</style>