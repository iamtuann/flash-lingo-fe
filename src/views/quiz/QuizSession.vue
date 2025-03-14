<template>
  <div class="container">
    
    <!-- <component :is="MultipleChoiceQuestion" :questions="" /> -->
  </div>
</template>

<script setup lang="ts">
import { MultipleChoiceQuestion, TermInputQuestion, TrueFalseQuestion } from '@/components/question';
import { QuestionService } from '@/services/question-service';
import { useTermStore } from '@/stores';
import type { QuizState, Question, QuestionType, Term } from '@/types';
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const topicId = ref(route.params.id as string)
const termStore = useTermStore()

const terms = ref<Term[]>([])
const isLoading = ref(true)
const questions = ref<Question[]>([])
const quizState = reactive<QuizState>({
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: {},
  isAnswered: false,
  isCorrect: false,
  quizCompleted: false,
})
const config = reactive<{
    questionCount: number
    selectedTypes: QuestionType[]
}>({
  questionCount: 5,
  selectedTypes: ["multipleChoice", "trueFalse"],
})

function generateQuestions(terms: Term[], count: number, types: QuestionType[]) {
  const questionService = new QuestionService()
  const generatedQuestions = questionService.generateQuestions(terms, count, types)
  questions.value = generatedQuestions
}

async function getData() {
  const storedConfig = localStorage.getItem("quizConfig")
  if (storedConfig) {
    try {
      const parsedConfig = JSON.parse(storedConfig)
      config.questionCount = parsedConfig.questionCount
      config.selectedTypes = parsedConfig.selectedTypes
    } catch (error) {
      console.error("Failed to parse quiz configuration:", error)
    }
  }
  try {
    const res = await termStore.getAllByTopicId(topicId.value)
    terms.value = res
    isLoading.value = false;
    if (!storedConfig) {
      config.questionCount = terms.value.length
    }
    generateQuestions(terms.value, config.questionCount, config.selectedTypes)
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
}

getData()
</script>

<style scoped>

</style>