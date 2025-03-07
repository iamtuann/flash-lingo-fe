<template>
  <TooltipProvider>
    <div class="bg-gray-900 h-full rounded-md">
      <div class="p-3 flex items-center gap-2" :class="isCollapsed && 'px-0 mx-auto justify-center'">
        <div class="p-1 cursor-pointer" @click="$emit('click:menu', !isCollapsed)">
          <Menu />
        </div>
        <p class="font-semibold" :class="isCollapsed && 'hidden'">Menu</p>
      </div>
      <Nav :links="links" :is-collapsed="isCollapsed" />
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { Home, LibraryBig, Menu } from "lucide-vue-next";
import Nav, { type LinkProp } from './Nav.vue';
import TooltipProvider from "./ui/tooltip/TooltipProvider.vue";

interface SidebarProps {
  isCollapsed: boolean
}
export type SidebarEmits = {
  'click:menu': [payload: boolean];
};

defineProps<SidebarProps>()
defineEmits<SidebarEmits>()

const links: LinkProp[] = [
  {title: 'Home', icon: Home, to: {name: 'Home'}},
  {title: 'Your Library', icon: LibraryBig, to: {name: 'LibraryFlashcards'}},
  {title: 'Login', icon: Home, to: {name: 'Login'}},
]
</script>

<style scoped>

</style>