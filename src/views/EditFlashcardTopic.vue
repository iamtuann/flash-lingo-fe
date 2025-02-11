<template>
  <div class="container">
    <div>
      <SaveTopic role="Update" />
    </div>
    <div class="mt-5">
      <!-- <template v-for="term in terms" :key="term.modifiedAt.getTime()" >
        <TermForm @delete="onDeleteTerm" v-bind="term" />
      </template> -->
      <draggable 
        class="flex flex-col gap-4"
        v-model="terms"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        v-bind="dragOptions"
        @start="drag=true" 
        @end="drag=false" 
        item-key="rank"
        @update="onUpdate"
        >
        <template #item="{element, index}">
          <TermForm
            v-bind="element" :index="index" :data-id="element.id"
            @delete="onDeleteTerm"
            @update="(data) => onUpdateTerm(index, data)"
          />
        </template>
      </draggable>
      <div
        role="button"
        class="mt-4 bg-secondary flex items-center justify-center px-5 py-8 rounded-lg text-secondary-foreground hover:text-primary"
        @click="terms.push(defaultTerm())"  
      >
        <p class="uppercase font-bold">Add flash card</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SaveTopic from '@/components/SaveTopic.vue';
import { useRoute } from "vue-router";
import { useTermStore } from "@/stores";
import { computed, ref, watch } from 'vue';
import type { Term } from '@/types';
import TermForm from '@/components/TermForm.vue';
import draggable from 'vuedraggable'

const route = useRoute();
const termStore = useTermStore();

const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([] as Term[])
const defaultTerm = (): Term => {
  return {
    topicId: topicId.value,
    term: '',
    definition: '',
    rank: terms.value.length
  }
}
const drag = ref(false)
const dragOptions = computed(() => { 
  return { animation: 200, group: "description", disabled: false, ghostClass: "ghost", }; 
});
async function getAllTerms() {
  try {
    const res = await termStore.getAllByTopicId(topicId.value)
    terms.value = res
  } catch (e) {
    console.error(e)
  }
}

async function onUpdate(event:any) {
  const oldIndex = event.oldIndex as number
  const newIndex = event.newIndex as number
  const item = event.item as HTMLElement

  terms.value[oldIndex].rank = newIndex;
  if (item.dataset.id) {
    updateRank(item.dataset.id, newIndex)
  }
}
async function updateRank(id: string | number, rank: number) {
  try {
    const res = await termStore.changeRank(id, topicId.value, rank);
  } catch (e) {
    console.error(e)
  }
}

function onUpdateTerm(index: number, data: Term) {
  terms.value[index] = data;
}

function onDeleteTerm(index: number) {
  terms.value.splice(index, 1)
}

watch(terms, () => {
  if (terms.value.length == 0) {
    terms.value.push(defaultTerm())
  }
})

getAllTerms();
</script>

<style scoped>
.ghost {
  opacity: 0.5 !important;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
</style>