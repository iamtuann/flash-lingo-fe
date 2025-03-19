<template>
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between py-4 sticky top-0 bg-background">
        <div class="flex items-center gap-4">
          <Button 
            v-if="topic?.status != EStatus.DRAFT"
            :as="RouterLink" :to="{'name': 'TopicHome', params: {id: topicId, slug: topic?.slug || ''}}"
            variant="ghost" class="rounded-full w-10 h-10 border-2 border-border"
          >
            <ChevronLeft class="!size-6" />
          </Button>
          <span>{{ statusText }}</span>
        </div>
        <div>
          <Button :disabled="(isLoading.saveTopic || isLoading.topic) || terms.length < 2"
            v-if="topic?.status == 2" @click="createTopic"
          >
            Create Flashcards
            <LoaderCircle v-if="isLoading.saveTopic" class="mr-2 h-4 w-4 animate-spin" />
          </Button>
          <Button v-else :disabled="isSaving" @click="router.push({name: 'TopicHome', params: {id: topicId, slug: topic?.slug || ''}})">
            Done
          </Button>
        </div>
      </div>
      <div v-if="!isEditingTopic">
        <h2 class="text-2xl font-semibold py-2">
          {{ topic?.name }}
          <Button variant="ghost" size="sm" class="rounded-full" @click="isEditingTopic = true">
            <PencilIcon />
          </Button>
        </h2>
        <p class="opacity-60">{{ topic?.description }}</p>
      </div>
      <TopicForm v-else
        role="update" cancelable
        @cancel="isEditingTopic = false"
        @success="onUpdateSuccess"
        />
      <div v-if="isLoading.terms" class="mt-5 grid gap-4">
        <Skeleton v-for="i in 2" class="h-40 rounded-lg" :key="i" />
      </div>
      <div v-else class="mt-5">
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
          @update="onUpdateDrag"
        >
          <template #item="{element, index}">
            <TermForm
              v-bind="element" :index="index" :data-id="element.id"
              @delete="onDeleteTerm"
              @update="(data) => onUpdateTerm(index, data)"
              @saving="onSavingTerm"
              :disable-delete="terms.length < 2"
            />
          </template>
        </draggable>
        <div
          role="button"
          class="mt-4 bg-accent flex items-center justify-center px-5 py-8 rounded-lg text-secondary-foreground hover:text-primary"
          @click="terms.push(defaultTerm())"  
        >
          <p class="uppercase font-bold">Add flash card</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useTermStore, useTopicStore } from "@/stores";
import { computed, reactive, ref, watch } from 'vue';
import { type Topic, type Term, EStatus } from '@/types';
import TermForm from '@/components/term/TermForm.vue';
import draggable from 'vuedraggable'
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle, PencilIcon } from "lucide-vue-next";
import { Skeleton } from "@/components/ui/skeleton";
import TopicForm from "@/components/topic/TopicForm.vue";

const route = useRoute();
const router = useRouter()
const termStore = useTermStore();
const topicStore = useTopicStore()

const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([] as Term[])
const topic = ref<Topic | null>(null)
const defaultTerm = (): Term => {
  return {
    topicId: topicId.value,
    term: '',
    definition: '',
    rank: terms.value.length
  }
}
const isEditingTopic = ref(false)
const activeRequests = ref<Set<number>>(new Set());
const isSaving = computed(() => activeRequests.value.size > 0);
const statusText = computed(() => (isSaving.value ? "Saving..." : "Saved"));

const isLoading = reactive({
  topic: false,
  terms: false,
  saveTopic: false
})
const drag = ref(false)
const dragOptions = computed(() => { 
  return { animation: 200, group: "description", disabled: false, ghostClass: "ghost", }; 
});

async function createTopic() {
  isLoading.saveTopic = true
  try {
    const res = await topicStore.changeStatus(topicId.value, EStatus.PRIVATE)
    router.push({name: 'TopicHome', params: {id: res.id, slug: res.slug}})
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.saveTopic = false
  }
}

async function getAllTerms() {
  isLoading.terms = true
  isLoading.topic = true
  try {
    const [termRes, topicRes] = await Promise.allSettled([
      termStore.getAllByTopicId(topicId.value),
      topicStore.getById(topicId.value)
    ]) 
    if (termRes.status == 'fulfilled') {
      terms.value = termRes.value
    }
    if (topicRes.status == 'fulfilled') {
      topic.value = topicRes.value
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.terms = false
    isLoading.topic = false
  }
}

function onUpdateSuccess(data: Topic) {
  topic.value = data;
  isEditingTopic.value = false
}

function onSavingTerm(index: number, isLoading: boolean) {
  if (isLoading) {
    activeRequests.value.add(index);
  } else {
    activeRequests.value.delete(index);
  }
};

async function onUpdateDrag(event:any) {
  const oldIndex = event.oldIndex as number
  const newIndex = event.newIndex as number
  const item = event.item as HTMLElement

  terms.value[oldIndex].rank = newIndex;
  if (item.dataset.id) {
    updateRank(item.dataset.id, newIndex)
  }
}

async function updateRank(id: string | number, rank: number) {
  onSavingTerm(rank, true)
  try {
    await termStore.changeRank(id, topicId.value, rank);
  } catch (e) {
    console.error(e)
  } finally {
    onSavingTerm(rank, false)
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