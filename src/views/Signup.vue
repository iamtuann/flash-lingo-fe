<template>
  <div
    class="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <RouterLink
      :to="{name: 'Login'}"
      :class="cn(buttonVariants({ variant: 'ghost' }), 'absolute right-8 top-8')"
    >
      Log in
    </RouterLink>
    <div
      class="left-side relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
    >
      <div class="relative z-20 mt-auto">
      </div>
    </div>
    <div class="px-0 py-8 lg:p-8 h-full">
      <div class="flex items-center text-lg font-medium">
        <img class="block h-10" src="@/assets/images/logo.png" alt="logo">
        <RouterLink class="font-bold" :to="{name: 'Home'}">Flash Lingo</RouterLink>
      </div>
      <div class="mx-auto flex py-12 w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <CreateAccount />
        <p class="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our
          <RouterLink
            to=""
            class="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </RouterLink>
          and
          <RouterLink
            to=""
            class="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </RouterLink>
          .
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants } from "@/components/ui/button";
import CreateAccount from '@/components/CreateAccount.vue';

</script>

<style scoped>
.left-side {
  background-image: url('@/assets/images/banner.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
}
</style>
