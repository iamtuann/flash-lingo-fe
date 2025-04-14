<template>
  <Dialog v-model:open="model">
    <DialogContent class="max-w-3xl" @interactOutside="(e) => {e.preventDefault()}">
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

          <div class="flex items-end justify-center gap-4">
            <div class="flex-1">
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
            </div>
            <Dialog v-model:open="dialogPhotos" @update:open="searchImg = values.term">
              <DialogTrigger as-child>
                <div class="w-28 h-20 flex items-center justify-center border rounded-md overflow-hidden relative cursor-pointer">
                  <span v-if="!values.imageUrl" class="text-xs text-muted-foreground">Select image</span>
                  <img v-else :src="values.imageUrl" class="w-full h-full object-cover" :alt="values.term">
                  <Button @click.stop="setValues({imageUrl: ''})" v-if="values.imageUrl" type="button" variant="destructive" class="absolute px-2 w-6 h-7 top-1 right-1">
                    <Trash class="!w-4 !h-4" />
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[500px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[80dvh]">
                <div class="p-4 pb-0">
                  <DialogTitle>Search image</DialogTitle>
                  <Input class="mt-4" v-model="searchImg"/>
                </div>
                <div class="photos-wrap overflow-y-auto px-4 pb-4">
                  <div class="flex justify-center">
                    <LoaderCircle class="animate-spin w-5 transition-all origin-center" :class="isLoadingPhoto ? 'h-5 mb-2' : 'h-0'" />
                  </div>
                  <div v-if="photos.length > 0" class="gap-4 columns-3 space-y-4">
                    <img 
                      v-for="photo in photos" :key="photo.id" 
                      :src="photo.src" class="h-auto max-w-full rounded-lg" :alt="photo.alt"
                      @click="onSelectImage(photo.src)"
                    >
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
          </div>
  

          <FormField v-slot="{ componentField }" name="example">
            <FormItem>
              <FormLabel>Example Usage</FormLabel>
              <FormControl>
                <div class="relative">
                  <Textarea rows="2" class="resize-none pr-10" placeholder="Enter an example sentence using this term" v-bind="componentField" />
                  <TooltipProvider>
                    <Tooltip :delay-duration="0">
                      <TooltipTrigger as-child type="button">
                        <Button 
                          :disabled="!values.term || !values.definition || isGeneratingExam"
                          @click="generateExamples"
                          variant="ghost" size="icon" type="button"
                          class="absolute right-1 top-1 cursor-pointer"
                        >
                          <div class="ai-icon" ></div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="center" side="top" class="flex items-center">
                        <p>{{ (values.term && values.definition) ? 'Generate examples with AI' : 'Fill term and definition to use' }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormControl>
              <div class="flex">
                <FormMessage />
                <div class="flex-1"></div>
                <div v-if="examples.length > 0" class="flex gap-1 items-center text-xs text-muted-foregrounds">
                  <Button type="button" variant="ghost"
                    class="w-6 h-6 p-0 cursor-pointer"
                    :disabled="currentExamIndex <= 0"
                    @click="currentExamIndex--"
                  >
                    <ChevronLeft :size="16"/>
                  </Button>
                  <span>{{currentExamIndex + 1}} / {{ examples.length }}</span>
                  <Button type="button" variant="ghost"
                    class="w-6 h-6 p-0 cursor-pointer"
                    :disabled="currentExamIndex >= examples.length - 1"
                    @click="currentExamIndex++"
                  >
                    <ChevronRight :size="16"/>
                  </Button>
                </div>
              </div>
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
import type { Word, Term, Photo } from '@/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { onUnmounted, ref, watch } from 'vue';
import { ChevronLeft, ChevronRight, LoaderCircle, Trash } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useTermStore, useSuggestionStore } from '@/stores';
import { useDebounceFn } from '@vueuse/core';
import { PopperInput } from '../ui/popper';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod'
import { useForm } from 'vee-validate';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type TermFormEmits = {
  'update': [payload: Term],
}
const emits = defineEmits<TermFormEmits>()
const props = defineProps<{
  term: Term
}>()
const model = defineModel<boolean>()
const dialogPhotos = ref(false)

const termStore = useTermStore()
const suggestionStore = useSuggestionStore()

const isSaving = ref(false)
const isGeneratingExam = ref(false)
const wordSuggestions = ref<Word[]>([])
const defSuggestions = ref<string[]>([])
const pronunSuggestions = ref<string[]>([])
const examples = ref<string[]>([])
const currentExamIndex = ref(-1)
const searchImg = ref("")
const photos = ref<Photo[]>([])
const isLoadingPhoto = ref(false)

const formSchema = toTypedSchema<any, Term, Term>(z.object({
  id: z.string().or(z.number()).optional(),
  topicId: z.string().or(z.number()).optional(),
  term: z.string().nonempty({ message: 'This is required'}),
  pronunciation: z.string().or(z.null()).optional(),
  definition: z.string().nonempty({ message: 'This is required'}),
  example: z.string().or(z.null()).optional(),
  partOfSpeech: z.string().or(z.null()).optional(),
  level: z.string().or(z.null()).optional(),
  imageUrl: z.string().or(z.null()).optional(),
  rank: z.number().optional(),
}))
const {resetForm, handleSubmit, setValues, values} = useForm({
  validationSchema: formSchema,
})
watch(model, () => {
  if (model.value) {
    resetForm({values: {...props.term}})
  } else {
    photos.value = []
    examples.value = []
    wordSuggestions.value = []
    pronunSuggestions.value = []
    defSuggestions.value = []
    currentExamIndex.value = -1
  }
})

watch(currentExamIndex, (newIndex) => {
  if (newIndex >= 0 && newIndex < 3) {
    setValues({
      example: examples.value[newIndex]
    })
  }
})

watch(searchImg, () => {
  handleSearchImage()
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

const handleSearchImage = useDebounceFn(async () => {
  try {
    if (searchImg.value) {
      isLoadingPhoto.value = true
      const res = await suggestionStore.searchPhotos(searchImg.value)
      photos.value = res.content
      isLoadingPhoto.value = false
    }
  } catch (e) {
    console.error(e);
    isLoadingPhoto.value = false
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

const onSelectImage = (src: string) => {
  setValues({
    imageUrl: src
  })
  dialogPhotos.value = false;
}

async function generateExamples() {
  isGeneratingExam.value = true
  try {
    const res = await suggestionStore.generateExamples(values.term, values.definition);
    if (res && res.length > 0) {
      examples.value = res
      currentExamIndex.value=0
    }
    setTimeout(() => {
      isGeneratingExam.value = false
    }, 10000);
  } catch (e) {
    console.error(e);
    isGeneratingExam.value = false
  }
}
</script>

<style scoped>
.ai-icon {
  width: 28px;
  height: 28px;
  background: linear-gradient(90deg, #8c52ff, #ff914d);
  -webkit-mask-image: url('@/assets/images/stars-icon.png');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;

  mask-image: url('@/assets/images/stars-icon.png');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}
.photos-wrap {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
</style>