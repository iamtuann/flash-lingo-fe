<template>
  <QuizSessionSkeleton v-if="isLoading" />
  <div v-else-if="quizState.quizCompleted" class="container mx-auto py-10 px-4">
    <div class="max-w-2xl mx-auto">
      <Card class="text-center">
        <CardHeader>
          <CardTitle class="text-2xl">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="text-6xl font-bold">
            {{quizState.score}} / {{questions.length}}
          </div>
          <p class="text-xl">
            {{quizState.score === questions.length
              ? "Perfect score! Excellent work!"
              : quizState.score > questions.length / 2
                ? "Good job! Keep practicing to improve."
                : "Keep studying and try again to improve your score."}}
          </p>
          <Progress :model-value="(quizState.score / questions.length) * 100" />
        </CardContent>
        <CardFooter class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4 w-full">
            <Button @click="restartQuiz" class="flex items-center gap-2">
              <RefreshCw class="h-4 w-4" />
              Restart Quiz
            </Button>
            <Button @click="reconfigureQuiz" variant="outline" class="flex items-center gap-2">
              <Settings class="h-4 w-4" />
              Reconfigure Quiz
            </Button>
          </div>
          <Button variant="outline" @click="router.push({name: 'TopicHome', params: {id: topicId, slug: ''}})" class="flex items-center gap-2">
            <HomeIcon class="h-4 w-4" />
            Return to Topic
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
  <div v-else class="container py-10 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <div>Question {{quizState.currentQuestionIndex + 1}} / {{questions.length}}</div>
          <div>Score: {{quizState.score}}</div>
        </div>
        <Progress :model-value="progressValue" />
      </div>
      <Tabs defaultValue="question" class="mb-6">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="info">Quiz Info</TabsTrigger>
        </TabsList>
        <TabsContent value="question">
          <Card>
            <CardHeader>
              <CardTitle>{{getQuestionTitle(currentQuestion.type)}}</CardTitle>
            </CardHeader>
            <CardContent>
              <form @keydown.enter="checkAnswer" >
                <QuestionRenderer
                  :question="currentQuestion"
                  :userAnswer="userAnswer"
                  :isAnswered="quizState.isAnswered"
                  @answerChange="handleUserAnswer"
                />
              </form>
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
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <h3 class="font-medium">Quiz Configuration</h3>
                <ul class="mt-2 space-y-1 text-sm">
                  <li>Total Questions: {{questions.length}}</li>
                  <li>Question Types: {{config.selectedTypes.map(getQuestionTypeLabel).join(", ")}}</li>
                </ul>
              </div>

              <div>
                <h3 class="font-medium">Question Type Distribution</h3>
                <div class="mt-2 space-y-2">
                  <div v-for="type in config.selectedTypes" :key="type" class="space-y-1">
                    <div class="flex justify-between text-sm">
                      <span>{{getQuestionTypeLabel(type)}}</span>
                      <span>
                        {{questions.filter((q) => q.type === type).length}} questions
                      </span>
                    </div>
                    <!-- <ProgressRoot class="h-2">
                      <ProgressIndicator />
                    </ProgressRoot> -->
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" @click="reconfigureQuiz" class="w-full flex items-center gap-2">
                <Settings class="h-4 w-4" />
                Reconfigure Quiz
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
import { ArrowLeft, ArrowRight, HomeIcon, RefreshCw, Settings } from 'lucide-vue-next';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { questionTypes } from "@/constants";
import { Progress } from '@/components/ui/progress';
import QuizSessionSkeleton from './QuizSessionSkeleton.vue';

const route = useRoute()
const router = useRouter()
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
  isCorrect: null,
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
    quizState.isAnswered = !!userAnswer.value
  }
}

const restartQuiz = () => {
  questions.value = [...questions.value].sort(() => Math.random() - 0.5)
  Object.assign(quizState, {
    currentQuestionIndex: 0,
    score: 0,
    userAnswers: {},
    isAnswered: false,
    isCorrect: null,
    quizCompleted: false,
  })
}

const reconfigureQuiz = () => {
  router.push({name: 'QuizConfig', params: {id: topicId.value}})
}

function getQuestionTitle(type: string): string {
  const question = questionTypes.find(q => q.type === type)
  return question?.questionTitle || "Answer the question";
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
    if (!storedConfig) {
      config.questionCount = terms.value.length
    }
    generateQuestions(terms.value, config.questionCount, config.selectedTypes)
    isLoading.value = false;
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
}
</script>

<style scoped>

</style>