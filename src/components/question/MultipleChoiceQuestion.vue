<template>
  <div class="space-y-6">
    <div class="p-4 bg-muted rounded-md">
      <p class="text-lg">{{question.definition}}</p>
    </div>

    <RadioGroup :model-value="userAnswer" @update:model-value="v => $emit('answerChange', v)">
      <div
        v-for="(option, idx) in question.options"
        :key="idx"
        :class='`flex items-center space-x-2 px-3 rounded-md border ${
          isAnswered
            ? option === question.correctAnswer
              ? "border-green-500 bg-green-300 bg-opacity-10"
              : option === userAnswer && option !== question.correctAnswer
                ? "border-red-500 bg-red-300 bg-opacity-10"
                : "border-transparent"
            : "hover:bg-accent"
        }`'
      >
        <RadioGroupItem :value="option" :id="`${question.id}-${idx}`" :disabled="isAnswered" />
        <Label :for="`${question.id}-${idx}`" class="w-full cursor-pointer py-3">
          {{option}}
        </Label>
        <CheckCircle v-if="isAnswered && option === question.correctAnswer" class="h-5 w-5 text-green-500" />
        <XCircle v-if="isAnswered && option === userAnswer && option !== question.correctAnswer" class="h-5 w-5 text-red-500" />
      </div>
    </RadioGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle } from 'lucide-vue-next';
import type { QuestionComponentEmits, QuestionComponentProps } from '.';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


defineProps<QuestionComponentProps>()
defineEmits<QuestionComponentEmits>()
</script>

<style scoped>

</style>