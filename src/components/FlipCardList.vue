<template>
  <div class="relative h-full flex flex-col items-center justify-center"
    @mousemove="handleDrag"
    @mouseup="endDrag"
    >
    <div class="flex justify-between items-center mb-3 w-[600px]">
      <div class="text-red-500 font-semibold">
        <span class="inline-block size-7 text-center rounded-full border border-red-500">
          {{ unknowTerms.length }}
        </span>
        <span class="ml-2">Still lerning</span>
      </div>
      <div class="text-green-500 font-semibold">
        <span class="mr-2">Know</span>
        <span class="inline-block size-7 text-center rounded-full border border-green-500">
          {{ knowTerms.length }}
        </span>
      </div>
    </div>
    <div class="relative" @mousedown.prevent="startDrag" >
      <div
        class="origin-bottom relative z-10"
        :style="{ transform: `translate(${cardState.offsetX}px) rotate(${rotate}deg)` }"
      >
        <FlipCard
          class="w-[600px] h-[350px]"
          ref="flipCard"
          :border-opacity="borderOpacity"
          :border-color="borderColor"
          v-bind="props.terms[currentIndex]"
        />
      </div>
      <div class="absolute w-[600px] h-[350px] bg-accent opacity-40 inset-0 z-0 rounded-xl border-2 border-gray-600">

      </div>
    </div>
    <div class="flex items-center justify-center gap-10 mt-10">
      <Button
        @click="handleRejectTerm"
        variant="outline"
        class="group size-16 p-3 rounded-full border-2 border-red-600 hover:bg-red-600 hover:scale-125 transition-all duration-100"
        :class="{'bg-red-600 scale-125': cardState.isReject}"
      >
      <XIcon class="!size-5" />
      </Button>
      <Button
        @click="handleResolveTerm"
        variant="outline"
        class="group size-16 p-3 rounded-full border-2 border-green-600 hover:bg-green-600 hover:scale-125 transition-all duration-100"
        :class="{'bg-green-600 scale-125': cardState.isResolve}"
      >
      <CheckIcon class="!size-5" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import FlipCard from "@/components/FlipCard.vue";
import type { Term } from "@/types";
import { Button } from "./ui/button";
import { CheckIcon, XIcon } from "lucide-vue-next";

export interface FlipCardListProps {
  terms: Term[]
}
export type FlipCardListEmits = {
  'update:current-index': [payload: number];
}
const props = defineProps<FlipCardListProps>()
const emits = defineEmits<FlipCardListEmits>()

const knowTerms = ref<number[]>([]);
const unknowTerms = ref<number[]>([]);
const currentIndex = ref(0);
const cardState = reactive({
  isDragging: false,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsety: 0,
  isReject: false,
  isResolve: false
})
const threshold = 80;
const maxOffset = 180;

const rotate = computed(() => {
  return 4 * cardState.offsetX / maxOffset;
})
const borderOpacity = computed(() => {
  return Math.min(1, Math.abs(cardState.offsetX) / threshold);
})
const borderColor = computed(() => {
  if (cardState.offsetX > 20) {
    return 'border-green-600'
  } else if (cardState.offsetX < -20) {
    return 'border-red-600'
  } else {
    return 'border-gray-600'
  }
})

function handleRejectTerm() {
  console.log('reject');
  unknowTerms.value.push(currentIndex.value)
  nextTerm()
}

function handleResolveTerm() {
  console.log('resolve')
  knowTerms.value.push(currentIndex.value)
  nextTerm()
}

function nextTerm() {
  if (currentIndex.value == props.terms.length - 1) {
    // currentIndex.value = 0
  } else {
    currentIndex.value++;
  }
  emits('update:current-index', currentIndex.value)
}

function startDrag(event: MouseEvent) {
  event.stopPropagation()
  cardState.isDragging = true;
  cardState.startX = event.clientX;
}

function handleDrag(event: MouseEvent) {
  if (cardState.isDragging) {
    let deltaX = event.clientX - cardState.startX;
    if (deltaX < maxOffset && deltaX > -maxOffset) {
      cardState.offsetX = deltaX
    }

    if (deltaX > threshold) {
      cardState.isResolve = true;
    } else if (deltaX < -threshold) {
      cardState.isReject = true;
    } else {
      cardState.isReject = false;
      cardState.isResolve = false;
    }
  }
}

function endDrag(event: MouseEvent) {
  if (cardState.isDragging) {
    
    const deltaX = event.clientX - cardState.startX; 

    if (deltaX > threshold) {
      handleResolveTerm()
    } else if (deltaX < -threshold) {
      handleRejectTerm()
    }
  }
  cardState.isDragging = false;
  cardState.offsetX = 0;
  cardState.isReject = false;
  cardState.isResolve = false;
}
</script>

<style scoped>

</style>