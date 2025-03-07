<template>
  <div class="container">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold tracking-tight py-3">Your Library</h2>
      <ul class="flex gap-3">
        <li>
          <RouterLink
            :to="{name: 'LibraryFlashcards'}"
            :class="cn(buttonVariants({ variant: 'outline' }), 'h-8')"
            active-class="bg-primary text-primary-foreground shadow hover:bg-primary/90"
          > Flashcards </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{name: 'Home'}"
            :class="cn(buttonVariants({ variant: 'outline' }), 'h-8')"
            active-class="bg-primary text-primary-foreground shadow hover:bg-primary/90"
          > Folders </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{name: 'Home'}"
            :class="cn(buttonVariants({ variant: 'outline' }), 'h-8')"
            active-class="bg-primary text-primary-foreground shadow hover:bg-primary/90"
          > Recent Learning </RouterLink>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';


</script>

<style scoped>

</style>