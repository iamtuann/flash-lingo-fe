<template>
  <div class="space-y-6">
    <div class="p-4 bg-muted rounded-md">
      <p class="text-lg">{{question.definition}}</p>
    </div>

    <div v-if="typeof userAnswer === 'string'">
      <Input
        placeholder="Type your answer here..."
        :class="isAnswered ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''"
        :model-value="userAnswer"
        @update:model-value="(v) => $emit('answerChange', v as string)"
        :disabled="isAnswered"
      />
      <div
        v-if="isAnswered"
        :class='`mt-4 p-3 rounded-md ${
          isCorrect ? "bg-green-300 bg-opacity-10 text-green-600" : "bg-red-300 bg-opacity-10 text-red-600"
        }`'
      >
        <div v-if="isCorrect" class="flex items-center gap-2">
          <CheckCircle class="h-5 w-5" />
          <span>Correct!</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <XCircle class="h-5 w-5" />
          <span>
            Incorrect. The correct answer is: <strong>{{question.correctAnswer}}</strong>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle } from 'lucide-vue-next';
import type { QuestionComponentEmits, QuestionComponentProps } from '.';
import { Input } from '../ui/input';
import { computed } from 'vue';


const props = defineProps<QuestionComponentProps>()
defineEmits<QuestionComponentEmits>()

const isCorrect = computed(() => {
  if (!Array.isArray(props.question.correctAnswer) && !Array.isArray(props.userAnswer)) {
    return props.userAnswer.toLowerCase() === props.question.correctAnswer.toLowerCase()
  } else {
    return false;
  }
})
</script>

<style scoped>

</style>