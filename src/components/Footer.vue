<template>
  <div class="container !mt-12 mb-4">
    <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between">
      <div class="flex items-center">
        <RouterLink :to="{name: 'Home'}">
          <img class="w-9 h-auto mr-2 opacity-90" src="@/assets/images/logo.png" alt="flashlingo">
        </RouterLink>
        <h3 class="text-sm font-medium text-muted-foreground">&copy; 2025, Flash Lingo</h3>
      </div>
      <ul class="flex items-center gap-4">
        <li><RouterLink class="text-sm font-medium text-muted-foreground hover:underline" :to="{name: 'Home'}">
          Terms
        </RouterLink></li>
        <li><RouterLink class="text-sm font-medium text-muted-foreground hover:underline" :to="{name: 'Home'}">
          Privacy
        </RouterLink></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>