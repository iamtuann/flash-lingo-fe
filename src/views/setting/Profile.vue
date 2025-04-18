<script setup lang="ts">
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Separator } from '@/components/ui/separator'

import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import {  useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import * as z from 'zod'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { LoaderCircle } from 'lucide-vue-next'
import axios from 'axios'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
const isLoading = ref(false);

const profileFormSchema = toTypedSchema(z.object({
  username: z.string({required_error: 'Username is require.',})
    .min(3, {message: 'Username must be at least 3 characters.'})
    .max(30, {message: 'Username must not be longer than 30 characters.'}),
  email: z.string({required_error: 'Email is require.',})
    .email(),
  firstName: z.string({required_error: 'First name is require.'}),
  lastName: z.string({required_error: 'Last name is require.'}),
  bio: z.string()
  .max(160, { message: 'Bio must not be longer than 160 characters.'})
  .optional()
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
  initialValues: user.value
})

watch(user, () => {
  if (user.value) {
    resetForm({values: user.value})
  }
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value=true
  try {
    const res = await authStore.updateProfile(values);
    toast({
      title: 'Update profile successfully!',
      variant: 'success',
    })
  } catch (e: unknown) {
    console.error(e)
    if (axios.isAxiosError(e)) {
      if (e.status == 400) {
        toast({
          title: 'Update profile not success!',
          description: e.response?.data.message,
          variant: 'destructive',
        })
      } 
    } else {
      toast({
          title: 'Update profile not success!',
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
      Profile
    </h3>
    <p class="text-sm text-muted-foreground">
      This is how others will see you on the site.
    </p>
  </div>
  <Separator class="my-4" />
  <form class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel required>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="tuannguyen" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name. It can be your real name or a pseudonym.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel required>Email</FormLabel>
        <FormControl>
          <Input disabled type="email" placeholder="flashlingo@gmail.com" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="firstName">
        <FormItem>
          <FormLabel required>First name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Nguyen" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lastName">
        <FormItem>
          <FormLabel required>Last name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Tuan" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <FormField v-slot="{ componentField }" name="bio">
      <FormItem>
        <FormLabel>Bio</FormLabel>
        <FormControl>
          <Textarea placeholder="Tell us a little bit about yourself" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex gap-2 justify-start">
      <Button type="submit" :disabled="isLoading">
        <LoaderCircle v-if="isLoading" class=" h-4 w-4 animate-spin" />
        Update profile
      </Button>

      <Button
        type="button"
        variant="outline"
        @click="resetForm"
        :disabled="isLoading"
      >
        Reset form
      </Button>
    </div>
  </form>
</template>