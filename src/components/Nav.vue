<script lang="ts" setup>
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'

export interface LinkProp {
  title: String
  icon: LucideIcon,
  to: RouteLocationRaw
}
interface NavProps {
  isCollapsed: boolean
  links: LinkProp[]
}

defineProps<NavProps>()

</script>

<template>
  <div
    :data-collapsed="isCollapsed"
    class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
  >
    <nav class="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
      <template v-for="(link, index) of links">
        <Tooltip v-if="isCollapsed" :key="`1-${index}`" :delay-duration="0">
          <TooltipTrigger>
            <RouterLink
              :to="link.to"
              :class="cn(buttonVariants({ variant: 'ghost' }), 'size-10')"
              active-class="bg-primary shadow hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground"
            >
            <component :is="link.icon" class="!size-5" />
          </RouterLink>
          </TooltipTrigger>
          <TooltipContent side="right" class="flex items-center">
            {{ link.title }}
          </TooltipContent>
        </Tooltip>

        <RouterLink
          v-else
          :key="`2-${index}`"
          :to="link.to"
          :class="cn(buttonVariants({ variant: 'ghost' }), 'justify-start h-10')"
          active-class="bg-primary shadow hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground"
        >
          <component :is="link.icon" class="mr-2" />
          {{ link.title }}
        </RouterLink>
      </template>
    </nav>
  </div>
</template>
