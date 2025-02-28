<template>
  <div class="h-1 bg-primary rounded-2xl" :style="`width: ${termsProcess}%`"></div>
  <div class="flex justify-center mt-2">
    <p class="px-4 py-2 bg-primary rounded-3xl leading-none">
      {{ currentIndex + '/' + terms.length }}
    </p>
  </div>
  <div class="container h-full">

    <FlipCardList :terms="terms" @update:current-index="onUpdateCurrentIndex" class="mt-14"/>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTermStore } from "@/stores";
import { useRoute } from "vue-router";
import FlipCardList from "@/components/FlipCardList.vue";
import type { Term } from "@/types";

const route = useRoute()
const termStore = useTermStore()
const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([])
const currentIndex = ref(0)
const termsProcess = computed(() => {
  if (terms.value.length == 0 || currentIndex.value == 0) {
    return 0
  } else {
    return (currentIndex.value) / terms.value.length * 100
  }
})

function onUpdateCurrentIndex(idx: number) {
  currentIndex.value = idx;
}

async function getData() {
  const res = await termStore.getAllByTopicId(topicId.value)
  terms.value = res
}

getData();
</script>

<style scoped>

</style>