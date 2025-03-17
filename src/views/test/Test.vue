<template>
  <div class="container mx-auto py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Topic Test</h1>
          <p class="text-muted-foreground mt-1">Complete all questions to assess your vocabulary knowledge</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-muted-foreground">
            <Clock class="h-4 w-4" />
            <span>{{formatTime(elapsedTime)}}</span>
          </div>
          <Button @click="saveTest" variant="outline" class="flex items-center gap-1">
            <Save class="h-4 w-4" /> Save Progress
          </Button>
          <Button
            variant="destructive"
            @click="showExitDialog = true"
            class="flex items-center gap-1"
          >
            Exit
          </Button>
        </div>
      </div>
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <div>
            {{`Answered ${answeredCount} / ${questions.length} questions`}}
          </div>
          <div>Flagged: <span>{{testState.flaggedQuestions.length}}</span> questions</div>
        </div>
        <Progress :model-value="progressPercentage" class="w-full" />
      </div>

      <div class="space-y-8 mb-8" v-if="!testState.isSubmitted">
        <Card v-for="(question, i) in questions" :key="question.id" :class="isFlagged(question.id) ? 'border-yellow-400' : ''">
          <CardHeader class="pb-2">
            <div class="flex justify-between items-start">
              <CardTitle class="text-lg flex items-center gap-2">
                Question {{i + 1}}
                <Badge :variant="getQuestionTypeBadgeVariant(question.type)">
                  {{getQuestionTypeLabel(question.type)}}
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                @click="toggleFlaggedQuestion(question.id)"
                :class="`p-1 h-auto ${isFlagged(question.id) ? 'text-yellow-500' : 'text-muted-foreground'}`"
              >
                <Flag class="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <QuestionRenderer
              :question="question"
              :userAnswer="testState.answers[question.id] || ''"
              @answerChange="(answer) => handleUserAnswer(question.id, answer)"
              :showResult="false"
            />
          </CardContent>
        </Card>
      </div>
      <div v-else>
        <Card>
          <CardHeader>
            <CardTitle>Test Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have completed the test. View your results in the Results tab.</p>
          </CardContent>
          <CardFooter>
            <Button>View Results</Button>
          </CardFooter>
        </Card>
      </div>
      <div class="flex justify-end items-center mb-6">
        <Button @click="showSubmitDialog = true" class="flex items-center gap-1">
          Submit Test
        </Button>
      </div>
    </div>
    
    <Dialog :open="showSubmitDialog" @update:open="(v) => showSubmitDialog = v">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit your test? You won't be able to change your answers after submission.
            <div v-if="answeredCount < questions.length" class="mt-4 flex items-start gap-2 p-3 rounded-md dark:bg-yellow-700 dark:text-white bg-yellow-50 text-yellow-700">
              <TriangleAlert class="h-5 w-5 mt-0.5" />
              <div>
                <p class="font-medium">Warning</p>
                <p>You have {{questions.length - answeredCount}} unanswered questions.</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showSubmitDialog = false">Cancel</Button>
          <Button @click="submitTest">Submit Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="showExitDialog" @update:open="(v) => showExitDialog = v">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exit Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to exit the test? Your progress will be lost unless you save it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showExitDialog = false">Cancel</Button>
          <Button variant="destructive" @click="exitTest">Exit Without Saving</Button>
          <Button @click="exitAndSave">Save & Exit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { QuestionRenderer } from '@/components/question';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { questionTypes } from '@/constants';
import { QuestionService } from '@/services/question-service';
import { useTermStore, useTopicStore } from '@/stores';
import type { TestState, Question, Term, QuestionType, TestResult } from '@/types';
import { formatTime } from '@/utils';
import { Clock, Flag, Save, TriangleAlert } from 'lucide-vue-next';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()
const topicId = ref(route.params.id as string)
const termStore = useTermStore()
const topicStore = useTopicStore()

const terms = ref<Term[]>([])
const isLoading = ref(true)
const questions = ref<Question[]>([])
const testState = reactive<TestState>({
  answers: {},
  flaggedQuestions: [],
  startTime: Date.now(),
  endTime: null,
  isSubmitted: false,
})
const showSubmitDialog = ref(false)
const showExitDialog = ref(false)
const elapsedTime = ref(0)
const answeredCount = computed(() => Object.keys(testState.answers).length)
const progressPercentage = computed(() => {
  if (questions.value.length === 0) {
    return 0
  }
  return Math.round((answeredCount.value / questions.value.length) * 100)
})

getData()

function submitTest() {
  const endTime = Date.now()
  const timeSpent = Math.floor((endTime - testState.startTime) / 1000)
  const questionResults: Record<
    string,
    {
      isCorrect: boolean
      userAnswer: string | string[]
      correctAnswer: string | string[]
    }
  > = {}
  let correctAnswers = 0
  let incorrectAnswers = 0
  let unansweredQuestions = 0

  questions.value.forEach((question) => {
    const userAnswer = testState.answers[question.id] || ""
    let isCorrect = false

    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      unansweredQuestions++
    } else {
      if (!Array.isArray(question.correctAnswer) && !Array.isArray(userAnswer)) {
        isCorrect = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()
      }
      isCorrect ? correctAnswers++ : incorrectAnswers++
    }
    questionResults[question.id] = {
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
    }
  })

  const result: TestResult = {
    score: Math.round((correctAnswers / questions.value.length) * 100),
    totalQuestions: questions.value.length,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    timeSpent,
    questionResults,
  }

  // setTestResult(result)
  testState.endTime = endTime
  testState.isSubmitted = true
  localStorage.removeItem("savedTest")
  // router.push({name: 'TestResult', params: {id: topicId.value}})
}

function exitTest() {
  localStorage.removeItem("savedTest")
  router.push({name: 'TopicHome', params: {id: topicId.value, slug: topicStore.topic?.slug || ''}})
}

function exitAndSave() {
  saveTest()
  router.push({name: 'TopicHome', params: {id: topicId.value, slug: topicStore.topic?.slug || ''}})
}

function handleUserAnswer(questionId: string, answer: string | string[]) {
  testState.answers = {
    ...testState.answers,
    [questionId]: answer
  }
}

function toggleFlaggedQuestion(questionId: string) {
  const index = testState.flaggedQuestions.indexOf(questionId)
  if (index == -1) {
    testState.flaggedQuestions.push(questionId)
  } else {
    testState.flaggedQuestions.splice(index, 1)
  }
}

const isFlagged = (questionId: string): boolean => {
  return testState.flaggedQuestions.indexOf(questionId) > -1
}

function saveTest() {
  const testData = {
    questions: questions.value,
    state: testState,
  }
  localStorage.setItem("savedTest", JSON.stringify(testData))
  alert("Test progress saved successfully!")
}

async function getData() {
  try {
    const res = await termStore.getAllByTopicId(topicId.value)
    terms.value = res
    generateTestQuestions(terms.value)
    isLoading.value = false;
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
  //check saved test
}

function generateTestQuestions(terms: Term[]) {
  if (!terms || terms.length === 0) {
    console.error("No terms to generate questions")
    questions.value = []
    return;
  }
  const questionService = new QuestionService()
  const allTypes: QuestionType[] = questionTypes.map(q => q.type)
  questions.value = questionService.generateTestQuestions(terms, allTypes)
  console.log(questions.value)
}

function getQuestionTypeLabel(type: string): string {
  const question = questionTypes.find(q => q.type === type)
  return question?.label || "Other question";
}

function getQuestionTypeBadgeVariant(type: QuestionType): "default" | "secondary" | "outline" {
  switch (type) {
    case "multipleChoice":
      return "default"
    case "termInput":
      return "secondary"
    case "trueFalse":
      return "default"
    default:
      return "default"
  }
}
</script>

<style scoped>

</style>