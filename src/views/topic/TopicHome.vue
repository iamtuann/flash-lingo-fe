<template>
  <div class="container max-w-[780px] ml-0">
    <div class="flex items-center py-2 gap-3">
      <h2 class="text-3xl font-semibold">{{ topicStore.topic?.name }}</h2>
      <Badge v-show="topicStore.topic?.status == EStatus.PRIVATE" variant="secondary" class="h-full">private</Badge>
      <Badge v-show="topicStore.topic?.status == EStatus.PUBLIC" variant="secondary" class="h-full">public</Badge>
      <Badge v-show="topicStore.topic?.status == EStatus.DRAFT" variant="secondary" class="h-full">draft</Badge>
      <div class="flex-1"></div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="secondary" class="">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-44" :sideOffset="12" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem class="cursor-pointer" :as="RouterLink" :to="{name: 'TopicEdit', params: {id: topicId}}">
                <Pencil class="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <Dialog v-model:open="dialogDeleteTopic">
                <DialogTrigger class="w-full">
                  <DropdownMenuItem class="text-red-500 cursor-pointer focus:text-red-500" @select="(e) => e.preventDefault()">
                    <TrashIcon :strokeWidth="3" class="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent @interactOutside="(e) => {e.preventDefault()}">
                  <DialogHeader>
                    <DialogTitle>Delete this topic?</DialogTitle>
                    <DialogDescription>
                      The topic will be permanently deleted! Are you sure?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter class="mt-4">
                    <Button variant="outline" @click="dialogDeleteTopic = false">Cancel</Button>
                    <Button variant="destructive" @click="deleteTopic">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <p class="opacity-60">{{ topicStore.topic?.description }}</p>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
      <RouterLink :to="{name: 'TopicFlashcards', params: {id: topicId}}" class=" py-4 px-6 rounded-lg bg-[#316cdd] text-white flex items-center justify-between">
        <span class="text-lg font-semibold">Flashcards</span>
        <img src="@/assets/images/flash-card.png" width="50px" alt="">
      </RouterLink>
      <RouterLink :to="{name: 'QuizConfig', params: {id: topicId}}" class=" py-4 px-6 rounded-lg bg-[#316cdd] text-white flex items-center justify-between">
        <span class="text-lg font-semibold">Quiz</span>
        <img src="@/assets/images/flash-card.png" width="50px" alt="">
      </RouterLink>
      <RouterLink :to="'/'" class=" py-4 px-6 rounded-lg bg-[#316cdd] text-white flex items-center justify-between">
        <span class="text-lg font-semibold">Test</span>
        <img src="@/assets/images/flash-card.png" width="50px" alt="">
      </RouterLink>
      <RouterLink :to="'/'" class=" py-4 px-6 rounded-lg bg-[#316cdd] text-white flex items-center justify-between">
        <span class="text-lg font-semibold">Games</span>
        <img src="@/assets/images/flash-card.png" width="50px" alt="">
      </RouterLink>
    </div>
    <div class="mt-5 flex items-center gap-3 flex-wrap">
      <div class="flex items-center space-x-2" v-if="topicStore.topic?.status != 2">
        <Switch :model-value="!!topicStore.topic?.status" @update:model-value="updateStatus" />
        <Label>Public mode</Label>
      </div>
      <div class="flex-1"></div>
      <div class="flex gap-3">
        <Button variant="outline" @click="toggleHideTerm" class="bg-accent">
          {{ hideTerm ? 'Show terms' : 'Hide terms' }}
        </Button>
        <Button variant="outline" @click="toggleHideDefinition" class="bg-accent">
          {{ hideDefinition ? 'Show definitions' : 'Hide definitions' }}
        </Button>
      </div>
    </div>
    <div v-if="isLoading" class="mt-5 grid gap-4">
      <Skeleton v-for="i in 3" :key="i" class="h-16 rounded-lg bg-accent" />
    </div>
    <div v-else class="mt-5 flex flex-col gap-4">
      <template v-for="(term, idx) in terms" :key="term.id" >
        <TermForm v-bind="term" :index="idx" readonly :hide-term="hideTerm" :hide-definition="hideDefinition" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTermStore, useTopicStore } from "@/stores";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { EStatus, type Topic, type Term } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { EllipsisVertical, Pencil, TrashIcon } from "lucide-vue-next";
import TermForm from "@/components/term/TermForm.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const route = useRoute()
const router = useRouter()
const termStore = useTermStore()
const topicStore = useTopicStore();

const topicId = ref(route.params.id as string)
const topic = ref<Topic>()
const terms = ref<Term[]>([] as Term[])
const hideTerm = ref(false);
const hideDefinition = ref(false);
const isLoading = ref(false)
const dialogDeleteTopic = ref(false)
const isDeleting = ref(false)

function toggleHideTerm() {
  hideTerm.value = !hideTerm.value
  hideTerm.value ? hideDefinition.value = false : '';
}
function toggleHideDefinition() {
  hideDefinition.value = !hideDefinition.value
  hideDefinition.value ? hideTerm.value = false : '';
}

async function updateStatus(data: boolean) {
  try {
    const status = data ? EStatus.PUBLIC : EStatus.PRIVATE
    await topicStore.changeStatus(topicId.value, status)
  } catch (e) {
    console.error(e)
  }
}
async function deleteTopic() {
  isDeleting.value = true;
  try {
    await topicStore.delete(topicId.value)
    dialogDeleteTopic.value = false;
  } catch (e) {
    console.log(e)
  } finally {
    isDeleting.value = false
    router.replace({name: 'Home'})
  }
}

async function getData() {
  isLoading.value = true
  try {
    const res = await Promise.all([
      topicStore.getById(topicId.value),
      termStore.getAllByTopicId(topicId.value)
    ])
    topic.value = res[0]
    terms.value = res[1]
    if (topic.value.status == EStatus.DRAFT) {
      router.replace({name: 'TopicEdit', params: {id: topicId.value}})
    } else if (!route.params.slug || topic.value.slug != route.params.slug) {
      router.replace({name: 'TopicHome', params: {id: topic.value.id, slug: topic.value.slug}})
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false
  }
}

getData();
</script>

<style scoped>

</style>