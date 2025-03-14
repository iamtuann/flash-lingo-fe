<template>
  <div>
    <h2 class="font-bold text-3xl py-3 mt-5">
      Great! You are improving. Let's continue!
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 mt-10 gap-6">
      <div>
        <h4 class="text-xl font-semibold mb-4">Your progress</h4>
        <div class="h-6 rounded-xl bg-accent overflow-hidden relative">
          <div class="h-full bg-green-500 rounded-xl transition-all duration-1000 origin-left w-0"
          :style="`width: ${termsProcess}%`"></div>
          <span class="text-white font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {{ termsProcess }}%
          </span>
        </div>
        <div class="mt-5 max-w-60 flex flex-col gap-3 font-semibold">
          <div class="flex justify-between items-center ">
            <span>Know</span>
            <span>{{ knowTerm }}</span>
          </div>
          <div class="flex justify-between items-center ">
            <span>Still learning</span>
            <span>{{ unknowTerm }}</span>
          </div>
        </div>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface TermStatisticProps {
  totalTerm: number,
  knowTerm: number,
  unknowTerm: number
}
const props = defineProps<TermStatisticProps>()

const termsProcess = computed(() => {
  if (!props.totalTerm && !props.unknowTerm) {
    return 0;
  } else {
    return 100 - Math.floor(props.unknowTerm / props.totalTerm * 100)
  }
})
</script>

<style scoped>

</style>