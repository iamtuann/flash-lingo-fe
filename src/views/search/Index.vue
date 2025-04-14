<template>
  <div class="container">
    <h2 class="text-2xl font-semibold tracking-tight py-3">Search for "{{ query }}"</h2>
    <ul class="flex gap-5 border-b-2">
      <!-- <li>
        <RouterLink
          :to="{name: 'SearchAll', query: {query}}"
          class="py-2 block relative hover:text-primary hover:opacity-85"
          exact-active-class="text-primary shadow link-active"
        > All results </RouterLink>
      </li> -->
      <li>
        <RouterLink
          :to="{name: 'SearchTopic', query: {query}}"
          class="py-2 block relative hover:text-primary hover:opacity-85"
          exact-active-class="text-primary shadow link-active"
        > Topics flashcard </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{name: 'SearchUser', query: {query}}"
          class="py-2 block relative hover:text-primary hover:opacity-85"
          exact-active-class="text-primary shadow link-active"
        > Users </RouterLink>
      </li>
    </ul>
    <div class="pb-4 pt-8">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '@/composable';

const { query } = useSearch()

</script>

<style scoped>
.link-active::after {
  content: "";
  @apply absolute -bottom-[2px] left-0 w-full border-b-[3px] rounded-t-sm border-primary
}
</style>