<template>
  <main class="px-2 flex flex-col gap-2 justify-between h-screen">
    <Header>
      <template #prepend-mobile>
        <Button variant="ghost" size="icon" class="hrink-0" @click="isOpen = true">
          <MenuIcon class="!size-6" />
        </Button>
      </template>
    </Header>
    <Sidebar
      :is-collapsed="false"
      class="fixed sm:hidden left-0 top-0 z-[99] rounded-l-none w-full max-w-72 transition-all duration-200"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      @click:close="isOpen = false"
    />
    <div v-show="isOpen" @click="isOpen = false" class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        id="resize-panel-1"
        ref="panelRef"
        :default-size="24"
        collapsible
        :min-size="16"
        :max-size="24"
        :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out', 'hidden sm:block ')"
        @expand="onExpand"
        @collapse="onCollapse"
      >
        <Sidebar :is-collapsed="isCollapsed" @click:menu="panelRef?.isCollapsed ? panelRef.expand() : panelRef?.collapse()" />
      </ResizablePanel>
      <ResizableHandle class="hidden sm:block mx-1 my-2" />
      <ResizablePanel class="!overflow-y-auto main-panel flex flex-col">
        <div class="flex-1"><slot /></div>
        <Footer />
      </ResizablePanel>
    </ResizablePanelGroup>
  </main>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { nextTick, onMounted, ref, watch } from 'vue';
import { cn } from '@/lib/utils';
import defaultTheme from "tailwindcss/defaultTheme";
import { MenuIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useRoute } from 'vue-router';

const route = useRoute()
const panelRef = ref<InstanceType<typeof ResizablePanel>>()
const isCollapsed = ref(false)
const isOpen = ref(false)

window.addEventListener('resize', autoTogglePanel)

watch(() => route.name, () => {
  if (isOpen.value) {
    isOpen.value = false
  }
})

function autoTogglePanel() {
  if (!panelRef.value) return;
  
  const width = window.innerWidth;
  if (width > Number(defaultTheme.screens.lg.split('px')[0])) {
    isCollapsed.value = false;
    panelRef.value.expand()
  } else {
    isCollapsed.value = true;
    panelRef.value.collapse()
  }
}

function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}

onMounted(async () => {
  await nextTick()
  autoTogglePanel();
})

</script>

<style scoped>
.main-panel::-webkit-scrollbar {
  background-color: transparent;
  width: 4px;
}

.main-panel::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 99px;
}
</style>