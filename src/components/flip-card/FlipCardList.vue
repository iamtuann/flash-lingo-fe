<template>
  <div class="relative h-full flex flex-col items-center justify-center"
    @mousemove="handleDrag"
    @mouseup="endDrag"
    @touchmove="handleDrag"
    @touchend="endDrag"
  >
    <div class="flex justify-between items-center mb-3 w-full max-w-[600px]">
      <div class="text-red-500 font-semibold">
        <span class="inline-block size-7 text-center rounded-full border border-red-500">
          {{ unknowTerms.length }}
        </span>
        <span class="ml-2">Still lerning </span>
        <span class="text-muted-foreground" v-if="cardState.isReject"> +1 </span>
      </div>
      <div class="text-green-500 font-semibold">
        <span class="text-muted-foreground" v-if="cardState.isResolve"> +1 </span>
        <span class="mr-2"> Know</span>
        <span class="inline-block size-7 text-center rounded-full border border-green-500">
          {{ knowTerms.length }}
        </span>
      </div>
    </div>
    <div class="relative" @mousedown="startDrag" @touchstart="startDrag">
      <div
        class="origin-bottom relative z-10"
        :style="{ transform: `translate(${cardState.offsetX}px) rotate(${rotate}deg)` }"
      >
        <FlipCard
          class="w-80 h-[480px] sm:w-[420px] md:w-[580px] md:h-[380px] lg:w-[600px]"
          ref="flipCard"
          :border-opacity="borderOpacity"
          :border-color="borderColor"
          :term="props.terms[currentIndex]"
        />
      </div>
      <div class="absolute w-80 h-[480px] sm:w-[420px] md:w-[580px] md:h-[380px] lg:w-[600px] bg-accent opacity-40 inset-0 z-0 rounded-xl border-2 border-gray-600">

      </div>
    </div>
    <div class="hidden md:flex items-center justify-center gap-10 mt-10">
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
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import FlipCard from "@/components/flip-card/FlipCard.vue";
import type { Term } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-vue-next";

export interface FlipCardListProps {
  terms: Term[]
}
export type FlipCardListEmits = {
  'update:current-index': [payload: number],
  'end': [knowTerms: number[], unknowTerms: number[]]
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
  if (cardState.offsetX > threshold || cardState.isResolve) {
    return 'border-green-600'
  } else if (cardState.offsetX < -threshold || cardState.isReject) {
    return 'border-red-600'
  } else {
    return 'border-gray-600'
  }
})

onMounted(() => {
  document.addEventListener('keydown', shotcutTerm)
})
onUnmounted(() => {
  document.removeEventListener('keydown', shotcutTerm)
})

function handleRejectTerm() {
  console.log('reject');
  unknowTerms.value.push(props.terms[currentIndex.value].id as number)
  nextTerm()
}

function handleResolveTerm() {
  console.log('resolve')
  knowTerms.value.push(props.terms[currentIndex.value].id as number)
  nextTerm()
}

function nextTerm() {
  if (currentIndex.value == props.terms.length - 1) {
    // currentIndex.value = 0
    emits('update:current-index', currentIndex.value + 1)
    emits('end', knowTerms.value, unknowTerms.value)
  } else {
    currentIndex.value++;
    emits('update:current-index', currentIndex.value)
  }
}

function startDrag(event: MouseEvent | TouchEvent) {
  if (event instanceof TouchEvent) {
    cardState.startX = event.touches[0].clientX
  } else {
    cardState.startX = event.clientX
  }
  cardState.isDragging = true;
}

function handleDrag(event: MouseEvent | TouchEvent) {
  if (cardState.isDragging) {
    let deltaX = 0;
    if (event instanceof TouchEvent) {
      deltaX = event.touches[0].clientX - cardState.startX;
    } else {
      deltaX = event.clientX - cardState.startX
    }
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

function endDrag(event: MouseEvent | TouchEvent) {
  if (cardState.isDragging) {
    let deltaX = 0;
    if (event instanceof TouchEvent) {
      deltaX = event.changedTouches[0].clientX - cardState.startX;
    } else {
      deltaX = event.clientX - cardState.startX
    }
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

const shotcutTerm = (e: KeyboardEvent) => {
  if (e.code == 'ArrowRight') {
    cardState.isResolve = true
    setTimeout(() => {
      cardState.isResolve = false
      handleResolveTerm()
    }, 700);
  }
  if (e.code == 'ArrowLeft') {
    cardState.isReject = true
    setTimeout(() => {
      cardState.isReject = false
      handleRejectTerm()
    }, 700);
  }
}
</script>

<style scoped>

</style>