<template>
  <Dialog v-model:open="model" >
    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Edit Term</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="edit-term" required>Term</Label>
            <PopperInput
              placeholder="Enter the term"
              v-model="formData.term"
              @update:model-value="getSuggestWords"
              :items="wordSuggestions"
              @select="onSelectSuggestWord"
            >
              <template #item="{item}">
                {{ item.word }} 
                <span v-if="item.pronunciation" class="text-muted-foreground ml-2">{{ item.pronunciation }}</span>
              </template>
            </PopperInput>
          </div>

          <div class="space-y-2">
            <Label for="edit-pronunciation">Pronunciation</Label>
            <PopperInput
              placeholder="e.g. /ˈvəʊˌkæbjʊləri/"
              v-model="formData.pronunciation"
              @update:model-value="getPronunciation"
              :items="pronunSuggestions"
              @select="onSelectPronun"
            @focus-input="getPronunciation"
            >
            </PopperInput>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="edit-definition" required>Definition</Label>
          <PopperInput
            placeholder="Enter the definition"
            v-model="formData.definition"
            @update:model-value="getSuggestDefinition"
            :items="defSuggestions"
            @select="onSelectSuggestDefinition"
            @focus-input="getSuggestDefinition"
          >
          </PopperInput>
        </div>

        <div class="space-y-2">
          <Label for="edit-example">Example Usage</Label>
          <Input
            id="edit-example"
            placeholder="Enter an example sentence using this term"
            v-model="formData.example"
          />
        </div>
      </div>

      <DialogFooter>
        <Button :disabled="isSaving" variant="outline" @click="model = false">
          Cancel
        </Button>
        <Button @click="saveTerm" class="flex items-center gap-1">
          <LoaderCircle v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          Save Term
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { Word, Term } from '@/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ref, watch } from 'vue';
import { LoaderCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useTermStore, useSuggestionStore } from '@/stores';
import { getMessage } from '@/utils';
import { useDebounceFn } from '@vueuse/core';
import { PopperInput } from '../ui/popper';

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
const errMsg = ref('')
const formData = ref<Term>({...props.term})

watch(model, () => {
  formData.value = {...props.term}
})
const wordSuggestions = ref<Word[]>([])
const defSuggestions = ref<string[]>([])
const pronunSuggestions = ref<string[]>([])

const getSuggestWords = useDebounceFn(async () => {
  try {
    if (formData.value.term) {
      const res = await suggestionStore.getSuggestWords(formData.value.term)
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
    if (formData.value.term) {
      const res = await suggestionStore.getSuggestionDefinitions(formData.value.term, formData.value.definition)
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
    if (formData.value.term) {
      const res = await suggestionStore.getPronunciation(formData.value.term, formData.value.pronunciation)
      pronunSuggestions.value = res.suggestions
    } else {
      pronunSuggestions.value = []
    }
  } catch (e) {
    console.error(e);
  }
}, 1000)

const onSelectSuggestWord = (word: Word) => {
  formData.value.term = word.word
  formData.value.pronunciation = word.pronunciation
  wordSuggestions.value = []
}

const onSelectSuggestDefinition = (definition: string) => {
  formData.value.definition = definition
  defSuggestions.value = []
}

const onSelectPronun = (pronun: string) => {
  formData.value.pronunciation = pronun;
  pronunSuggestions.value = []
}

async function saveTerm() {
  isSaving.value = true
  errMsg.value = ''
  try {
    const res = await termStore.save(formData.value)
    emits('update', res)
  } catch (e) {
    errMsg.value = getMessage(e)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>

</style>