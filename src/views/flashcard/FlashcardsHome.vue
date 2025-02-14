<template>
  <div class="container max-w-[680px] mx-auto">
    <div class="flex items-center justify-between py-2">
      <h2 class="text-3xl font-semibold">{{ topicStore.topic?.name }}</h2>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="secondary" class="">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-44" :sideOffset="12" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem class="cursor-pointer" :as="RouterLink" :to="{name: 'EditFlashcards', params: {id: topicId}}">
                <Pencil class="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem class="text-red-500 cursor-pointer focus:text-red-500">
                <Trash :strokeWidth="3" class="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
      <RouterLink :to="'/'" class=" py-4 px-6 rounded-lg bg-[#316cdd] text-white flex items-center justify-between">
        <span class="text-lg font-semibold">Flashcards</span>
        <img src="@/assets/images/flash-card.png" width="50px" alt="">
      </RouterLink>
      <RouterLink :to="'/'" class=" py-4 px-6 rounded-lg bg-[#316cdd] text-white flex items-center justify-between">
        <span class="text-lg font-semibold">Learn</span>
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
    <div class="mt-5 flex justify-end gap-3">
      <Button variant="outline" @click="toggleHideTerm" class="bg-accent">
        {{ hideTerm ? 'Show terms' : 'Hide terms' }}
      </Button>
      <Button variant="outline" @click="toggleHideDefinition" class="bg-accent">
        {{ hideDefinition ? 'Show definitions' : 'Hide definitions' }}
      </Button>
    </div>
    <div class="mt-5 flex flex-col gap-4">
      <template v-for="(term, idx) in terms" :key="term.id" >
        <TermForm v-bind="term" :index="idx" readonly :hide-term="hideTerm" :hide-definition="hideDefinition" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTermStore, useTopicStore } from "@/stores";
import { RouterLink, useRoute } from "vue-router";
import type { Term } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash } from "lucide-vue-next";
import TermForm from "@/components/TermForm.vue";

const route = useRoute()
const termStore = useTermStore()
const topicStore = useTopicStore();

const topicId = ref(route.params.id as string)
const terms = ref<Term[]>([] as Term[])
const hideTerm = ref(false);
const hideDefinition = ref(false);

function toggleHideTerm() {
  hideTerm.value = !hideTerm.value
  hideTerm.value ? hideDefinition.value = false : '';
}
function toggleHideDefinition() {
  hideDefinition.value = !hideDefinition.value
  hideDefinition.value ? hideTerm.value = false : '';
}

async function getData() {
  const res = await Promise.all([
    topicStore.getById(topicId.value),
    termStore.getAllByTopicId(topicId.value)
  ])
  terms.value = res[1]
}

getData();
</script>

<style scoped>

</style>