<template>
  <div class="px-3 max-w-4xl mx-auto md:px-2">
    <div class="p-8 text-center mb-8">
      <div class="flex justify-center mb-4">
        <TrophyIcon class="h-16 w-16 text-yellow-500" />
      </div>
      <h2 class="text-2xl font-bold mb-2">Congratulations!</h2>
      <p class="text-lg mb-4">You've completed the Match Cards game!</p>
      <div class="space-y-2">
        <div class="text-left text-muted-foreground font-semibold">Top ranking</div>
        <template v-if="isLoading">
          <Skeleton v-for="i in 3" :key="i" class="h-12 rounded-md" />
        </template>
        <template v-else>
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
        </template>
      </div>

      <div class="mt-6 flex justify-center">
        <Button @click="emits('playAgain')" class="flex items-center gap-1">
          <RotateCcw class="h-4 w-4" /> Play Again
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGameScoreStore } from '@/stores';
import type { GameType, Score } from '@/types';
import { milisecondToSecond } from '@/utils';
import { RotateCcw, TrophyIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  gameType: GameType,
  name: string,
  time: number
}>()
const emits = defineEmits<{
  'playAgain': []
}>()

const route = useRoute()
const gameScoreStore = useGameScoreStore()
const topicId = ref(route.params.id as string)
const ranking = ref<Score[]>([])
const isLoading = ref(true)

async function saveResult() {
  try {
    await gameScoreStore.saveScore(topicId.value, props.gameType, props.time)
    ranking.value = await gameScoreStore.getTopScores(topicId.value, props.gameType)
    isLoading.value = false
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}
saveResult()
</script>

<style scoped>

</style>