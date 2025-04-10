<template>
  <div class="mt-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink v-for="item in pageFolder.content" :key="item.id"
        :to="{name: 'FolderTopics', params: {id: item.id, slug: item.slug}}"
      >
      <FolderItem :item="item" />
    </RouterLink>
    </div>
    <div class="mt-7" v-if="pageFolder.totalElements > 0">
      <Pagination v-slot="{ page }" v-model:page="pageParams.pageIndex" :items-per-page="pageParams.pageSize" :total="pageFolder.totalElements" :sibling-count="2" show-edges :default-page="1">
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
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import type { Folder, Page } from '@/types';
import { reactive, ref, watch } from 'vue';
import {
  Button,
} from '@/components/ui/button'
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
import FolderItem from '@/components/folder/FolderItem.vue';

const userStore = useUserStore()
const isLoading = ref(false)
const pageParams = reactive({
  name: "",
  pageIndex: 1,
  pageSize: 12,
  key: '',
  orderBy: ''
})
const pageFolder = reactive<Page<Folder>>({
  content: [],
  totalPages: 1,
  totalElements: 0
})

watch(pageParams, () => {
  getData()
})

async function getData() {
  try {
    isLoading.value = true;
    const {name, pageIndex, pageSize, key, orderBy} = pageParams
    const res = await userStore.getAuthFolders(name, pageIndex, pageSize, key, orderBy)
    pageFolder.content = res.content
    pageFolder.totalElements = res.totalElements
    pageFolder.totalPages = res.totalPages
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}
getData()
</script>

<style scoped>

</style>