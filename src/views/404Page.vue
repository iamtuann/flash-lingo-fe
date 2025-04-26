<template>
  <div class="bg-[#fcfee9] text-[#141611]">
    <div class="container max-w-3xl">
      <div class="flex flex-col items-center justify-center gap-4 min-h-screen">
        <h2 class="text-5xl font-bold">PAGE NOT FOUND</h2>
        <img class="w-full" src="@/assets/images/404-Error.png" alt="404 error">
        <h3 class="text-2xl font-medium">Woops, Maybe You Are Lost</h3>
        <p class="text-black">We couldn't find what you are looking for</p>
        <Button class="rounded-none" @click="router.replace({name: 'Home'})">GO BACK HOME</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<style scoped>

</style>