<template>
  <Primitive :as="as">
    <div class="card education group py-5 px-3 gap-4 bg-accent rounded-md overflow-hidden flex flex-col justify-center items-center">
      <div class="circle relative z-[2] w-20 h-20 rounded-full bg-white after:w-[68px] after:h-[68px]">
        <div class="overlay w-[68px] h-[68px] rounded-full absolute"></div>
        <div class="z-10">
          <slot name="icon"></slot>
        </div>
      </div>
      <p class="text-lg font-semibold group-hover:text-gray-800 z-10 duration-300">{{ title }}</p>
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'radix-vue';
import type { AsTag } from 'reka-ui';
import type { Component } from 'vue';

defineProps<{
  title: string,
  description?: string,
  color: string,
  as?: AsTag | Component
}>()
</script>

<style scoped>

.card {
  box-shadow: 0 14px 26px rgba(0,0,0,0.04);
  transition: all 0.3s ease-out;
  text-decoration: none;
}

.card:hover {
  transform: translateY(-5px) scale(1.005) translateZ(0);
  box-shadow: 0 24px 36px rgba(0,0,0,0.11),
    0 24px 46px var(--box-shadow-color);
}

.overlay {
  background: v-bind(color);
  position: absolute;
  z-index: 0;
  transition: transform 0.4s ease-out;
}

.card:hover .overlay {
  transform: scale(4) translateZ(0);
}

.card:hover .circle:after {
  background: #fff;
}

.circle {
  border: 2px solid v-bind(color);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease-out;
}

.circle:after {
  content: "";
  display: block;
  position: absolute;
  background: v-bind(color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease-out;
}
</style>