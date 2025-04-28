<template>
  <div v-if="isLoading">
    <div class="flex flex-col items-center mt-10">
      <div class="min-h-24"><GameLoading /></div>
      <div class="text-lg">Setting Game...</div>
    </div>
  </div>

  <GameResult
    v-else-if="isGameCompleted"
    :game-type="GameType.WordScramble"
    name="Word Scramble"
    :time="stopwatch.elapsedTime.value"
    @play-again="handleRestartGame"
  />

  <div v-else class="px-3 max-w-3xl mx-auto md:px-4">
    <div class="flex justify-between items-center my-6 bg-card rounded-lg">
      <span>{{ stopwatch.timeFormatted }} s</span>
      <div class="flex items-center gap-2">
        <span class="text-muted-foreground">Progress:</span>
        <Progress :model-value="(currentIndex / TERM_COUNT) * 100" class="w-40 sm:w-52" />
        <span class="text-sm font-medium">
          {{ currentIndex }} / {{TERM_COUNT}}
        </span>
      </div>
    </div>

    <Card class="mb-6 mt-10">
      <CardHeader>
        <div class="flex justify-between items-center">
          <CardTitle>Unscramble the Word</CardTitle>
          <Button variant="ghost" size="icon" @click="showDefinition = !showDefinition" class="h-8 w-8">
            <HelpCircle class="h-4 w-4" />
          </Button>
        </div>
        <CardDescription v-show="showDefinition" class="mt-2 p-3 bg-muted rounded-md">
          <strong>Definition:</strong> {{currentTerm?.definition}}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col items-center gap-6 mt-6">
          <div class="min-h-[60px]">
            <div v-show="selectedLetters.length > 0" class="flex flex-wrap justify-center gap-2 ">
              <div
                v-for="(letter, idx) in selectedLetters"
                :key="`selected-${idx}`"
                class="w-12 h-12 flex items-center justify-center text-lg font-bold rounded-md"
                :class="isCorrect ? 'bg-green-200 dark:bg-green-500' : 'cursor-pointer bg-blue-100 hover:border-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700'"
                @click="handleSelectedLetterClick(idx)"
              >
                {{letter}}
              </div>
            </div>
            <div v-show="selectedLetters.length == 0" class="text-muted-foreground">Click the letters below to form a word</div>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <Button
              v-for="(letter, idx) in scrambledLetters"
              :key="`scrambled-${idx}`"
              variant="outline"
              class="w-12 h-12 text-lg font-bold"
              :class="{'opacity-50 cursor-not-allowed': usedIndices.includes(idx)}"
              @click="handleLetterClick(letter, idx)"
              :disabled="usedIndices.includes(idx) || isCorrect"
            >
              {{letter}}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button
          variant="outline"
          @click="handleReset"
          :disabled="selectedLetters.length === 0 || isCorrect"
          class="flex items-center gap-1"
        >
          <Trash2 class="h-4 w-4" /> Reset
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { useStopwatch } from '@/composable/';
import { useTermStore } from '@/stores';
import { GameType, type Term } from '@/types';
import { milisecondToSecond } from '@/utils';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { HelpCircle, Trash2 } from 'lucide-vue-next';
import GameResult from './GameResult.vue';
import GameLoading from './GameLoading.vue';

const route = useRoute()
const router = useRouter()
const stopwatch = useStopwatch(100, milisecondToSecond)
const termStore = useTermStore()
const TERM_COUNT = 5

const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([])
const isLoading = ref(true)
const currentIndex = ref(0)
const currentTerm = ref<Term | null>(null)
const scrambledLetters = ref<string[]>([])
const selectedLetters = ref<string[]>([])
const isCorrect = ref(false)
const usedIndices = ref<number[]>([])
const letterIndices = ref<number[]>([])
const showDefinition = ref(false)
const isGameCompleted = ref(false)

getData()

watch([selectedLetters, currentTerm], () => {
  if (currentTerm.value && selectedLetters.value.length > 0) {
    const selectedWord = selectedLetters.value.join("").toLowerCase()
    const correctWord = currentTerm.value.term.toLowerCase().trim()
    if (selectedWord === correctWord && selectedLetters.value.length === scrambledLetters.value.length) {
      isCorrect.value = true
      setTimeout(() => {
        handleNextWord()
      }, 200);
    }
  }
})

const scrambleWord = (word: string) => {
  const letters = word.trim().split("")

  const scrambled = [...letters].sort(() => Math.random() - 0.5)

  if (scrambled.join("").toLowerCase() === letters.join("").toLowerCase()) {
    return scrambleWord(word)
  }

  scrambledLetters.value = scrambled
  selectedLetters.value = []
  usedIndices.value = []
  isCorrect.value = false
  showDefinition.value = false
  letterIndices.value = []
}

const handleLetterClick = (letter: string, index: number) => {
  if (isCorrect.value) return
  if (usedIndices.value.includes(index)) return

  selectedLetters.value = [...selectedLetters.value, letter]
  usedIndices.value = [...usedIndices.value, index];
  letterIndices.value = [...letterIndices.value, index]
}

const handleReset = () => {
  selectedLetters.value = []
  usedIndices.value = []
  letterIndices.value = []
}

const handleSelectedLetterClick = (index: number) => {
  if (isCorrect.value) return
  const originalIndex = letterIndices.value[index]

  selectedLetters.value.splice(index, 1)
  letterIndices.value.splice(index, 1)
  usedIndices.value = usedIndices.value.filter((idx) => idx !== originalIndex)
}

function handleNextWord() {
  if (currentIndex.value < TERM_COUNT - 1) {
    currentIndex.value += 1
    currentTerm.value = terms.value[currentIndex.value]
    scrambleWord(currentTerm.value.term)
  } else {
    currentIndex.value += 1
    handleGameComplete()
  }
}

async function handleGameComplete() {
  stopwatch.stop()
  await new Promise(() => setTimeout(() => {
    isGameCompleted.value = true
  }, 1000))
}

const handleRestartGame = () => {
  if (terms.value.length > 0) {
    terms.value = [...terms.value].sort(() => Math.random() - 0.5)
    
    currentIndex.value = 0;
    currentTerm.value = terms.value[0]
    scrambleWord(currentTerm.value.term)
    stopwatch.start()
    isGameCompleted.value = false
  }
}

async function getData() {
  try {
    const res = await termStore.getAllByTopicId(topicId.value)
    const filteredData = res.filter(term => term.term.length >= 3);
    if (filteredData.length < TERM_COUNT) {
      alert('Not enough terms to play this game')
      router.replace({name: 'GameBar', params: {id: topicId.value}})
    } else {
      terms.value = [...filteredData].sort(() => Math.random() - 0.5)
      currentTerm.value = terms.value[0]
      scrambleWord(currentTerm.value?.term)
      setTimeout(() => {
        isLoading.value = false
        stopwatch.start()
      }, 2000);
    }
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}

</script>

<style scoped>

</style>