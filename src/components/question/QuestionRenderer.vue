<template>
  <component
    :is="selectedComponent"
    v-bind="props"
    @answerChange="(v: string | string[]) => emits('answerChange', v)"
  />
</template>

<script setup lang="ts">
import { MultipleChoiceQuestion, TermInputQuestion, TrueFalseQuestion } from '@/components/question';
import type { QuestionComponentEmits, QuestionComponentProps } from '.';
import { computed } from 'vue';
import type { QuestionType } from '@/types';

const props = defineProps<QuestionComponentProps>()
const emits = defineEmits<QuestionComponentEmits>()

const componentMap: Record<QuestionType, any> = {
  'multipleChoice': MultipleChoiceQuestion,
  'trueFalse': TrueFalseQuestion,
  'termInput': TermInputQuestion,
};

// Dynamically select the component based on question.type
const selectedComponent = computed(() => componentMap[props.question.type]);
</script>

<style scoped>

</style>