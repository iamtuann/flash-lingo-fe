<template>
  <main class="px-2 flex flex-col gap-2 justify-between h-screen">
    <Header />
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        id="resize-panel-1"
        ref="panelRef"
        :default-size="265"
        collapsible
        :min-size="16"
        :max-size="24"
        :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')"
        @expand="onExpand"
        @collapse="onCollapse"
      >
        <Sidebar :is-collapsed="isCollapsed" @click:menu="panelRef?.isCollapsed ? panelRef.expand() : panelRef?.collapse()" />
      </ResizablePanel>
      <ResizableHandle class="mx-1 my-2" />
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
import { ref } from 'vue';
import { cn } from '@/lib/utils';

const panelRef = ref<InstanceType<typeof ResizablePanel>>()
const isCollapsed = ref(false)
function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}

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