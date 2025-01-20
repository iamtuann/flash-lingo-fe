<template>
  <main>
    <Header />
    <slot />
    <Footer />
  </main>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped>

</style>