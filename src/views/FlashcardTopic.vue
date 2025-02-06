<template>
  <div class="container">
    <form>
      <div class="flex justify-between items-center">
        <h2 class="my-1 text-2xl font-semibold">Flashcard Topic</h2>
        
      </div>
      <Input 
      
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import { useRoute } from "vue-router";

const route = useRoute();

</script>

<style scoped>

</style>