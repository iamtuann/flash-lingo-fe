<template>
  <Primitive :as="viewable ? as : 'div'" :as-child="asChild" class="relative" :class="cn({'opacity-60': !viewable}, props.class)">
    <div v-if="layout == 'list'">
      Topic
    </div>
    <div v-else class="border border-border bg-accent rounded-md py-3 px-3">
      <div class="flex items-center">
        <p class="text-xl font-medium">{{ topic.name }} <span v-if="topic.status == 2">(Draft)</span></p>
        
        <span v-if="topic.status == 0" class="ml-2">
          <Lock :size="12" />
        </span>
      </div>
      <span class="text-sm">{{ topic.termsNumber }} terms</span>
      <div class="mt-1">
        <AvatarUser :user="topic.createdBy" size="5" />
        <span class="text-xs ml-2">{{ topic.createdBy.firstName +' '+ topic.createdBy.lastName }}</span>
      </div>
      <div class="absolute z-50 right-3 top-3">
        <slot name="append" />
      </div>
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { AvatarUser } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Topic } from '@/types';
import { viewableTopic } from "@/utils";
import { Lock } from 'lucide-vue-next';
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { computed, type HTMLAttributes } from "vue";
import { RouterLink } from "vue-router"

interface Props extends PrimitiveProps {
  topic: Topic,
  layout?: 'list' | 'grid',
  class?: HTMLAttributes['class']
}
const props = withDefaults(defineProps<Props>(), {
  as: RouterLink
})

const viewable = computed(() => viewableTopic(props.topic))
</script>

<style scoped>

</style>