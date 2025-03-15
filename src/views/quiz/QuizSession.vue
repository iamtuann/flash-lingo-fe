<template>
  <div class="container py-10 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <div>Question {{quizState.currentQuestionIndex + 1}} of {{questions.length}}</div>
          <div>Score: {{quizState.score}}</div>
        </div>
        <ProgressRoot
          :model-value="progressValue"
          class="w-full rounded-full relative h-4 overflow-hidden bg-accent border border-accent"
        >
          <ProgressIndicator
            class="indicator rounded-full block relative w-full h-full bg-primary transition-transform overflow-hidden duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)] after:animate-progress after:content-[''] after:absolute after:inset-0"
            :style="`transform: translateX(-${100 - progressValue}%)`"
          />
        </ProgressRoot>
      </div>
      <Tabs defaultValue="question" class="mb-6">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="info">Quiz Info</TabsTrigger>
        </TabsList>
        <TabsContent value="question">
          <Card>
            <CardHeader>
              <CardTitle>{{getQuestionTitle(currentQuestion)}}</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionRenderer
                :question="currentQuestion"
                :userAnswer="userAnswer"
                :isAnswered="quizState.isAnswered"
                @answerChange="handleUserAnswer"
              />
            </CardContent>
            <CardFooter class="flex justify-between">
              <Button
                variant="outline"
                @click="prevQuestion"
                :disabled="quizState.currentQuestionIndex === 0"
                class="flex items-center gap-1"
              >
                <ArrowLeft class="h-4 w-4" /> Previous
              </Button>
              <Button v-show="!quizState.isAnswered" @click=checkAnswer :disabled="!userAnswer" class="flex items-center gap-1">
                Check Answer
              </Button>
              <Button v-show="quizState.isAnswered" @click="nextQuestion" class="flex items-center gap-1">
                <template v-if="quizState.currentQuestionIndex < questions.length - 1">
                  Next <ArrowRight class="h-4 w-4" />
                </template>
                <template v-else>Finish Quiz</template>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuestionRenderer } from '@/components/question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionService } from '@/services/question-service';
import { useTermStore } from '@/stores';
import type { QuizState, Question, QuestionType, Term } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { questionTypes } from "@/constants";

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

getData()

const currentQuestion = computed<Question>(() => {
  if (questions.value && questions.value.length > 0) {
    return questions.value[quizState.currentQuestionIndex]
  } else {
    return {} as Question
  }
})
const userAnswer = computed(() => {
  return quizState.userAnswers[currentQuestion.value?.id] || ""
})
const progressValue = computed(() => {
  if (questions.value.length > 0) {
    return (quizState.currentQuestionIndex / questions.value.length) * 100
  } else return 0
})

const handleUserAnswer = (answer: string | string[]) => {
  quizState.userAnswers = {
    ...quizState.userAnswers,
    [currentQuestion.value.id]: answer,
  }
}

const checkAnswer = () => {
  if (!userAnswer.value) return
  let isCorrect = false
  if (!Array.isArray(currentQuestion.value.correctAnswer) && !Array.isArray(userAnswer.value)) {
    isCorrect = userAnswer.value.toLowerCase() === currentQuestion.value.correctAnswer.toLowerCase()
  }
  quizState.isAnswered = true
  quizState.isCorrect = isCorrect
  quizState.score = isCorrect ? quizState.score + 1 : quizState.score
}

const nextQuestion = () => {
  if (quizState.currentQuestionIndex < questions.value.length - 1) {
    quizState.currentQuestionIndex = quizState.currentQuestionIndex + 1
    quizState.isAnswered = !!userAnswer.value
  } else {
    quizState.quizCompleted = true
  }
}

const prevQuestion = () => {
  if (quizState.currentQuestionIndex > 0) {
    quizState.currentQuestionIndex = quizState.currentQuestionIndex - 1
    // quizState.isAnswered = !!quizState.userAnswers[questions.value[quizState.currentQuestionIndex - 1].id]
    quizState.isAnswered = !!userAnswer.value
  }
}

function getQuestionTitle(question: Question): string {
  switch (question.type) {
    case "multipleChoice":
      return "Which term matches this definition?"
    case "termInput":
      return "Enter the term for this definition"
    case "trueFalse":
      return "Is this definition correct for the term?"
    default:
      return "Answer the question"
  }
}

function getQuestionTypeLabel(type: string): string {
  const question = questionTypes.find(q => q.type === type)
  return question?.label || "Other question";
}

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
</script>

<style scoped>

</style>