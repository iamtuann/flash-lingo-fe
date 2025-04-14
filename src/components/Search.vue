<template>
  <form @submit.prevent="handleSearch" class="relative w-full max-w-sm items-center">
    <Input v-model="search" type="text" placeholder="Search..." class="h-9 md:h-10 pl-10 rounded-full" />
    <button type="submit" class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-5 md:size-6 text-muted-foreground" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from './ui/input/Input.vue';
import { Search } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useSearch } from '@/composable';

const router = useRouter()
const { query, routeName } = useSearch()

const search = ref(query.value as string)

async function handleSearch() {
  if (!search.value) {
    return;
  }
  if (routeName.value == 'SearchTopic' || routeName.value == "SearchUser") {
    router.push({name: routeName.value, query: {query: search.value}})
  } else {
    router.push({name: 'SearchTopic', query: {query: search.value}})
  }
}

</script>

<style scoped>

</style>