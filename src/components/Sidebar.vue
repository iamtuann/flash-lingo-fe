<template>
  <div class="bg-secondary h-full rounded-md">
    <TooltipProvider>
      <div class="p-3 flex items-center gap-2" :class="isCollapsed && 'px-0 mx-auto justify-center'">
        <div class="p-1 cursor-pointer hidden sm:block" @click="$emit('click:menu', !isCollapsed)">
          <Menu />
        </div>
        <p class="font-semibold" :class="isCollapsed && 'hidden'">Menu</p>
        <div class="flex-1 sm:hidden"></div>
        <div class="p-1 cursor-pointer sm:hidden" @click="$emit('click:close')">
          <XIcon />
        </div>
      </div>
      <Nav :links="links" :is-collapsed="isCollapsed" />
    </TooltipProvider>
  </div>
</template>

<script setup lang="ts">
import { BotIcon, Home, LibraryBig, Menu, XIcon } from "lucide-vue-next";
import Nav, { type LinkProp } from './Nav.vue';
import TooltipProvider from "./ui/tooltip/TooltipProvider.vue";

interface SidebarProps {
  isCollapsed: boolean
}
export type SidebarEmits = {
  'click:menu': [payload: boolean];
  'click:close': [];
};

defineProps<SidebarProps>()
defineEmits<SidebarEmits>()

const links: LinkProp[] = [
  {title: 'Home', icon: Home, to: {name: 'Home'}, requredAuth: false},
  {title: 'Your Library', icon: LibraryBig, to: {name: 'LibraryFlashcards'}, requredAuth: true},
  {title: 'AI Supporter', icon: BotIcon, to: {name: 'AISupporter'}, requredAuth: true},
]
</script>

<style scoped>

</style>