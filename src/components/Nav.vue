<script lang="ts" setup>
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthGuard } from '@/composable/use-auth-guard'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import { type LucideIcon } from 'lucide-vue-next'
import { RouterLink, useRoute, type RouteLocationRaw, type RouterLinkProps } from 'vue-router'

export interface LinkProp {
  title: String
  icon: LucideIcon,
  to: RouteLocationRaw
  requredAuth: boolean
}
interface NavProps {
  isCollapsed: boolean
  links: LinkProp[]
}
export interface NavEmits {
  'change-nav': [payload: LinkProp]
}

defineProps<NavProps>()
const emits = defineEmits<NavEmits>()

const route = useRoute()
const { requireAuth } = useAuthGuard()
const { isAuthenticated } = useAuthStore()

function onClickNav(link: LinkProp) {
  if (link.requredAuth && !isAuthenticated) {
    requireAuth()
  }
  if (typeof link.to === 'object' && 'name' in link.to && route.name !== link.to?.name) {
    emits('change-nav', link)
  }
}

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
            <component :is="(link.requredAuth && !isAuthenticated) ? 'div' : RouterLink"
              :to="link.to"
              @click="onClickNav(link)"
              :class="cn(buttonVariants({ variant: 'ghost' }), 'size-10 cursor-pointer')"
              active-class="bg-primary shadow hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground"
            >
              <component :is="link.icon" class="!size-5" />
            </component>
          </TooltipTrigger>
          <TooltipContent side="right" class="flex items-center">
            {{ link.title }}
          </TooltipContent>
        </Tooltip>

        <component :is="(link.requredAuth && !isAuthenticated) ? 'div' : RouterLink"
          v-else
          @click="onClickNav(link)"
          :key="`2-${index}`"
          :to="link.to"
          :class="cn(buttonVariants({ variant: 'ghost' }), 'justify-start h-10 cursor-pointer')"
          active-class="bg-primary shadow hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground"
        >
          <component :is="link.icon" class="mr-2" />
          {{ link.title }}
      </component>
      </template>
    </nav>
  </div>
</template>
