<template>
  <TopicGroupSkeleton v-if="isLoading" />
  <template v-else-if="pageTopic.totalElements > 0">
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      <template v-for="item in pageTopic.content" :key="item.id">
        <TopicItem 
          :to="item.status != EStatus.DRAFT ? {name: 'TopicHome', params: {id: item.id, slug: item.slug}} : {name: 'TopicEdit', params: {id: item.id}}"
          :topic="item" layout="grid"
        />
      </template>
    </div>
    <div class="mt-7">
      <Pagination v-slot="{ page }" v-model:page="pageParams.pageIndex" :items-per-page="pageParams.pageSize" :total="pageTopic.totalElements" :sibling-count="1" show-edges :default-page="1">
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
    <p class="text-2xl font-semibold">Coundn't find any results.</p>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '@/composable';
import { useTopicStore } from '@/stores';
import { EStatus, type Page, type Topic } from '@/types';
import { reactive, ref, watch } from 'vue';
import { Button } from '@/components/ui/button'
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
import { TopicGroupSkeleton, TopicItem } from '@/components/topic';

const { query } = useSearch()
const topicStore = useTopicStore()

const isLoading = ref(true)
const pageParams = reactive({
  pageIndex: 1,
  pageSize: 12,
  key: '',
  orderBy: ''
})
const pageTopic = reactive<Page<Topic>>({
  content: [],
  totalPages: 1,
  totalElements: 0
})

getData()

watch([query, pageParams], () => {
  getData()
})

async function getData() {
  isLoading.value = true
  try {
    const {pageIndex, pageSize, key, orderBy} = pageParams
    const res = await topicStore.searchTopic(query.value as string, pageIndex, pageSize, key, orderBy)
    pageTopic.content = res.content
    pageTopic.totalElements = res.totalElements
    pageTopic.totalPages = res.totalPages
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false
  }
}


</script>

<style scoped>

</style>