<template>
  <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
    <Skeleton v-for="i in 2" class="h-[106px] bg-accent rounded-md" :key="i" />
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
</script>

<style scoped>

</style>