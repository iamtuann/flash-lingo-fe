<template>
  <section>
    <h3 class="font-semibold text-lg mb-3">Top Creators</h3>
    <TopicGroupSkeleton v-if="isLoading" />
    <div class="relative group" v-if="users.length > 2">
      <Carousel ref="carouselRef" v-model="currentSlide" v-bind="carouselConfig">
        <Slide v-for="(item, idx) in users" :key="idx">
          <UserItem :user="item" layout="grid" class="block w-full"/>
        </Slide>
      </Carousel>
      <div class="hidden group-hover:block">
        <Button 
          @click="prev" 
          class="rounded-full w-10 h-10 absolute top-[50%] -left-4 z-[2] translate-y-[-50%] border border-white"
          :class="{'hidden': currentSlide <= 0 || carouselRef?.config?.itemsToShow == users.length}"
        >
          <ChevronLeft />
        </Button>
        <Button 
          @click="next"
          class="rounded-full w-10 h-10 absolute top-[50%] -right-4 z-[2] translate-y-[-50%] border border-white"
          :class="{'hidden': currentSlide >= users.length - 1 || carouselRef?.config?.itemsToShow == users.length}"
          >
          <ChevronRight />
        </Button>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
      <template v-for="item in users" :key="item.id">
        <UserItem :user="item" layout="grid" class="block w-full"/>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import type { User } from '@/types';
import { ref } from 'vue';
import { TopicGroupSkeleton } from '@/components/topic';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import UserItem from '@/components/user/UserItem.vue';

const userStore = useUserStore()
const isLoading = ref(true)
const users = ref<User[]>([])

const carouselConfig = {
  itemsToShow: 1.2,
  mouseDrag: false,
  gap: 6,
  breakpoints: {
    640: {
      itemsToShow: 2,
      gap: 8
    },
    768: {
      itemsToShow: 2.1,
      gap: 12
    },
    1280: {
      itemsToShow: 3,
      gap: 16
    },
  }
}

const carouselRef = ref()
const currentSlide = ref(0)

const next = () => carouselRef.value.next()
const prev = () => {carouselRef.value.prev()}

async function getData() {
  try {
    const res = await userStore.getTopCreators();
    users.value = res.content
    isLoading.value = false
  } catch (e) {
    console.error(e);
    isLoading.value = false
  }
}
getData();

</script>

<style scoped>

</style>