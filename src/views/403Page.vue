<template>
  <div class="mt-32 flex flex-col items-center justify-center gap-10">
    <div class="w-16 h-16 flex items-center justify-center bg-destructive rounded-md shadow-lg">
      <XIcon :size="36" strokeWidth="4" />
    </div>
    <h3 class="text-xl font-semibold">This resource is not public</h3>
    <p>Only the creator of this resource can access it</p>
    <div class="space-x-4">
      <Button variant="secondary" @click="router.back()">Back</Button>
      <Button variant="default" @click="router.push({name: 'Home'})">Go to home</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<style scoped>

</style>