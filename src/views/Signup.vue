<template>
  <div
    class="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <RouterLink
      :to="{name: 'Login'}"
      :class="
        cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )
      "
    >
      Log in
    </RouterLink>
    <div
      class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
    >
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <img class="block h-10" src="@/assets/images/logo.png" alt="logo">
        <RouterLink class="font-bold" :to="{name: 'Home'}">Flash Lingo</RouterLink>
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;This library has saved me countless hours of work and helped
            me deliver stunning designs to my clients faster than ever
            before.&rdquo;
          </p>
          <footer class="text-sm">Sofia Davis</footer>
        </blockquote>
      </div>
    </div>
    <div class="mx-auto py-12 flex w-full flex-col justify-center space-y-6 sm:w-[360px] lg:p-8">
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
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants } from "@/components/ui/button";
import CreateAccount from '@/components/CreateAccount.vue';

</script>

<style scoped></style>
