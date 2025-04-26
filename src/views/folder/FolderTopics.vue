<template>
  <div class="container">
    <div class="flex items-center gap-3 mb-4 mt-4">
      <h2 class="text-2xl font-semibold tracking-tight py-2">{{ folder?.name }}</h2>
      <Badge variant="secondary" class="h-full">{{ folder?.status == 0 ? 'private' : 'public' }}</Badge>
      <div class="flex-1"></div>
      <Button variant="outline" v-if="editableFolder(folder)" class="h-10 w-10" @click="showAddDialog = true">
        <PlusIcon />
      </Button>
      <DropdownMenu v-if="editableFolder(folder)">
        <DropdownMenuTrigger as-child>
          <Button variant="secondary" class="h-10 w-10">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-44" :sideOffset="12" align="end">
          <DropdownMenuGroup>
            <Dialog v-model:open="dialogFolderForm">
              <DialogTrigger class="w-full">
                <DropdownMenuItem @select="(e) => e.preventDefault()">
                  <PencilIcon class="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent @interactOutside="(e) => {e.preventDefault()}">
                <DialogHeader>
                  <DialogTitle>Edit Folder</DialogTitle>
                </DialogHeader>
                <FolderForm type="update" :id="folder?.id" :name="folder?.name" :status="folder?.status" @success="onUpdateFolderSuccess" />
              </DialogContent>
            </Dialog>
            <Dialog v-model:open="dialogDeleteFolder">
              <DialogTrigger class="w-full">
                <DropdownMenuItem class="text-red-500 cursor-pointer focus:text-red-500" @select="(e) => e.preventDefault()">
                  <TrashIcon :strokeWidth="3" class="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent @interactOutside="(e) => {e.preventDefault()}">
                <DialogHeader>
                  <DialogTitle>Delete this folder?</DialogTitle>
                  <DialogDescription>
                    The folder will be permanently deleted! Are you sure?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter class="mt-4">
                  <Button variant="outline" @click="dialogDeleteFolder = false">Cancel</Button>
                  <Button variant="destructive" @click="deleteFolder">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <p class="text-sm text-muted-foreground">{{ folder?.description }}</p>
    <TopicGroupSkeleton v-if="isLoading" />
    <template v-else-if="pageTopic.totalElements > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        <template v-for="item in pageTopic.content" :key="item.id">
          <TopicItem :to="{name: 'TopicHome', params: {id: item.id, slug: item.slug}}" :topic="item" layout="grid">
            <template #append v-if="editableFolder(folder)">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="secondary" size="icon">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-44" :sideOffset="12" align="end">
                  <DropdownMenuItem  @click="handleRemoveTopic(item.id)">
                    <MinusIcon class="mr-2 h-4 w-4" /> <span>Remove</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </template>
          </TopicItem>
        </template>
      </div>
      <div class="mt-7">
        <Pagination v-slot="{ page }" :items-per-page="pageParams.pageSize" :total="pageTopic.totalElements" :sibling-count="1" show-edges :default-page="1">
          <PaginationList v-slot="{ items }" class="flex items-center gap-1 justify-center">
            <PaginationFirst />
            <PaginationPrev />
            <template v-for="(item, index) in items">
              <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>
            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </div>
    </template>
    <div v-else class="mt-5 text-center">
      This folder has no topics
    </div>

    <AddTopicsDialog v-model="showAddDialog" @add-success="getData" />
  </div>
</template>

<script setup lang="ts">
import { useFolderStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import type { Topic, Folder, Page } from "@/types";
import { computed, reactive, ref, watch } from 'vue';
import { Badge } from '@/components/ui/badge'
import { EllipsisVertical, MinusIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-vue-next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { TopicGroupSkeleton, TopicItem } from '@/components/topic';
import { FolderForm } from '@/components/folder';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import AddTopicsDialog from './AddTopicsDialog.vue';
import { editableFolder } from '@/utils';

const folderStore = useFolderStore()
const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const isDeleting = ref(false)
const folderId = computed(() => route.params.id as string)
const folder = ref<Folder | null>(null)
const pageTopic = reactive<Page<Topic>>({
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
const dialogFolderForm = ref(false)
const dialogDeleteFolder = ref(false)
const showAddDialog = ref(false)

watch(() => folderStore.folder, (newData) => {
  folder.value = newData
})

function onUpdateFolderSuccess() {
  dialogFolderForm.value = false;
}

async function handleRemoveTopic(topicId: string | number) {
  try {
    await folderStore.removeTopic(folderId.value, topicId);
    getData()
  } catch (e) {
    console.error(e)
  }
}

async function deleteFolder() {
  isDeleting.value = true;
  try {
    await folderStore.delete(folderId.value)
    dialogDeleteFolder.value = false;
  } catch (e) {
    console.error(e)
  } finally {
    isDeleting.value = false
    router.replace({name: 'Home'})
  }
}

async function getData() {
  isLoading.value = true;
  try {
    const {name, pageIndex, pageSize, key, orderBy} = pageParams
    const [folderRes, topicRes] = await Promise.allSettled([
      folderStore.getById(folderId.value),
      folderStore.getTopics(folderId.value, name, pageIndex, pageSize, key, orderBy)
    ])
    if (topicRes.status == 'fulfilled') {
      pageTopic.content = topicRes.value.content;
      pageTopic.totalElements = topicRes.value.totalElements
      pageTopic.totalPages = topicRes.value.totalPages
    }
  } catch (e) {
    console.error(e)  
  } finally {
    isLoading.value = false
  }
}
getData();
</script>

<style scoped>

</style>