<template>
  <div v-show="isCoping" class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>
  <div class="container py-2 md:py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-start py-2 gap-3">
        <h2 class="text-2xl md:text-3xl font-semibold">{{ topicStore.topic?.name }}</h2>
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
                <DropdownMenuItem v-if="isEditable" class="cursor-pointer" :as="RouterLink" :to="{name: 'TopicEdit', params: {id: topicId}}">
                  <Pencil class="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleCopyTopic" class="cursor-pointer">
                  <LoaderCircle v-if="isCoping" class="mr-2 h-4 w-4 animate-spin" />
                  <Copy v-else class="mr-2 h-4 w-4" />
                  <span>Make a copy</span>
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer" @click="handleShowAddDialog">
                  <FolderPlus class="mr-2 h-4 w-4" />
                  <span>Add to folder</span>
                </DropdownMenuItem>
                <Dialog v-if="isEditable" v-model:open="dialogDeleteTopic">
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
                      <Button :disabled="isDeleting" variant="outline" @click="dialogDeleteTopic = false">Cancel</Button>
                      <Button :disabled="isDeleting" variant="destructive" @click="deleteTopic">Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p class="opacity-60">{{ topicStore.topic?.description }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <HoverCard :as="RouterLink" :to="{name: 'TopicFlashcards', params: {id: topicId}}" title="Flashcards" color="#ffd861">
          <template v-slot:icon>
            <Layers color="#4C5656" :stroke-width="1.5" class="w-6 h-6 sm:w-10 sm:h-10" />
          </template>
        </HoverCard>
        <HoverCard :as="RouterLink" :to="{name: 'QuizConfig', params: {id: topicId}}" title="Quiz" color="#ceb2fc">
          <template v-slot:icon>
            <GraduationCap color="#4C5656" :stroke-width="1.5" class="w-6 h-6 sm:w-10 sm:h-10" />
          </template>
        </HoverCard>
        <HoverCard :as="RouterLink" :to="{name: 'TopicTest', params: {id: topicId}}" title="Test" color="#dce9ff">
          <template v-slot:icon>
            <FileText color="#4C5656" :stroke-width="1.5" class="w-6 h-6 sm:w-10 sm:h-10" />
          </template>
        </HoverCard>
        <HoverCard :as="RouterLink" :to="{name: 'GameBar', params: {id: topicId}}" title="Games" color="#ff705f">
          <template v-slot:icon>
            <Gamepad color="#4C5656" :stroke-width="1.5" class="w-6 h-6 sm:w-10 sm:h-10" />
          </template>
        </HoverCard>
      </div>
      <div class="mt-5 flex items-center gap-3 flex-wrap">
        <div class="flex items-center space-x-2" v-if="topicStore.topic?.status != 2 && isEditable">
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
      <div v-else class="mt-6 flex flex-col gap-4">
        <template v-for="(term) in terms" :key="term.id" >
          <TermItem :term="term" :hide-term="hideTerm" :hide-definition="hideDefinition" />
        </template>
      </div>
    </div>
  </div>
  <AddToFoldersDialog v-model="showAddDialog" @add-success="showAddDialog = false" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTermStore, useTopicStore } from "@/stores";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { EStatus, type Topic, type Term } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Copy, EllipsisVertical, FileText, FolderPlus, Gamepad, GraduationCap, Layers, LoaderCircle, Pencil, TrashIcon } from "lucide-vue-next";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import HoverCard from "@/components/hover-card/HoverCard.vue";
import TermItem from "@/components/term/TermItem.vue";
import { editableTopic } from "@/utils";
import AddToFoldersDialog from "./AddToFoldersDialog.vue";
import { useAuthGuard } from "@/composable/use-auth-guard";

const route = useRoute()
const router = useRouter()
const termStore = useTermStore()
const topicStore = useTopicStore();
const { requireAuth } = useAuthGuard()
const isEditable = ref(false);

const topicId = computed(() => route.params.id as string)
const topic = ref<Topic>()
const terms = ref<Term[]>([] as Term[])
const hideTerm = ref(false);
const hideDefinition = ref(false);
const isLoading = ref(false)
const dialogDeleteTopic = ref(false)
const isDeleting = ref(false)
const isCoping = ref(false)
const showAddDialog = ref(false)

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

function handleCopyTopic() {
  requireAuth(async () => {
    try {
      isCoping.value = true
      const topic = await topicStore.save({
        name: topicStore.topic?.name ? topicStore.topic.name + " Copy" : "New Topic",
        description: topicStore.topic?.description || ""
      })
      const newTerms = terms.value.map(term => {
        return {...term, id: "", topicId: topic.id}
      })
      await termStore.saveList(newTerms);
      isCoping.value = false
      router.push({name: 'TopicEdit', params: {id: topic.id}})
    } catch (e) {
      console.error(e)
      isCoping.value = false
    }
  })
}

function handleShowAddDialog() {
  requireAuth(() => {
    showAddDialog.value = true
  })
}

async function deleteTopic() {
  isDeleting.value = true;
  try {
    await topicStore.delete(topicId.value)
    dialogDeleteTopic.value = false;
  } catch (e) {
    console.error(e)
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
    if (editableTopic(topic.value)) {
      isEditable.value = true
    }
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