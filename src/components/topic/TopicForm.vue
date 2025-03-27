<template>
  <Form ref="formRef" :validation-schema="formSchema" @submit="onSubmit">
    <div class="grid gap-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel required>Title</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter a title" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input autocomplete="false" type="text" placeholder="Add a description..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex justify-end gap-3">
        <Button v-if="cancelable" variant="ghost" :disabled="isLoading" @click="emit('cancel')">
          Cancel
        </Button>
        <Button type="submit">
          <LoaderCircle v-if="isLoading" class="mr-1 h-4 w-4 animate-spin" />
          Save
        </Button>
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-vue-next";
import { useTopicStore } from "@/stores/topic.store";
import type { Topic, TopicRequest } from "@/types/topic";
import { useRoute } from "vue-router";
import { configure } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export type TopicFormEmits = {
  'success': [payload: Topic],
  'cancel': []
};
export type TopicFormProps = {
  role?: 'create' | 'update',
  cancelable?: boolean
}
const emit = defineEmits<TopicFormEmits>()
const props = withDefaults(defineProps<TopicFormProps>() , {
  role: 'create'
})

const route = useRoute();
const topicStore = useTopicStore()
const isLoading = ref(false)
const formRef = ref()
configure({
  validateOnBlur: false
})

const formSchema = toTypedSchema<any, TopicRequest>(z.object({
  id: z.string().or(z.number()).optional(),
  name: z.string().nonempty({ message: 'This is required'}),
  description: z.string().optional(),
}))

async function onSubmit(values: any) {
  isLoading.value=true
  try {
    const res = await topicStore.save(values);
    emit('success', res)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

async function getTopicById() {
  try {
    const topicId = route.params.id as string;
    const res = await topicStore.getById(topicId);
    const data = {
      id: res.id,
      name: res.name,
      description: res.description || '',
    }
    formRef.value?.resetForm({values: data})
  } catch (error) {
    console.error(error)
  }
}

if (props.role == 'update') {
  getTopicById();
}
</script>

<style scoped>

</style>