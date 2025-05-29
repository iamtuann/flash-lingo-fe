<template>
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h2 class="py-4 text-2xl mt-4 font-bold text-center">Games Play</h2>
      <div class="relative group">
        <Carousel ref="carouselRef" v-model="currentSlide" class="mt-4" v-bind="carouselConfig">
          <Slide v-for="(game, idx) in listGame" :key="idx">
            <div class="block py-4 px-4 w-full">
              <Card
                :style="{backgroundImage: `url(${game.backgroundImage})`}"
                class="w-full px-4 py-3 min-h-60 rounded-xl flex flex-col justify-end gap-3 bg-cover bg-no-repeat bg-top"
              >
                <div>
                  <h4 class="game-title font-semibold text-white text-shadow-lg">{{ game.title }}</h4>
                </div>
                <Button class="w-full" size="sm" @click="router.push(game.to)">
                  Play Game
                </Button>
              </Card>
            </div>
          </Slide>
        </Carousel>
        <div class="hidden group-hover:block">
          <Button 
            @click="prev" 
            class="rounded-full w-10 h-10 absolute top-[50%] left-0 sm:-left-4 z-10 translate-y-[-50%] border border-white"
          >
            <ChevronLeft />
          </Button>
          <Button 
            @click="next"
            class="rounded-full w-10 h-10 absolute top-[50%] right-0 sm:-right-4 z-10 translate-y-[-50%] border border-white"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div class="mt-6">
        <p v-for="(des, i) in currentGame.descriptions" :key="i" class="max-w-xl mt-2 mx-auto text-center text-muted-foreground">
          {{ des }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
import 'vue3-carousel/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { useTopicStore } from '@/stores';
import type { Topic } from '@/types';
import MatchCardImg from '@/assets/images/match-card.jpg'
import WordScrambleImg from '@/assets/images/word-scramble.jpg'

const route = useRoute()
const router = useRouter()
const topicStore = useTopicStore();

const topicId = ref(route.params.id as string)
const topic = ref<Topic>()

const carouselConfig = {
  itemsToShow: 1.3,
  wrapAround: true,
  mouseDrag: false,
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
const currentSlide = ref(0)

const next = () => carouselRef.value.next()
const prev = () => carouselRef.value.prev()

const currentGame = computed(() => {
  return listGame[currentSlide.value]
})


const listGame = [
  {
    title: 'Match Cards',
    icon: '',
    backgroundImage: MatchCardImg,
    to: {name: 'MatchCards', params: {id: topicId.value}},
    descriptions: ['Flip cards and match terms with their definitions. Test your memory and vocabulary knowledge.', 'Ready to play! This game uses your vocabulary terms to create a personalized experience.'],
    active: true,
    availabel: true,
  },
  {
    title: 'Word Scramble',
    icon: '',
    backgroundImage: WordScrambleImg,
    to: {name: 'WordScramble', params: {id: topicId.value}},
    descriptions: ['Catch falling words that match the given definition before they hit the ground.', 'You need at least 5 vocabulary terms to play this game.'],
    active: true,
    availabel: true,
  },
  // {
  //   title: 'Speed Vocabulary',
  //   icon: '',
  //   backgroundImage: '',
  //   to: {name: 'MatchCards', params: {id: topicId.value}},
  //   descriptions: ['Type the correct term for each definition as quickly as possible to earn points.', 'You need at least 10 vocabulary terms to play this game. Currently you have 5 terms.'],
  //   active: true,
  //   availabel: true,
  // },
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
  transform: scale(1.15);
  transition: transform .3s linear;
}
.game-title {
  text-shadow: 0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1);
}
</style>