<template>
  <div class="flip-card text-3xl select-none" @touchstart="handlePointerDown" @touchend="handlePointerUp">
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
        <Button variant="ghost" class="w-full h-7 hover:bg-secondary" @mouseup.prevent="toggleFlipCard">
          <span class="mr-auto text-xs font-normal">Still learn <span class="tracking-widest opacity-60">	&#8592; </span></span>
          <Repeat />
          <span class="ml-auto text-xs font-normal"><span class="tracking-widest opacity-60">	&#8594; </span> Know</span>
        </Button>
      </div>
      <div class="flip-card-face back" :class="`!border-opacity-[${borderOpacity}] ${borderColor}`">
        <div></div>
        <TTSButton class="absolute top-2 right-2" :text="term.term" />
        <div class="flex-1 flex flex-col items-center justify-center gap-3">
          <p>{{ term.definition }}</p>
          <img v-if="term.imageUrl" :src="term.imageUrl" class="w-32 h-32 object-cover rounded-md" :alt="term.term">
          <span v-if="term.example" class="block text-base text-muted-foreground italic">
            &ldquo; {{ term.example }} &rdquo;
          </span>
        </div>
        <Button id="flip-btn" variant="ghost" class="w-full h-7 hover:bg-secondary font-normal text-xs" @mouseup.prevent="toggleFlipCard">
          <p>Press <span class="text-xs tracking-widest opacity-60">space</span> to flip</p>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
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
const startX = ref(0);

onMounted(() => {
  document.addEventListener('keydown', handlePressSpace)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handlePressSpace)
})

watch(() => props.term, () => {
  isResetting.value = true;
  isFlipped.value = false;
  
  setTimeout(() => {
    isResetting.value = false;
  }, 100);
})
const handlePressSpace = (e: KeyboardEvent) => {
  if (e.code == 'Space') {
    toggleFlipCard()
  }
}

const handlePointerDown = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX;
}
const handlePointerUp = (e: TouchEvent) => {
  const endX = e.changedTouches[0].clientX;
  if (startX.value - endX == 0) {
    toggleFlipCard()
  }
}

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