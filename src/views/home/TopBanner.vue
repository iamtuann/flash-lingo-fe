<template>
  <section class="grid grid-cols-12 gap-3">
    <div v-if="authStore.user" class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-5">
      <div class="h-full flex flex-col gap-4 bg-secondary shadow-sm rounded-xl p-4 md:p-6">
        <div>
          <h3 class="text-2xl font-semibold">Study time</h3>
          <p class="text-sm text-muted-foreground">Keep going and reach your goals.</p>
        </div>
        <div class="flex-1 text-lg text-green-400">
          Today: {{ formatTime(todayStudyTime?.totalDurationSeconds) }}
        </div>
        <RouterLink :to="{name: 'UserProfile', params: {id: authStore.user?.id}}" class="flex items-center hover:text-amber-400">
          View process <ChevronRight />
        </RouterLink>
      </div>
    </div>
    <div class="hidden sm:block col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 rounded-xl">
      <Carousel v-bind="carouselConfig">
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[250px] h-full">
          <img class="h-full object-cover object-top rounded-xl" src="@/assets/images/flashcard.png" alt="flashcards">
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[250px] h-full">
          <img class="h-full object-cover object-top rounded-xl" src="@/assets/images/quiz.png" alt="quizs" />
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[250px] h-full">
          <img class="h-full object-cover object-top rounded-xl" src="@/assets/images/tests.png" alt="tests" />
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[250px] h-full">
          <img class="h-full object-cover object-top rounded-xl" src="@/assets/images/games.png" alt="tests" />
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[250px] h-full">
          <img class="h-full object-cover object-top rounded-xl" src="@/assets/images/ai.png" alt="tests" />
        </Slide>
      </Carousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { useAuthStore, useStudyStore } from '@/stores';
import type { StudyTime } from '@/types';
import { ref } from "vue"
import { ChevronRight } from 'lucide-vue-next';

const studyStore = useStudyStore()
const authStore = useAuthStore()

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 4000,
}

const todayStudyTime = ref<StudyTime | null>(null)

const formatTime = (seconds: number | null | undefined) => {
  if (!seconds) {
    return ""
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`
}

async function getProcessStudy() {
  try {
    const today = new Date()
    const res = await studyStore.getDailyStudyTime(today, today);
    todayStudyTime.value = res[0]
  } catch (e) {
    console.error(e)
  }
}
if (authStore.isAuthenticated) {
  getProcessStudy()
}
</script>

<style scoped>

</style>