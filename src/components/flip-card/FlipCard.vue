<template>
  <div class="flip-card text-2xl">
    <div class="flip-card-inner" :class="{ flipped: isFlipped }">
      <div class="flip-card-face" :class="`!border-opacity-[${borderOpacity}] ${borderColor}`">
        <div></div>
        
        <div class="flex-1 flex items-center justify-center">
          <h3>{{ term }}</h3>
        </div>
        <!-- <div class="py-1 w-full text-sm bg-[#a8b1ff]">
          Click on the card to flip
        </div> -->
        <Button variant="ghost" @click.stop="toggleFlipCard">
          <Repeat />
        </Button>
      </div>
      <div class="flip-card-face back" :class="`!border-opacity-[${borderOpacity}] ${borderColor}`">
        <div></div>
        <div class="flex-1 flex items-center justify-center">
          <p>{{ definition }}</p>
        </div>
        <Button variant="ghost" class="rounded-full" @click.stop="toggleFlipCard">
          <Repeat />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Term } from "@/types";
import { Button } from "../ui/button";
import { Repeat } from "lucide-vue-next";

withDefaults(defineProps<Term & {
  borderColor?: string,
  borderOpacity?: number
}>(), {
  borderColor: 'border-gray-600',
  borderOpacity: 1
})


const isFlipped = ref(false);

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