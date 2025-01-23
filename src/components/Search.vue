<template>
  <div class="relative w-full max-w-sm items-center">
    <Input v-model="search" type="text" placeholder="Search..." class="h-9 md:h-10 pl-10 rounded-full" />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-5 md:size-6 text-muted-foreground" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from './ui/input/Input.vue';
import { Search } from 'lucide-vue-next';

const search = ref("")

</script>

<style scoped>

</style>