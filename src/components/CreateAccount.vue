<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label required for="email"> Email </Label>
          <Input
            id="email"
            v-model="formData.email"
            placeholder="name@example.com"
            type="email"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-2">
          <Label required for="password">Password</Label>
          <div class="relative w-full">
            <Input id="password" class="pr-10" v-model="formData.password" placeholder="••••••••"
              :type="showPassword ? 'text' : 'password'" :disabled="isLoading" />
            <span class="absolute end-0 inset-y-0 flex items-center px-3 cursor-pointer"
              @click="showPassword = !showPassword"
            >
              <Eye v-show="!showPassword" class="size-4" />
              <EyeClosed v-show="showPassword" class="size-4" />
            </span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="grid gap-2">
            <Label required for="firstname"> First name </Label>
            <Input
              id="firstname"
              v-model="formData.firstName"
              placeholder="Tuan"
              type="text"
              :disabled="isLoading"
            />
          </div>
          <div class="grid gap-2">
            <Label required for="lastname"> Last name </Label>
            <Input
              id="lastname"
              v-model="formData.lastName"
              placeholder="Nguyen"
              type="text"
              :disabled="isLoading"
            />
          </div>
        </div>
        <p v-show="errMsg" role="alert" class="error-msg -mt-2">{{ errMsg }}</p>
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Create Account
        </Button>
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
    <div class="grid grid-cols-1">
      <!-- <Button variant="outline" type="button" :disabled="isLoading">
        <Facebook class="mr-2 h-4 w-4" />
        Facebook
      </Button> -->
      <Button variant="outline" type="button" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        <svg role="img" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
          <path
            fill="currentColor"
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          />
        </svg>
        Google
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from "@/stores";
import { useRouter } from "vue-router";

import { cn } from '@/lib/utils'
import { LoaderCircle, Eye, EyeClosed } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { hasValues } from '@/utils';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/error';

const router = useRouter();
const isLoading = ref(false)
const showPassword = ref(false);
const errMsg = ref("");
const formData = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: ""
})
async function onSubmit() {
  errMsg.value = ""
  isLoading.value = true
  try {
    const valid = hasValues(formData)
    if (!valid) {
      errMsg.value = "Please enter required fields."
      return;
    }
    const {email, password, firstName, lastName} = formData;
    const res = await useAuthStore().register(email, password, firstName, lastName)
    if (res.status === 201) {
      await useAuthStore().login(email, password)
      router.push({name: 'Home'})
    }
  } catch (e) {
    console.error(e);
    const err = e as AxiosError<ErrorResponse>
    if (err.status == 500) {
      errMsg.value = "Oops, something went wrong 😅, please try later!"
    } else {
      errMsg.value = err.response?.data.message || "Oops, something went wrong 😅, please try later!";
    }
  } finally {
    isLoading.value = false
  }
}
</script>
