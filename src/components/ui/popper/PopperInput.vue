<template>
  <div class="relative" ref="popper">
    <Input
      :autocomplete="false"
      :placeholder="placeholder"
      v-model="model"
      @update:model-value="showContent = true"
      @focus="$emit('focus-input'); showContent = true"
      required
    />
    <div v-show="items.length > 0 && showContent"
      tabindex="1"
      class="absolute z-10 w-full p-1 bg-background text-foreground rounded-md border border-border top-11 text-sm shadow-sm"
    >
      <div v-for="(item, index) in items"
        :key="index"
        class="px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-default"
        @click="$emit('select', item)"
      >
        <slot name="item" :item="item">
          {{ item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { Input } from '@/components/ui/input';
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';


const emits = defineEmits<{
  'select': [answer: T];
  'focus-input': [];
}>()
const props = defineProps<{
  items: T[],
  placeholder?: string,
}>()
const model = defineModel<string>()

const popper = useTemplateRef<HTMLElement>('popper')
const showContent = ref(false)

onClickOutside(popper, () => {
  showContent.value = false
})
</script>

<style scoped>

</style>