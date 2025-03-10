<template>
  <form @submit.prevent="onSubmit">
    <div class="grid gap-4">
      <div class="grid gap-3">
        <Label required for="name"> Title </Label>
        <Input id="name" name="title" v-model="request.name" placeholder="Enter a title" type="text"
          :disabled="isLoading" />
      </div>
      <RadioGroup :default-value="0" v-model="request.status" class="grid gap-3">
        <Label> Mode </Label>
        <div class="flex gap-4">
          <div class="flex items-center space-x-3">
            <RadioGroupItem id="private" :value="0" />
            <Label for="private">Private</Label>
          </div>
          <div class="flex items-center space-x-3">
            <RadioGroupItem id="public" :value="1" />
            <Label for="public">Public</Label>
          </div>
        </div>
      </RadioGroup>
      <p v-show="errMsg" role="alert" class="error-msg -mt-2">{{ errMsg }}</p>
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
import { ref, reactive } from "vue";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LoaderCircle } from "lucide-vue-next";
import { hasValues, getMessage } from "@/utils";
import { useFolderStore } from "@/stores";
import type { Folder } from "@/types";

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
const request = reactive({
  name: props.name ?? "",
  status: props.status ?? 0
})

console.log(request)
const isLoading = ref(false)
const errMsg = ref("")

async function onSubmit() {
  errMsg.value = ""
  isLoading.value=true
  try {
    const valid = hasValues({name: request.name})
    if (!valid) {
      errMsg.value = "Folder name cannot be blank."
      return;
    }
    if (props.type == 'create') {
      const res = await folderStore.create(request);
      emit('success', res)
    } else {
      const res = await folderStore.update(props.id as number, request);
      emit('success', res)
    }
  } catch (e) {
    errMsg.value = getMessage(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

</style>