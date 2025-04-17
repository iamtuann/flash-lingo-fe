<template>
  <Avatar
    class="inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle cursor-pointer"
    :class="`w-${size} h-${size}`"
  >
    <AvatarImage :src="user.avatarUrl || ''" :alt="user.firstName+' '+user.lastName" />
    <AvatarFallback
      class="text-primary flex h-full w-full items-center justify-center bg-white font-bold" :delay-ms="600"
      :class="textSize || ''"
    >
      {{ user.firstName[0] + user.lastName[0] }}
    </AvatarFallback>
  </Avatar>
</template>

<script setup lang="ts">
import type { User } from '@/types';
import Avatar from './Avatar.vue';
import AvatarFallback from './AvatarFallback.vue';
import AvatarImage from './AvatarImage.vue';

defineProps<{
  user: User,
  size: number | string,
  textSize?: string
}>()
</script>

<style scoped>

</style>