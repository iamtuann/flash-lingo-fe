<template>
  <div class="space-y-6">
    <div class="p-4 bg-muted rounded-md">
      <p class="text-lg">{question.definition}</p>
    </div>

    <RadioGroup :model-value="userAnswer" @update:model-value="v => onAnswerChange(v)">
      <div
        v-for="(option, idx) in question.options"
        :key="idx"
        :class='`flex items-center space-x-2 p-3 rounded-md border ${
          isAnswered
            ? option === question.correctAnswer
              ? "border-green-500 bg-green-50"
              : option === userAnswer && option !== question.correctAnswer
                ? "border-red-500 bg-red-50"
                : "border-transparent"
            : "hover:bg-accent"
        }`'
      >
        <RadioGroupItem :value="option" :id="`option-${idx}`" :disabled="isAnswered" />
        <Label :for="`option-${idx}`" class="w-full cursor-pointer">
          {option}
        </Label>
        {isAnswered && option === question.correctAnswer && <CheckCircle class="h-5 w-5 text-green-500" />}
        {isAnswered && option === userAnswer && option !== question.correctAnswer && (
          <XCircle class="h-5 w-5 text-red-500" />
        )}
      </div>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { XCircle } from 'lucide-vue-next';
import type { QuestionRendererProps } from '.';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


defineProps<QuestionRendererProps>()
</script>

<style scoped>

</style>