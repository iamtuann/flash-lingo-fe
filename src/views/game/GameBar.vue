<template>
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h2 class="py-4 text-2xl mt-4 text-center">Games Play</h2>
      <div class="relative">
        <Carousel ref="carouselRef" v-model="currentSlide" class="mt-4" v-bind="carouselConfig">
          <Slide v-for="(game, idx) in listGame" :key="idx">
            <div class="block py-4 px-4 w-full">
              <Card class="w-full px-4 py-3">
                <div>{{ game.title }}</div>
                <Button class="w-full " size="sm" @click="router.push(game.to)">
                  Play Game
                </Button>
              </Card>
            </div>
          </Slide>
        </Carousel>
        <div>
          <Button variant="ghost" size="lg" class="rounded-full absolute">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="lg" class="rounded-full">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import 'vue3-carousel/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { useTopicStore } from '@/stores';
import type { Topic } from '@/types';

const route = useRoute()
const router = useRouter()
const topicStore = useTopicStore();

const topicId = ref(route.params.id as string)
const topic = ref<Topic>()

const carouselConfig = {
  itemsToShow: 1.3,
  wrapAround: true,
  gap: 4,
  breakpoints: {
    448: {
      itemsToShow: 1.6,
      gap: 8
    },
    576: {
      itemsToShow: 1.8,
      gap: 12
    },
    672: {
      itemsToShow: 2.4,
      gap: 24
    },
  }
}

const carouselRef = ref()
const currentSlide = ref(1)

const next = () => carouselRef.value.next()
const prev = () => carouselRef.value.prev()


const listGame = [
  {
    title: 'Match Cards',
    icon: '',
    backgroundImage: '',
    to: {name: 'MatchCards', params: {id: topicId.value}},
    description: ['Flip cards and match terms with their definitions. Test your memory and vocabulary knowledge.', 'Ready to play! This game uses your vocabulary terms to create a personalized experience.'],
    active: true,
    availabel: true,
  },
  {
    title: 'Word Scramble',
    icon: '',
    backgroundImage: '',
    to: {name: 'WordScramble', params: {id: topicId.value}},
    description: ['Catch falling words that match the given definition before they hit the ground.', 'You need at least 8 vocabulary terms to play this game. Currently you have 5 terms.'],
    active: true,
    availabel: true,
  },
  {
    title: 'Speed Vocabulary',
    icon: '',
    backgroundImage: '',
    to: {name: 'MatchCards', params: {id: topicId.value}},
    description: ['Type the correct term for each definition as quickly as possible to earn points.', 'You need at least 10 vocabulary terms to play this game. Currently you have 5 terms.'],
    active: true,
    availabel: true,
  },
]

async function getData() {
  const res = await topicStore.getById(topicId.value)
  topic.value = res
}
getData()
</script>

<style scoped>
.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide {
  opacity: 0.7;
  transition: transform .3s linear;
}
.carousel__slide--active {
  opacity: 1;
  transform: scale(1.2);
  transition: transform .3s linear;
}
</style>