<template>
  <div class="mt-4">
    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      <RouterLink v-for="item in pageTopic.content" :key="item.id"
        :to="{name: 'FlashcardsHome', params: {id: item.id, slug: item.slug}}"
      >
        <TopicItem :topic="item" layout="grid" />
      </RouterLink>
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
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import type { Page, Topic } from '@/types';
import { reactive } from 'vue';
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
import TopicItem from '@/components/topic/TopicItem.vue';

const userStore = useUserStore()

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
  try {
    const {name, pageIndex, pageSize, key, orderBy} = pageParams
    const res = await userStore.getAuthTopics(name, pageIndex, pageSize, key, orderBy)
    pageTopic.content = res.content
    pageTopic.totalElements = res.totalElements
    pageTopic.totalPages = res.totalPages
  } catch (e) {
    console.error(e);
  }
}
getData()
</script>

<style scoped>

</style>