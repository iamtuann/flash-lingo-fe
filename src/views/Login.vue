<template>
  <div
    class="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <RouterLink
      :to="{name: 'Signup'}"
      :class="
        cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )
      "
    >
      Sign up
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
    <div class="lg:p-8">
      <div
        class="mx-auto flex py-12 w-full flex-col justify-center space-y-6 sm:w-[360px]"
      >
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your email below to log in your account
          </p>
        </div>
        <LoginForm />
        <p class="px-8 text-center text-sm text-muted-foreground">
          By clicking Log in, you agree to our
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
import LoginForm from '@/components/LoginForm.vue';

</script>

<style scoped></style>
