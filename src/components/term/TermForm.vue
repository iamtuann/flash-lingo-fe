<template>
  <div v-if="readonly" class="bg-accent p-5 rounded-lg flex gap-4 font-semibold">
    <div class="w-1/4 min-w-24" :class="hideTerm && 'blur-md'">
      <span>{{ props.term || '- -' }}</span>
    </div>
    <div class="h-auto border-l-2 border-accent-foreground"></div>
    <div class="flex-1 ml-3 relative" :class="hideDefinition && 'blur-md'">
      <span>{{ props.definition || '' }}</span>
    </div>
  </div>
  <div v-else class="bg-accent rounded-lg" @focusin="onFocusIn" @focusout="onFocusOut" tabindex="0"
  :class="{'border border-red-500': errMsg}">
    <div class="flex items-center justify-between px-5 py-1 border-b-2 border-background">
      <span>{{ props.index + 1 }}</span>
      <div class="flex gap-2">
        <!-- <Button variant="ghost" size="icon" class="rounded-full hover:cursor-move hover:bg-primary">
          <GripHorizontal />
        </Button> -->
        <Button :disabled="disableDelete" @mousedown.stop="onDelete" size="icon" variant="ghost" class="rounded-full hover:bg-background bg-opacity-50">
          <Trash />
        </Button>
      </div>
    </div>
    <div class="px-5 py-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 ">
        <div class="grid gap-1">
          <Label> Term </Label>
          <Input
            class="bg-accent rounded-none border-0 border-b border-foreground focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2"
            v-model="formData.term"
            placeholder="Enter term"
            type="text"
          />
        </div>
        <div class="grid gap-1">
          <Label> Definition </Label>
          <Input
            class="bg-accent rounded-none border-0 border-b border-foreground focus-visible:ring-0 focus-visible:border-primary"
            v-model="formData.definition"
            placeholder="Enter definition"
            type="text"/>
        </div>
      </div>
      <p class="error-msg mt-2">{{ errMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Term } from '@/types';
import { Button } from '@/components/ui/button';
import { GripHorizontal, Trash } from 'lucide-vue-next';
import { ref } from 'vue';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import { useTermStore } from "@/stores";
import { watchDebounced } from '@vueuse/core';
import { deepCompare, getMessage } from "@/utils";

type TermFormEmits = {
  'delete': [index: number],
  'update': [payload: Term],
  'saving': [index: number, isLoading: boolean],
}
const emits = defineEmits<TermFormEmits>()
const props = defineProps<Term & {
  index: number,
  readonly?: boolean,
  hideTerm?: boolean,
  hideDefinition?: boolean,
  disableDelete?: boolean
}>()

const termStore = useTermStore()
let { index, ...rest } = props
let defaultData = rest as Term
const formData = ref<Term>({...defaultData})

const isFocused = ref(false);
let focusOutTimeout:number | null = null;
const errMsg = ref("")
const isSaving = ref(false)

const onFocusIn = () => {
  if (focusOutTimeout) {
    clearTimeout(focusOutTimeout);
  }
  isFocused.value = true;
};

const onFocusOut = () => {
  focusOutTimeout = setTimeout(() => {
    isFocused.value = false;
  }, 50);
};

watchDebounced(
  isFocused,
  () => {
    if (!isFocused.value) {
      const isEqual = deepCompare(defaultData, formData.value)
      if (!isEqual || !formData.value.id) {
        saveTerm();
      }
    }
   },
  { debounce: 2000, maxWait: 3000 },
)

async function saveTerm() {
  isSaving.value = true
  emits('saving', props.index, true)
  errMsg.value = ''
  try {
    const res = await termStore.save(formData.value)
    defaultData = {...res}
    formData.value = {...res}
    emits('update', res)
  } catch (e) {
    errMsg.value = getMessage(e)
  } finally {
    isSaving.value = false
    emits('saving', props.index, false)
  }
}

function onDelete() {
  if (!formData.value.id) {
    emits('delete', index)
    return;
  }
  try {
    termStore.delete(formData.value.topicId, formData.value.id)
    emits('delete', index)
  } catch (e) {
    console.error(e)
  }
}

</script>

<style scoped>

</style>