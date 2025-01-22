<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label required for="email"> Email </Label>
          <Input id="email" v-model="formData.email" placeholder="name@example.com" type="email"
            :disabled="isLoading" />
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
        <p v-show="errMsg" role="alert" class="error-msg -mt-2">{{ errMsg }}</p>
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Log in
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
      <GoogleLogin :callback="callback">
        <Button variant="outline" type="button" :disabled="isLoading" class="w-full">
          <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          <svg role="img" class="mr-2 h-4 w-4" viewBox="0 0 48 48">
            <path path fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
            </path>
            <path fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
            </path>
            <path fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
            </path>
            <path fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
            </path>
          </svg>
          Google
        </Button>
      </GoogleLogin>
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
import type { CallbackTypes } from 'vue3-google-login';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/error';
import { hasValues } from '@/utils';

const router = useRouter();
const isLoading = ref(false)
const errMsg = ref("")
const showPassword = ref(false);
const formData = reactive({
  email: "",
  password: "",
})

const callback: CallbackTypes.CodeResponseCallback = async (response) => {
  isLoading.value = true
  try {
    const code = response.code;
    await useAuthStore().googleLogin(code)
    router.push({name: 'Home'})
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false
  }
};

async function onSubmit() {
  errMsg.value = ""
  isLoading.value = true
  try {
    const valid = hasValues(formData)
    if (!valid) {
      errMsg.value = "Email or password cannot be blank."
      return;
    }
    const {email, password} = formData;
    await useAuthStore().login(email, password)
    router.push({name: 'Home'})
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
