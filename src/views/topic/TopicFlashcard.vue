<template>
  <div class="h-1 bg-primary rounded-2xl" :style="`width: ${termsProcess}%`"></div>
  <div class="flex justify-center mt-2">
    <p v-show="currentIndex < learningTerms.length" class="px-4 py-2 bg-primary rounded-3xl leading-none">
      {{ (currentIndex + 1) + '/' + learningTerms.length }}
    </p>
  </div>
  <div class="overflow-hidden pb-10">
    <div class="container h-full mt-9 md:mt-14">
      <FlipCardList 
        v-if="!isLoading && currentIndex < learningTerms.length"
        :terms="learningTerms" 
        @update:current-index="onUpdateCurrentIndex"
        @end="onEndList"
      />
      <div v-show="isLoading" class="h-full flex flex-col items-center justify-center mt-16">
        <div class="flex justify-between w-[600px] mb-3">
          <Skeleton class="w-20 h-7" />
          <Skeleton class="w-20 h-7" />
        </div>
        <Skeleton class="w-80 h-[300px] sm:w-[420px] md:w-[580px] md:h-[350px] lg:w-[600px] rounded-xl" />
      </div>
      <TermStatistic 
        v-show="!isLoading && currentIndex == learningTerms.length"
        :total-term="terms.length"
        :know-term="knowTermIds.length"
        :unknow-term="unknowTermIds.length"
      >
        <div class="grid gap-4">
          <h4 class="text-xl font-semibold">Continue options</h4>
          <Button class="h-14 text-base" v-if="unknowTermIds.length != 0" @click="continueLearning">
            Continue with {{ unknowTermIds.length }} still learning 
          </Button>
          <Button variant="outline" class="h-14 text-base" @click="restartLearning">
            Restart Flashcards
          </Button>
        </div>
      </TermStatistic>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore, useTermStore } from "@/stores";
import { useRoute } from "vue-router";
import FlipCardList from "@/components/flip-card/FlipCardList.vue";
import type { Term } from "@/types";
import TermStatistic from "@/components/term/TermStatistic.vue";
import { Button } from "@/components/ui/button";
import { useTopicLearningStore } from "@/stores/topic-learning.store";
import { Skeleton } from "@/components/ui/skeleton";

const route = useRoute()
const termStore = useTermStore()
const topicLearningStore = useTopicLearningStore()
const authStore = useAuthStore();
const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([])
const learningTerms = ref<Term[]>([])
const knowTermIds = ref<number[]>([])
const unknowTermIds = ref<number[]>([])
const currentIndex = ref(0)
const isLoading = ref(false);

const termsProcess = computed(() => {
  if (learningTerms.value.length == 0 || currentIndex.value == 0) {
    return 0
  } else {
    return (currentIndex.value) / learningTerms.value.length * 100
  }
})

function onUpdateCurrentIndex(idx: number) {
  currentIndex.value = idx;
}

function onEndList(knowTerms: number[], unknowTerms: number[]) {
  knowTermIds.value = knowTerms;
  unknowTermIds.value = unknowTerms;
  if (authStore.isAuthenticated) {
    topicLearningStore.saveTopicLearning({
      topicId: topicId.value,
      termLearningIds: unknowTermIds.value
    })
  }
}

function continueLearning() {
  const newListTerm = filterTerm(terms.value, unknowTermIds.value)
  learningTerms.value = newListTerm;
  currentIndex.value = 0;
}

function restartLearning() {
  learningTerms.value = terms.value;
  currentIndex.value = 0;
}

function filterTerm(terms: Term[], learningIds: number[] | null): Term[] {
  if (!learningIds) {
    return terms;
  } else {
    const ids = new Set(learningIds)
    return terms.filter(term => term.id && ids.has(term.id as number))
  }
}

async function getData() {
  try {
    isLoading.value = true
    const res = await Promise.allSettled([
      termStore.getAllByTopicId(topicId.value),
      topicLearningStore.getTopicLearning(topicId.value, authStore.isAuthenticated)
    ])
    if (res[0].status === 'fulfilled') {
      terms.value = res[0].value
    }
    if (res[1].status === 'fulfilled') {
      const termLearningIds = res[1].value.termLearningIds?.length > 0 ? res[1].value.termLearningIds : null
      learningTerms.value = filterTerm(terms.value, termLearningIds)
    } else {
      learningTerms.value = [...terms.value]
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false
  }
}

getData();
</script>

<style scoped>

</style>