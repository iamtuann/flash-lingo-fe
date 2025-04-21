<script setup lang="ts">
import { Button } from '@/components/ui/button'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Separator } from '@/components/ui/separator'

import { toast } from '@/components/ui/toast'
import { useAuthStore } from '@/stores'
import { toTypedSchema } from '@vee-validate/zod'
import axios from 'axios'
import { LoaderCircle } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import * as z from 'zod'

const authStore = useAuthStore()

const isLoading = ref(false)
const user = computed(() => authStore.user)

const accountFormSchema = toTypedSchema(z.object({
  currentPassword: z
    .string({required_error: 'Please enter your current password'}),
  password: z
    .string({required_error: 'Please enter your new password'})
    .min(6, { message: 'Password must be at least 6 characters.'})
    .max(20, {message: 'Password must not be longer than 20 characters.'}),
  confirmPassword: z
    .string({required_error: 'Please enter your confirm password'})
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation doesn't match the password",
    path: ['confirmPassword'],
  })
)

const { handleSubmit } = useForm({
  validationSchema: accountFormSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value=true
  try {
    await authStore.changePassword(values.currentPassword, values.password);
    toast({
      title: 'Change password successfully!',
      variant: 'success',
    })
  } catch (e: unknown) {
    console.error(e)
    if (axios.isAxiosError(e)) {
      if (e.status == 401) {
        toast({
          title: 'Change password not success!',
          description: 'The password is incorrect',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Change password not success!',
          description: e.response?.data.message,
          variant: 'destructive',
        })
      }
    } else {
      toast({
          title: 'Change password not success!',
          description: 'System error',
          variant: 'destructive',
        })
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Account
    </h3>
    <p class="text-sm text-muted-foreground">
      Update your account settings. Manager password and authentication
    </p>
  </div>
  <Separator class="my-6" />
  <form v-if="user?.provider == 'System'" class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="currentPassword">
      <FormItem>
        <FormLabel required>Current password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel required>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="confirmPassword">
      <FormItem>
        <FormLabel required>Confirm your password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <p class="text-sm text-muted-foreground">
      Password must be between 6 and 20 characters
    </p>

    <div class="flex justify-start">
      <Button type="submit" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class=" h-4 w-4 animate-spin" />
        Update password
      </Button>
    </div>
  </form>

  <div v-else>
    <p class="text-sm text-muted-foreground text-center">
      Your account is provided by third-party services ({{ user?.provider }})
    </p>
  </div>
</template>