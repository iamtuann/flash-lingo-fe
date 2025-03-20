<template>
  <Dialog v-model:open="model">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Topics to folder</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-1">
          <div v-for="topic in pageTopic.content" :key="topic.id" class="flex gap-3 py-4 px-3 items-center rounded-lg hover:bg-secondary transition-all">
            <div class="h-10 w-10 flex items-center justify-center rounded-md bg-secondary">
              <Layers />
            </div>
            <div>
              <p>{{ topic.name }}</p>
              <p class="text-xs">
                <span>{{ topic.termsNumber }} terms</span> -
                <span>by you</span>
              </p>
            </div>
            <div class="flex-1"></div>
            <div>
              <Checkbox
                :disabled="folder?.topicIds.includes(topic.id as number)"
                :model-value="isChecked(topic.id)"
                @update:model-value="(v: boolean | 'indeterminate') => handleChange(v as boolean, topic.id as number)"
              />
            </div>
          </div>
          <div class="py-3 px-3 mt-2 rounded-md bg-secondary text-center">Loading...</div>
        </div>
        <DialogFooter class="mt-4 ml-auto">
          <Button @click="addToFolder">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFolderStore, useUserStore } from '@/stores';
import type { Folder, Page, Topic } from '@/types';
import { Layers } from 'lucide-vue-next';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const model = defineModel<boolean>()
const emits = defineEmits<{
  'addSuccess': [];
}>()

const userStore = useUserStore()
const folderStore = useFolderStore()
const route = useRoute()
const folderId = ref(route.params.id as string)

const folder = computed<Folder | null>(() => folderStore.folder)
const topicIds = ref<number[]>([])
const isLoading = ref(true)
const topics = ref<Topic[]>([])

const pageTopic = reactive<Page<Topic >>({
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
    topicIds.value = []
  }
})

function isChecked(topicId: number | string) : boolean {
  const id = topicId as number
  return folder.value?.topicIds.includes(id) || topicIds.value.includes(id)
}

function handleChange(checked: boolean, topicId: number) {
  if (checked) {
    topicIds.value.push(topicId)
  } else {
    let index = topicIds.value.indexOf(topicId)
    if (index > -1) {
      topicIds.value.splice(index, 1)
    }
  }
}

async function addToFolder() {
  try {
    await folderStore.addTopic(folderId.value, topicIds.value)
    emits('addSuccess')
    model.value = false
  } catch (e) {
    console.error(e)
  }
}

async function getData() {
  try {
    const {name, pageIndex, pageSize, key, orderBy} = pageParams
    const res = await userStore.getAuthTopics(name, pageIndex, pageSize, key, orderBy)
    Object.assign(pageTopic, res)
    topics.value = [...topics.value, ...res.content]
    isLoading.value = false
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>