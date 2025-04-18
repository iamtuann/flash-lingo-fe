<script setup lang="ts">
// import { Separator } from '@/registry/new-york/ui/separator'
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import SidebarNav from '@/components/NavSetting.vue'
import Separator from '@/components/ui/separator/Separator.vue';
</script>

<template>
  <main class="px-2 flex flex-col gap-2">
    <Header />
    <div class="container mt-4 space-y-6 pb-12">
      <h2 class="text-2xl font-bold tracking-tight">
        Settings
      </h2>
      <Separator class="my-6" />
      <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside class="lg:w-1/5">
          <SidebarNav />
        </aside>
        <div class="w-full lg:max-w-3xl">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </main>
</template>