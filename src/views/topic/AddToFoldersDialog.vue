<template>
  <Dialog v-model:open="model">
      <DialogContent class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[70dvh]">
        <DialogHeader class="p-6 pb-0">
          <DialogTitle>Add to folders</DialogTitle>
        </DialogHeader>
        <div ref="el" class="flex flex-col gap-1 overflow-y-auto px-4 pb-4">
          <div v-for="folder in folders" :key="folder.id" class="flex gap-3 py-4 px-3 items-center rounded-lg hover:bg-secondary transition-all">
            <div class="h-10 w-10 flex items-center justify-center rounded-md bg-secondary">
              <FolderIcon />
            </div>
            <div>
              <p>{{ folder.name }}</p>
              <p class="text-xs">
                <span>{{ folder.topicIds.length }} topics</span> -
                <span>by you</span>
              </p>
            </div>
            <div class="flex-1"></div>
            <div>
              <Checkbox
                :disabled="folder.topicIds.includes(Number(topicId))"
                :model-value="isChecked(folder)"
                @update:model-value="(v: boolean | 'indeterminate') => handleChange(v as boolean, folder.id as number)"
              />
            </div>
          </div>
          <div v-show="isLoading" class="py-3 px-3 mt-2 rounded-md bg-secondary text-center">Loading...</div>
        </div>
        <DialogFooter class="px-6 pb-4 ml-auto">
          <Button :disabled="folderIds.length == 0" @click="addToFolder">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTopicStore, useUserStore, useAuthStore } from '@/stores';
import type { Folder, Page } from '@/types';
import { useInfiniteScroll } from '@vueuse/core';
import { FolderIcon } from 'lucide-vue-next';
import { onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';

const model = defineModel<boolean>()
const emits = defineEmits<{
  'addSuccess': [];
}>()

const userStore = useUserStore()
const topicStore = useTopicStore()
const authStore = useAuthStore();
const route = useRoute()
const topicId = ref<string>(route.params.id as string)

const folderIds = ref<number[]>([])
const isLoading = ref(false)
const folders = ref<Folder[]>([])
const el = useTemplateRef<HTMLElement>('el')

const pageFolder = reactive<Page<Folder>>({
  content: [],
  totalPages: 0,
  totalElements: 0
})
const pageParams = reactive({
  name: "",
  pageIndex: 1,
  pageSize: 12,
  key: '',
  orderBy: ''
})

watch( model, (newVal) => {
  if (!newVal) {
    folderIds.value = []
  }
})

useInfiniteScroll(el,
  async () => {
    pageParams.pageIndex++;
    await getData()
  },
  {
    distance: 10,
    canLoadMore: () => {
      return pageParams.pageIndex < pageFolder.totalPages
    },
  }
)

function isChecked(folder: Folder) : boolean {
  const id = Number(topicId.value)
  return folder.topicIds.includes(id) || folderIds.value.includes(folder.id as number)
}

function handleChange(checked: boolean, folderId: number) {
  if (checked) {
    folderIds.value.push(folderId)
  } else {
    let index = folderIds.value.indexOf(folderId)
    if (index > -1) {
      folderIds.value.splice(index, 1)
    }
  }
}

async function addToFolder() {
  try {
    await topicStore.addToFolders(topicId.value, folderIds.value)
    emits('addSuccess')
    model.value = false
  } catch (e) {
    console.error(e)
  }
}

async function getData() {
  try {
    isLoading.value = true
    const {name, pageIndex, pageSize, key, orderBy} = pageParams
    const res = await userStore.getAuthFolders(name, pageIndex, pageSize, key, orderBy)
    Object.assign(pageFolder, res)
    folders.value.push(...pageFolder.content)
    isLoading.value = false
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    getData()
  }
})
</script>

<style scoped>
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
</style>