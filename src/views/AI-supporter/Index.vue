<template>
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold tracking-tight py-3">Generate a Topic by AI</h2>
      <p class="text-sm text-muted-foreground"></p>
      <form class="space-y-3" @submit="onSubmit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel required>Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter a title" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="level">
            <FormItem>
              <FormLabel>English level</FormLabel>
              <Select defaultValue="Intermediate" v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Beginner"> Beginner </SelectItem>
                    <SelectItem value="Intermediate"> Intermediate </SelectItem>
                    <SelectItem value="Advanced"> Advanced </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
        </div>
        <FormField v-slot="{ componentField, value }" name="termCount">
          <FormItem>
            <FormLabel class="flex justify-between mb-4">
              <span>Number of Terms</span>
              <span>{{ value?.[0] }} term</span>
            </FormLabel>
            <FormControl>
              <Slider
                :model-value="componentField.modelValue"
                :default-value="[10]"
                :max="15"
                :min="5"
                :step="1"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full !mt-6" :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-1 h-4 w-4 animate-spin" />
          {{ isLoading ? 'Generating...' : 'Generate Topic'}}
        </Button>
      </form>
      <div class="mt-6 p-2 flex flex-col">
        <template v-if="isLoading">
          <Skeleton class="h-6 w-3/4 md:w-1/2" />
          <Skeleton class="h-5 w-full mt-4" />
          <Skeleton class="h-5 w-full mt-4" />
          <Skeleton class="h-5 w-full mt-4" />
          <Skeleton class="h-5 w-1/2 mt-4" />
          <Skeleton class="h-5 w-3/4 mt-4" />
        </template>
        <template v-else-if="generatedTopic">
          <h3 class="text-xl font-semibold">Topic: {{ generatedTopic.name }}</h3>
          <p class="text-muted-foreground">{{ generatedTopic.description }}</p>
          <h4 class="text-md font-semibold mt-4">Terms</h4>
          <div class="mt-3">
            <TermItem v-for="term in generatedTopic.terms" :key="term.term" :term="term" class="mt-2" />
          </div>
          <h4 class="text-md font-semibold mt-4">Short passage</h4>
          <div class="mt-3">
            {{ generatedTopic.shortPassage }}
          </div>
          <Button @click="saveTopic" class="mx-auto mt-4">
            <LoaderCircle v-if="isSaving" class="mr-1 h-4 w-4 animate-spin" /> Save Topic
          </Button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TermItem from '@/components/term/TermItem.vue';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/toast'
import { useSuggestionStore, useTermStore, useTopicStore } from '@/stores';
import type { GenerateTopicRequest, GenerateTopicResponse } from '@/types';
import { toTypedSchema } from '@vee-validate/zod';
import { LoaderCircle } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const suggestionStore = useSuggestionStore();
const topicStore = useTopicStore();
const termStore = useTermStore();
const router = useRouter();

const formSchema = toTypedSchema(z.object({
  name: z.string().nonempty({ message: 'This is required'}),
  description: z.string().optional().nullable(),
  termCount: z.array(
    z.number().min(5).max(15)
  ),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    termCount: [10],
    level: 'Intermediate',
  },
})

const isLoading = ref(false)
const isSaving = ref(false)
const generatedTopic = ref<GenerateTopicResponse | null>(null)

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const request: GenerateTopicRequest = {
      name: values.name,
      description: values.description || "",
      termCount: values.termCount[0],
      level: values.level,
    }
    const res = await suggestionStore.generateTopic(request);
    generatedTopic.value = res;
    isLoading.value = false
  } catch (e) {
    console.error(e)
    toast({
      title: 'The server is busy! AI is overloaded.',
      description: 'Please try this feature later.',
      variant: 'destructive',
    })
    isLoading.value = false
  }
})

async function saveTopic() {
  isSaving.value = true
  try {
    const topic = await topicStore.save({
      name: generatedTopic.value?.name || "New Topic",
      description: generatedTopic.value?.description || "",
      shortPassage: generatedTopic.value?.shortPassage || "",
    })
    const terms = generatedTopic.value?.terms.map((term, index) => {
      return {...term, id: "", topicId: topic.id, rank: index}
    }) || []
    await termStore.saveList(terms);
    router.push({name: 'TopicEdit', params: {id: topic.id}})
  } catch (e) {
    console.error(e)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>

</style>