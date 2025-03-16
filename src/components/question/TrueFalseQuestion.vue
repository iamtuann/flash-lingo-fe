<template>
  <div class="space-y-6">
    <div class="p-4 bg-muted rounded-md">
      <p class="text-lg font-medium">{{question.term}}</p>
      <p class="mt-2">{{question.definition}}</p>
    </div>

    <RadioGroup :model-value="userAnswer" @update:model-value="v => $emit('answerChange', v)">
      <div
        :class='`flex items-center space-x-2 px-3 rounded-md border ${
          isAnswered
            ? "true" === question.correctAnswer
              ? "border-green-500 bg-green-300 bg-opacity-10"
              : "true" === userAnswer && "true" !== question.correctAnswer
                ? "border-red-500 bg-red-300 bg-opacity-10"
                : "border-transparent"
            : "hover:bg-accent"
        }`'
      >
        <RadioGroupItem value="true" id="true" :disabled="isAnswered" />
        <Label htmlFor="true" class="w-full cursor-pointer py-3">
          True
        </Label>
        <CheckCircle v-if="isAnswered && 'true' === question.correctAnswer" class="h-5 w-5 text-green-500" />
        <XCircle v-if="isAnswered && 'true' === userAnswer && 'true' !== question.correctAnswer" class="h-5 w-5 text-red-500" />
      </div>

      <div
        :class='`flex items-center space-x-2 px-3 rounded-md border ${
          isAnswered
            ? "false" === question.correctAnswer
              ? "border-green-500 bg-green-300 bg-opacity-10"
              : "false" === userAnswer && "false" !== question.correctAnswer
                ? "border-red-500 bg-red-300 bg-opacity-10"
                : "border-transparent"
            : "hover:bg-accent"
        }`'
      >
        <RadioGroupItem value="false" id="false" :disabled="isAnswered" />
        <Label htmlFor="false" class="w-full cursor-pointer py-3">
          False
        </Label>
        <CheckCircle v-if="isAnswered && 'false' === question.correctAnswer" class="h-5 w-5 text-green-500" />
        <XCircle v-if="isAnswered && 'false' === userAnswer && 'false' !== question.correctAnswer" class="h-5 w-5 text-red-500" />
      </div>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle } from 'lucide-vue-next';
import type { QuestionComponentEmits, QuestionComponentProps } from '.';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';


defineProps<QuestionComponentProps>()
defineEmits<QuestionComponentEmits>()
</script>

<style scoped>

</style>