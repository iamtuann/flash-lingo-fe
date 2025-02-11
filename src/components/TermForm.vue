<template>
  <div class="bg-secondary rounded-lg" @focusin="onFocusIn" @focusout="onFocusOut" tabindex="0"
  :class="{'border border-red-500': errMsg}">
    <div class="flex items-center justify-between px-5 py-3 border-b-2 border-background">
      <span>{{ props.index + 1 }}</span>
      <div class="flex gap-2">
        <Button variant="ghost" size="icon" class="rounded-full hover:cursor-move hover:bg-primary">
          <GripHorizontal />
        </Button>
        <Button @mousedown.stop="onDelete" size="icon" variant="ghost" class="rounded-full hover:bg-background bg-opacity-50">
          <Trash />
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-4 px-5 py-5">
      <div class="grid gap-1">
        <Label> Term </Label>
        <Input
          class="bg-secondary rounded-none border-0 border-b border-foreground focus-visible:ring-0 focus-visible:border-primary focus-visible:border-b-2"
          v-model="formData.term"
          placeholder="Enter term"
          type="text"
        />
      </div>
      <div class="grid gap-1">
        <Label> Definition </Label>
        <Input
          class="bg-secondary rounded-none border-0 border-b border-foreground focus-visible:ring-0 focus-visible:border-primary"
          v-model="formData.definition"
          placeholder="Enter definition"
          type="text"/>
      </div>
      <p class="error-msg mt-2">{{ errMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Term } from '@/types';
import Button from './ui/button/Button.vue';
import { GripHorizontal, Trash } from 'lucide-vue-next';
import { ref } from 'vue';
import Label from './ui/label/Label.vue';
import Input from './ui/input/Input.vue';
import { useTermStore } from "@/stores";
import { watchDebounced } from '@vueuse/core';
import { deepCompare, getMessage } from "@/utils";

type TermFormEmits = {
  'delete': [index: number],
  'update': [payload: Term]
}
const emits = defineEmits<TermFormEmits>()
const props = defineProps<Term & {index: number}>()
const termStore = useTermStore()

let { index, ...rest } = props
let defaultData = rest as Term
const formData = ref<Term>({...defaultData})

const isFocused = ref(false);
let focusOutTimeout:number | null = null;
const errMsg = ref("")

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
  errMsg.value = ''
  try {
    const res = await termStore.save(formData.value)
    defaultData = {...res}
    formData.value = {...res}
    emits('update', res)
  } catch (e) {
    errMsg.value = getMessage(e)
  }
}

function onDelete() {
  if (!formData.value.id) {
    emits('delete', index)
    return;
  }
  try {
    const res = termStore.delete(formData.value.topicId, formData.value.id)
    emits('delete', index)
  } catch (e) {
    console.error(e)
  }
}

</script>

<style scoped>

</style>