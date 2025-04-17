<template>
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <template v-if="isLoading">
        <Skeleton class="w-full h-40" />
        <Skeleton class="w-full h-64 mt-6" />
      </template>
      <template v-else>
        <div class="user-banner p-4 md:p-6 min-h-40 flex items-center gap-4 md:gap-6 bg-secondary rounded-lg">
          <template v-if="user">
            <AvatarUser :user="user" :size="20" text-size="text-xl" />
            <div class="space-y-1 text-secondary-foreground *:text-shadow-md">
              <h3 class="text-xl font-semibold">{{ user.firstName + ' ' + user.lastName }}</h3>
              <p>{{ user.email }}</p>
              <p>Join at: {{ formatDate('dd/MM/yyyy', new Date(user.createdAt)) }}</p>
            </div>
          </template>
        </div>
        <div class="grid grid-cols-12 mt-6 gap-4">
          <div class="col-span-12 md:col-span-8 bg-secondary p-4 md:p-4 rounded-lg">
            <p class="text-center mb-3 text-muted-foreground">Study time in the 7 days ago</p>
            <StudyTimeChart :user-id="userId" class="max-h-56" />
          </div>
          <div class="col-span-6 md:col-span-4 bg-secondary p-4 rounded-lg flex flex-col gap-4 justify-center items-center text-lg">
            <p>Number of Topic</p>
            <span>{{ user?.topicsNumber || 0 }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AvatarUser } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import StudyTimeChart from '@/components/user/StudyTimeChart.vue';
import { useUserStore } from '@/stores';
import type { User } from '@/types';
import { formatDate } from '@/utils';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

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
  background-image: url(@/assets/images/bg-profile.jpg);
  background-repeat: no-repeat;
  background-position: center;
}
</style>