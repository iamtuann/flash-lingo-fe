<template>
  <Dialog v-model:open="model">
    <DialogContent class="max-w-3xl">
      <form class="space-y-4" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit Term</DialogTitle>
        </DialogHeader>
  
        <div class="space-y-4 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="term">
              <FormItem>
                <FormLabel required>Term</FormLabel>
                <FormControl>
                  <PopperInput
                    placeholder="Enter the term"
                    v-bind="componentField"
                    @update:model-value="getSuggestWords"
                    :items="wordSuggestions"
                    @select="onSelectSuggestWord"
                  >
                    <template #item="{item}">
                      {{ item.word }} 
                      <span v-if="item.pronunciation" class="text-muted-foreground ml-2">{{ item.pronunciation }}</span>
                    </template>
                  </PopperInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="pronunciation">
              <FormItem>
                <FormLabel>Pronunciation</FormLabel>
                <FormControl>
                  <PopperInput
                    placeholder="e.g. /ˈvəʊˌkæbjʊləri/"
                    v-bind="componentField"
                    @update:model-value="getPronunciation"
                    :items="pronunSuggestions"
                    @select="onSelectPronun"
                    @focus-input="getPronunciation"
                  >
                  </PopperInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
  
          <FormField v-slot="{ componentField }" name="definition">
            <FormItem>
              <FormLabel required>Definition</FormLabel>
              <FormControl>
                <PopperInput
                  placeholder="Enter the definition"
                  v-bind="componentField"
                  @update:model-value="getSuggestDefinition"
                  :items="defSuggestions"
                  @select="onSelectSuggestDefinition"
                  @focus-input="getSuggestDefinition"
                >
                </PopperInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="example">
            <FormItem>
              <FormLabel>Example Usage</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter an example sentence using this term" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
  
        <DialogFooter>
          <Button :disabled="isSaving" variant="outline" @click="model = false">
            Cancel
          </Button>
          <Button type="submit" class="flex items-center gap-1">
            <LoaderCircle v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            Save Term
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { Word, Term } from '@/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ref, watch } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useTermStore, useSuggestionStore } from '@/stores';
import { useDebounceFn } from '@vueuse/core';
import { PopperInput } from '../ui/popper';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod'
import { useForm } from 'vee-validate';

type TermFormEmits = {
  'update': [payload: Term],
}
const emits = defineEmits<TermFormEmits>()
const props = defineProps<{
  term: Term
}>()
const model = defineModel<boolean>()

const termStore = useTermStore()
const suggestionStore = useSuggestionStore()

const isSaving = ref(false)
const wordSuggestions = ref<Word[]>([])
const defSuggestions = ref<string[]>([])
const pronunSuggestions = ref<string[]>([])

const formSchema = toTypedSchema<any, Term, Term>(z.object({
  id: z.string().or(z.number()).optional(),
  topicId: z.string().or(z.number()).optional(),
  term: z.string().nonempty({ message: 'This is required'}),
  pronunciation: z.string().or(z.null()).optional(),
  definition: z.string().nonempty({ message: 'This is required'}),
  example: z.string().or(z.null()).optional(),
  partOfSpeech: z.string().or(z.null()).optional(),
  level: z.string().or(z.null()).optional(),
  rank: z.number().optional(),
}))
const {resetForm, handleSubmit, setValues, values} = useForm({
  validationSchema: formSchema,
})
watch(model, () => {
  resetForm({values: {...props.term}})
})

const onSubmit = handleSubmit(async (values) => {
  isSaving.value = true
  try {
    const res = await termStore.save(values)
    emits('update', res)
  } catch (e) {
    console.error(e);
  } finally {
    isSaving.value = false
  }
})

const getSuggestWords = useDebounceFn(async () => {
  try {
    if (values.term) {
      const res = await suggestionStore.getSuggestWords(values.term)
      wordSuggestions.value = res.suggestions
    } else {
      wordSuggestions.value = []
    }
  } catch (e) {
    console.error(e);
  }
}, 1000)

const getSuggestDefinition = useDebounceFn(async () => {
  try {
    if (values.term) {
      const res = await suggestionStore.getSuggestionDefinitions(values.term, values.definition)
      defSuggestions.value = res.suggestions
    } else {
      defSuggestions.value = []
    }
  } catch (e) {
    console.error(e);
  }
}, 1000)

const getPronunciation = useDebounceFn(async () => {
  try {
    if (values.term) {
      const res = await suggestionStore.getPronunciation(values.term, values.pronunciation)
      pronunSuggestions.value = res.suggestions
    } else {
      pronunSuggestions.value = []
    }
  } catch (e) {
    console.error(e);
  }
}, 1000)

const onSelectSuggestWord = (word: Word) => {
  setValues({
    term: word.word,
    pronunciation: word.pronunciation
  })
  wordSuggestions.value = []
}

const onSelectSuggestDefinition = (definition: string) => {
  setValues({
    definition: definition
  })
  defSuggestions.value = []
}

const onSelectPronun = (pronun: string) => {
  setValues({
    pronunciation: pronun
  })
  pronunSuggestions.value = []
}
</script>

<style scoped>

</style>