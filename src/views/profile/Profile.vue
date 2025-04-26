<template>
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <template v-if="isLoading">
        <Skeleton class="w-full h-40" />
        <Skeleton class="w-full h-64 mt-6" />
      </template>
      <template v-else-if="user">
        <div class="user-banner relative p-4 md:p-6 min-h-40 flex items-center gap-4 md:gap-6 bg-secondary rounded-lg">
          <AvatarUser
            class="absolute border-4 border-foreground top-24 sm:top-28"
            :user="user"
            :size="28"
            text-size="text-xl"
          />
        </div>
        <div class="mt-[52px] sm:mt-4 sm:ml-40">
          <h3 class="text-2xl font-semibold">{{ user.firstName + ' ' + user.lastName }}</h3>
          <p class="text-sm text-muted-foreground">{{ user.username }}</p>
          <!-- <p>Join at: {{ formatDate('dd/MM/yyyy', new Date(user.createdAt)) }}</p> -->
        </div>
        <Separator class="my-4" />
        <nav class="flex gap-x-1">
          <Button
            :as="RouterLink"
            :to="{ name: 'UserProfile' }"
            variant="ghost"
            exact-active-class="bg-muted hover:bg-muted"
          >
            Overview
          </Button>
          <Button
            :as="RouterLink"
            :to="{ name: 'UserTopics' }"
            variant="ghost"
            exact-active-class="bg-muted hover:bg-muted"
          >
            Topics
          </Button>
          <Button
            :as="RouterLink"
            :to="{ name: 'UserFolders' }"
            variant="ghost"
            exact-active-class="bg-muted hover:bg-muted"
          >
            Folders
          </Button>
        </nav>
        <RouterView :user="user" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AvatarUser } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Separator from '@/components/ui/separator/Separator.vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/stores';
import type { User } from '@/types';
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute()
const userStore = useUserStore()
const userId = computed<string>(() => route.params.id as string)
const user = ref<User | null>(null)
const isLoading = ref(true);

watch(userId, () => getData() )

getData()
async function getData() {
  try {
    const res = await userStore.getProfile(userId.value) 
    user.value = res
    isLoading.value = false
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
}

</script>

<style scoped>
.user-banner {
  background-image: url(@/assets/images/hero_blue.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>