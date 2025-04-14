<template>
  <div class="relative bg-accent rounded-lg p-4">
    <div class="flex gap-4 items-center font-semibold text-accent-foreground">
      <AvatarUser :user="user" :size="16" text-size="text-xl" />
      <p class="text-lg font-semibold text-accent-foreground">{{ `${user.firstName} ${user.lastName}` }}</p>
    </div>
    <div class="mt-6">
      <Badge variant="secondary">{{ user.topicsNumber }} Topic flashcard</Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types';
import { AvatarUser } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


interface Props {
  user: User,
  layout?: 'list' | 'grid',
}
defineProps<Props>()
</script>

<style scoped>

</style>