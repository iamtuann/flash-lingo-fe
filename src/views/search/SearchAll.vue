<template>
  <div>
    all
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '@/composable';
import type { Page, Topic } from '@/types';
import { reactive } from 'vue';

const { query } = useSearch()

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

async function getData() {
  
}

</script>

<style scoped>

</style>