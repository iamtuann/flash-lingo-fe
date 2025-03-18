<template>
  <div class="container mx-auto py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <Card class="mb-6">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="text-center">
                <div class="text-6xl font-bold mb-2">{{testResult.score}}%</div>
                <div class="text-xl">
                  {{testResult.score >= 90 ? "Excellent!" : testResult.score >= 70 ? "Good job!" : testResult.score >= 50 ? "Keep practicing!" : "More study needed"}}
                </div>
              </div>
    
              <Progress
                :model-value="testResult.score"
                class="h-4"
              />
              <!-- indicatorClassName={
                  testResult.score >= 90
                    ? "bg-green-500"
                    : testResult.score >= 70
                      ? "bg-blue-500"
                      : testResult.score >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                } -->
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span>Total Questions:</span>
                <span class="font-medium">{{testResult.totalQuestions}}</span>
              </div>
    
              <div class="flex justify-between">
                <span>Correct Answers:</span>
                <span class="font-medium text-green-600">{{testResult.correctAnswers}}</span>
              </div>
    
              <div class="flex justify-between">
                <span>Incorrect Answers:</span>
                <span class="font-medium text-red-600">{{testResult.incorrectAnswers}}</span>
              </div>
    
              <div class="flex justify-between">
                <span>Unanswered Questions:</span>
                <span class="font-medium text-yellow-600">{{testResult.unansweredQuestions}}</span>
              </div>
    
              <div class="flex justify-between">
                <span>Time Spent:</span>
                <span class="font-medium">{{formatTime(testResult.timeSpent)}}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="outline" @click="router.push({name: 'Home'})" class="flex items-center gap-1">
            <Home class="h-4 w-4" />
            Return Home
          </Button>
    
          <Button @click="restartTest" class="flex items-center gap-1">
            <RotateCcw class="h-4 w-4" />
            Take Another Test
          </Button>
        </CardFooter>
      </Card>
      <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
    
      <div className="space-y-8 mb-8">
        <Card
          v-for="(question, index) in questions"
          :key="question.id"
          :class="{
            'border-green-500': testResult.questionResults[question.id]?.isCorrect,
            'border-red-500': !testResult.questionResults[question.id]?.isCorrect,
            'border-yellow-500': !testResult.questionResults[question.id]?.userAnswer
          }"
        >
          <CardHeader class="pb-2">
            <div class="flex justify-between items-start">
              <CardTitle class="text-lg flex items-center gap-2">
                Question {{ index + 1 }}
                <Badge variant="default">
                  {{ getQuestionTypeLabel(question.type) }}
                </Badge>
                <Badge
                  v-if="testResult.questionResults[question.id]?.isCorrect"
                  class="ml-2 bg-success"
                >
                  Correct
                </Badge>
                <Badge
                  v-else-if="!testResult.questionResults[question.id]?.userAnswer"
                  class="ml-2 bg-warning"
                >
                  Unanswered
                </Badge>
                <Badge v-else variant="destructive" class="ml-2">
                  Incorrect
                </Badge>
              </CardTitle>
    
              <Badge
                v-if="testState.flaggedQuestions.includes(question.id)"
                variant="outline"
                class="text-yellow-500 border-yellow-500"
              >
                Flagged
              </Badge>
            </div>
          </CardHeader>
    
          <CardContent>
            <QuestionRenderer
              :question="question"
              :userAnswer="testResult.questionResults[question.id]?.userAnswer"
              :correctAnswer="testResult.questionResults[question.id]?.correctAnswer"
              @answerChange="() => {}"
              :is-answered="true"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionRenderer from '@/components/question/QuestionRenderer.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { questionTypes } from '@/constants';
import { useTestStore } from '@/stores';
import type { TestResult, TestState, Question } from '@/types';
import { formatTime } from '@/utils';
import { Home, RotateCcw } from 'lucide-vue-next';
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const testStore = useTestStore()
const router = useRouter()
const route = useRoute()

const topicId = ref(route.params.id as string)
const questions = ref<Question[]>([])
const testState = ref<TestState>({} as TestState)
const testResult = ref<TestResult>({} as TestResult)

function restartTest() {
  router.push({name: "TopicTest", params: {id: topicId.value}})
}

function getQuestionTypeLabel(type: string): string {
  const question = questionTypes.find(q => q.type === type)
  return question?.label || "Other question";
}

onBeforeMount(() => {
  if (testStore.haveResult()) {
    questions.value = testStore.questions
    testState.value = testStore.testState as TestState
    testResult.value = testStore.testResult as TestResult
  } else {
    router.push({name: "Home"})
  }
})
</script>

<style scoped>

</style>