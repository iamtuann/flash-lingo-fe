<template>
  <section class="grid grid-cols-12 gap-3">
    <div class="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6">

    </div>
    <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden">
      <Carousel v-bind="carouselConfig">
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[280px] h-full">
          <img class="w-full h-full object-cover object-top" src="@/assets/images/flashcard.png" alt="flashcards">
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[280px] h-full">
          <img class="w-full h-full object-cover object-top" src="@/assets/images/quiz.png" alt="quizs" />
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[280px] h-full">
          <img class="w-full h-full object-cover object-top" src="@/assets/images/tests.png" alt="tests" />
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[280px] h-full">
          <img class="w-full h-full object-cover object-top" src="@/assets/images/games.png" alt="tests" />
        </Slide>
        <Slide class="aspect-[4/5] max-h-60 md:max-h-[280px] h-full">
          <img class="w-full h-full object-cover object-top" src="@/assets/images/ai.png" alt="tests" />
        </Slide>
      </Carousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import 'vue3-carousel/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 4000,
}
</script>

<style scoped>

</style>