<template>
  <div class="px-3 max-w-4xl mx-auto md:px-2">
    <div v-if="isLoading" class="flex flex-col items-center mt-10">
      <div class="min-h-24"><GameLoading /></div>
      <div class="text-lg">Setting Game...</div>
    </div>
    <GameResult
      v-else-if="isGameCompleted"
      :game-type="GameType.MatchCards"
      name="Match Cards"
      :time="stopwatch.elapsedTime.value"
      @play-again="initialGame(terms, TERM_COUNT)"
    />
    
    <template v-else>
      <div class="flex justify-center items-center py-4">
        <span>{{ stopwatch.timeFormatted }}</span>
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
import { useTermStore } from '@/stores';
import { GameType, type Term } from '@/types';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card } from '@/components/ui/card'
import { milisecondToSecond } from '@/utils';
import GameLoading from './GameLoading.vue';
import { useStopwatch } from '@/composable';
import GameResult from './GameResult.vue';

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
const stopwatch = useStopwatch(100, milisecondToSecond)
const TERM_COUNT = 6;

const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([])
const cards = ref<Card[]>([])
const isLoading = ref(true)

const activeCards = ref<Card[]>([])
const matched = ref(0)
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
      stopwatch.plusTime(1000)
    }, 200)
  }
})

async function handleGameComplete() {
  stopwatch.stop()
  isGameCompleted.value = true
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
  isGameCompleted.value = false
  activeCards.value = []
  stopwatch.start()
}

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