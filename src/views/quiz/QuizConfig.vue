<template>
  <div class="container py-10">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold tracking-tight">Configure Your Quiz</h2>
        <p class="text-muted-foreground mt-1">Customize your quiz settings to match your learning preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
          <CardDescription>Select the number of questions and question types for your quiz</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <Tabs default-value="basic" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Question Types</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" class="space-y-6 pt-4">
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-3">
                    <Label for="question-count">Number of Questions</Label>
                    <span class="text-muted-foreground">{{ questionCount[0] }} questions</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <Slider
                      id="question-count"
                      :min="2"
                      :max="totalTerm"
                      :step="1"
                      v-model="questionCount"
                      class="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Number of Questions Types: {{ selectedTypes.length }}</Label> 
                </div>
                <div class="">
                  <h3 class="text-lg font-medium mb-2">Quick Settings</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      class="flex-col justify-between gap-1 min-h-28 p-4 text-base"
                      @click="handleQuickSetting('basic')"
                    >
                      <BookOpen :stroke-width="1.5" class="mb-1 !size-6" />
                      <span>Basic</span>
                      <span class="text-xs text-muted-foreground">Simple question types</span>
                    </Button>
                    <Button
                      variant="outline"
                      class="flex-col justify-between gap-1 min-h-28 p-4 text-base"
                      @click="handleQuickSetting('advance')"
                    >
                      <Brain :stroke-width="1.5" class="mb-1 !size-6" />
                      <span>Advanced</span>
                      <span class="text-xs text-muted-foreground">Complex question types</span>
                    </Button>
                    <Button
                      variant="outline"
                      class="flex-col justify-between gap-1 min-h-28 p-4 text-base"
                      @click="handleQuickSetting('random')"
                    >
                      <Shuffle :stroke-width="1.5" class="mb-1 !size-6" />
                      <span>Random</span>
                      <span class="text-xs text-muted-foreground">Surprise me!</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" class="space-y-6 pt-4">
              <div>
                <h3 class="text-lg font-medium mb-2">Question Types</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  Select at least one question type to include in your quiz
                </p>

                <div className="grid gap-4">
                  <div
                    v-for="qt in questionTypes"
                    :key=qt.type
                    :class="`flex items-start space-x-3 p-3 rounded-md border ${
                      selectedTypes.includes(qt.type) ? 'border-primary bg-primary/5' : 'border-muted'
                    }`"
                  >
                    <Checkbox
                      :id="`qt-${qt.type}`"
                      :modelValue="selectedTypes.includes(qt.type)"
                      @update:model-value="() => handleTypeToggle(qt.type)"
                      :disabled="selectedTypes.length === 1 && selectedTypes.includes(qt.type)"
                    />
                    <div className="grid gap-1.5">
                      <Label :for="`qt-${qt.type}`" className="font-medium cursor-pointer">
                        {{qt.label}}
                      </Label>
                      <p className="text-sm text-muted-foreground">{{qt.description}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter class="flex justify-end w-full">
          <Button class="h-10" @click="startQuiz">Start Quiz</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuestionType, Topic } from '@/types';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { questionTypes } from "@/constants";
import { useTopicStore } from '@/stores';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Shuffle } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const router = useRouter()
const route = useRoute()
const topicStore = useTopicStore()

const topicId = computed(() => route.params.id as string)
const topic = ref<Topic>()
const totalTerm = ref<number>(2)
const isLoading = ref(true)
const questionCount = ref([1])
const selectedTypes = ref<QuestionType[]>([
  'multipleChoice', 'trueFalse'
])

function handleQuickSetting(type: 'basic' | 'advance' | 'random') {
  switch (type) {
    case 'basic':
      selectedTypes.value = ['multipleChoice']
      questionCount.value = totalTerm.value >= 10 ? [10] : [totalTerm.value]
      break;
    case 'advance':
      selectedTypes.value = ['multipleChoice', 'trueFalse', 'termInput']
      questionCount.value = [totalTerm.value]
      break;
    case 'random':
      const shuffled = [...questionTypes].sort(() => Math.random() - 0.5)
      const randomCount = Math.floor(Math.random() * 2) + 2   //2 -> 3 type
      const randomTypes = shuffled.slice(0, randomCount).map((qt) => qt.type)
      selectedTypes.value = randomTypes
      // Random question count between 5 and max
      const maxQuestions = totalTerm.value
      const randomQuestionCount = maxQuestions > 5 ? Math.floor(Math.random() * (maxQuestions - 5 + 1)) + 5 : maxQuestions
      questionCount.value = [randomQuestionCount]
      break;
    default:
      break;
  }
}

const handleTypeToggle = (type: QuestionType) => {
  if (selectedTypes.value.includes(type)) {
    if (selectedTypes.value.length > 1) {
      selectedTypes.value = selectedTypes.value.filter(t => t !== type)
    }
  } else {
    selectedTypes.value.push(type)
  }
}

function startQuiz() {
  const quizConfig = {
      questionCount: questionCount.value[0],
      selectedTypes: selectedTypes.value,
      timestamp: new Date().getTime(),
    }
  localStorage.setItem("quizConfig", JSON.stringify(quizConfig))
  // Navigate to the quiz page
  router.push({name: 'QuizSession', params: {id: topic.value?.id}})
}

async function getData() {
  try {
    const res = await topicStore.getById(topicId.value)
    topic.value = res
    totalTerm.value = res.termsNumber
    questionCount.value = totalTerm.value >= 10 ? [10] : [totalTerm.value]
    isLoading.value = false;
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}
getData();
</script>

<style scoped>

</style>