<template>
  <div class="mt-4">
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
      You have not created the topic yet
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import { EStatus, type Page, type Topic } from '@/types';
import { reactive, ref } from 'vue';
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
import { TopicGroupSkeleton, TopicItem } from '@/components/topic';

const userStore = useUserStore()

const isLoading = ref(false);
const pageParams = reactive({
  name: "",
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

async function getData() {
  isLoading.value = true
  try {
    const {name, pageIndex, pageSize, key, orderBy} = pageParams
    const res = await userStore.getAuthTopics(name, pageIndex, pageSize, key, orderBy)
    pageTopic.content = res.content
    pageTopic.totalElements = res.totalElements
    pageTopic.totalPages = res.totalPages
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false
  }
}
getData()
</script>

<style scoped>

</style>