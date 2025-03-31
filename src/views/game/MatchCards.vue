<template>
  <div class="px-3 max-w-4xl mx-auto md:px-2">
    <div v-if="isLoading" class="flex flex-col items-center mt-10">
      <div class="min-h-24"><GameLoading /></div>
      <div class="text-lg">Setting Game...</div>
    </div>
    <template v-else-if="isGameCompleted">
      <div class="p-8 text-center mb-8">
        <div class="flex justify-center mb-4">
          <TrophyIcon class="h-16 w-16 text-yellow-500" />
        </div>
        <h2 class="text-2xl font-bold mb-2">Congratulations!</h2>
        <p class="text-lg mb-4">You've completed the Match Cards game!</p>
        <div class="space-y-2">
          <div class="text-left text-muted-foreground font-semibold">Top ranking</div>
          <Card v-for="(rank, idx) in ranking" :key="idx"
            class="py-3 px-4 flex items-center border-2"
            :class="{
              'border-yellow-500': idx == 0, 'border-gray-300': idx == 1, 'border-orange-800': idx == 2,
            }"
          >
            <div>
              {{ rank.user ? rank.user.firstName + ' ' + rank.user.lastName : 'You' }}
            </div>
            <div class="flex-1"></div>
            <div>{{ milisecondToSecond(rank.time) }}</div>
          </Card>
        </div>

        <div class="mt-6 flex justify-center">
          <Button @click="initialGame(terms, TERM_COUNT)" class="flex items-center gap-1">
            <RotateCcw class="h-4 w-4" /> Play Again
          </Button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center items-center py-4">
        <span>{{ milisecondToSecond(elapsedTime) }}</span>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
        <div
          v-for="card in cards" :key="card.content"
          class="aspect-[3/2] md:aspect-[4/3] cursor-pointer"
          @click="handleSelectCard(card)"
        >
          <Card 
            class="bg-accent flex items-center justify-center h-full text-accent-foreground select-none transition-colors"
            :class="{'bg-primary text-primary-foreground': card.isSelected, 'hidden': card.isMatched}"
          >
            {{ card.content }}
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useGameScoreStore, useTermStore } from '@/stores';
import { GameType, type Score, type Term } from '@/types';
import { onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card } from '@/components/ui/card'
import { milisecondToSecond } from '@/utils';
import { RotateCcw, TrophyIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import GameLoading from './GameLoading.vue';

interface Card {
  content: string,
  type: 'term' | 'definition',
  termId: string | number,
  isSelected: boolean,
  isMatched: boolean,
}

const route = useRoute()
const router = useRouter()
const termStore = useTermStore()
const gameScoreStore = useGameScoreStore();
const TERM_COUNT = 6;

const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([])
const cards = ref<Card[]>([])
const ranking = ref<Score[]>([])
const isLoading = ref(true)

const activeCards = ref<Card[]>([])
const matched = ref(0)
const elapsedTime = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
const isGameCompleted = ref(false)

const handleSelectCard = (card: Card) => {
  if (card.isMatched) return
  if (activeCards.value.length === 2)  return

  // Check if the card is already active
  if (card.isSelected) {
    cards.value = cards.value.map(c => c.content == card.content ? {...c, isSelected: false} : c)
    activeCards.value = activeCards.value.filter(c => c.content != card.content)
    return
  }
  //active card
  cards.value = cards.value.map(c => c.content == card.content ? {...c, isSelected: true} : c)
  activeCards.value = [...activeCards.value, card]
}

watch(activeCards, (actives) => {
  if (actives.length < 2) return
  const [firstCard, secondCard] = actives
  if (firstCard.termId === secondCard.termId && firstCard.type !== secondCard.type) {
    // Match found
    cards.value = cards.value.map((card) =>
      card.content === firstCard.content || card.content === secondCard.content
        ? { ...card, isMatched: true, isSelected: false }
        : card,
    ),
    matched.value += 1
    activeCards.value = []
    if (matched.value == TERM_COUNT) {
      handleGameComplete()
    }
  } else {
    // No match, reset active cards after a delay
    setTimeout(() => {
      cards.value = cards.value.map((card) =>
          card.content === firstCard.content || card.content === secondCard.content ? { ...card, isSelected: false } : card,
        ),
      activeCards.value = []
      elapsedTime.value += 1000
    }, 200)
  }
})

async function handleGameComplete() {
  if (timer) clearInterval(timer)
  isGameCompleted.value = true
  await gameScoreStore.saveScore(topicId.value, GameType.MatchCards, elapsedTime.value)
  ranking.value = await gameScoreStore.getTopScores(topicId.value, GameType.MatchCards)
}

function initialGame(terms: Term[], count: number) {
  const shuffledTerm = [...terms].sort(() => Math.random() - 0.5)
  const selectedTerm = shuffledTerm.slice(0, count)

  const cardPairs: Card[] = []
  selectedTerm.forEach(term => {
    cardPairs.push({
      content: term.term,
      type: 'term',
      termId: term.id as string,
      isSelected: false,
      isMatched: false
    })

    cardPairs.push({
      content: term.definition,
      type: 'definition',
      termId: term.id as string,
      isSelected: false,
      isMatched: false
    })
  })

  cards.value = [...cardPairs].sort(() => Math.random() - 0.5)
  matched.value = 0
  elapsedTime.value = 0;
  isGameCompleted.value = false
  activeCards.value = []
  startTimer()
}

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    elapsedTime.value += 100
  }, 100)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function getData() {
  try {
    const res = await termStore.getAllByTopicId(topicId.value)
    if (res.length < TERM_COUNT) {
      router.replace({name: 'GameBar', params: {id: topicId.value}})
    }
    terms.value = res
    initialGame(terms.value, TERM_COUNT)
    isLoading.value = false
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
}

getData()
</script>

<style scoped>

</style>