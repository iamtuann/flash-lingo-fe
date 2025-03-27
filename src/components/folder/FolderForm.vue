<template>
  <form @submit="onSubmit">
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
      <FormField v-slot="{ componentField }" type="radio" name="status">
        <FormItem>
          <FormLabel>Mode</FormLabel>
          <FormControl>
            <RadioGroup v-bind="componentField" class="space-x-3">
              <div class="flex gap-4">
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem :value="0" />
                  </FormControl>
                  <FormLabel>Private</FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem :value="1" />
                  </FormControl>
                  <FormLabel>Public</FormLabel>
                </FormItem>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      </FormField>
      
      <div class="flex justify-end gap-3">
        <!-- <Button variant="ghost" :disabled="isLoading"> Cancel </Button> -->
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-1 h-4 w-4 animate-spin" />
          {{ type == 'create' ? 'Create' : 'Save' }}
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LoaderCircle } from "lucide-vue-next";
import { useFolderStore } from "@/stores";
import type { Folder } from "@/types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { configure, useForm } from "vee-validate";

export type FolderFormEmits = {
  'success': [payload: Folder],
};
export interface FolderFormProps {
  type: 'create' | 'update',
  id?: string | number,
  name?: string,
  status?: number
}
const emit = defineEmits<FolderFormEmits>()
const props = defineProps<FolderFormProps>()

const folderStore = useFolderStore()

const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
  name: z.string().nonempty({ message: 'This is required'}).default(props.name || ""),
  status: z.number().optional().default(props.status || 0),
}))
configure({
  validateOnBlur: false
})

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value=true
  try {
    if (props.type == 'create') {
      const res = await folderStore.create(values);
      emit('success', res)
    } else {
      const res = await folderStore.update(props.id as number, values);
      emit('success', res)
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>

</style>