<template>
  <form @submit.prevent="onSubmit">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label required for="name"> Title </Label>
        <Input id="name" name="title" v-model="formData.name" placeholder="Enter a title" type="text"
          :disabled="isLoading" />
      </div>
      <div class="grid gap-2">
        <Label for="descriptionF">Description</Label>
        <div class="relative w-full">
          <Input id="description" autocomplete="false" class="pr-10" v-model="formData.description"
            type="text" :disabled="isLoading" placeholder="Add a description..." />
        </div>
      </div>
      <p v-show="errMsg" role="alert" class="error-msg -mt-2">{{ errMsg }}</p>
      <div class="flex justify-end gap-3">
        <!-- <Button variant="ghost" :disabled="isLoading"> Cancel </Button> -->
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-1 h-4 w-4 animate-spin" />
          Create
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-vue-next";
import { useTopicStore } from "@/stores/topic.store";
import type { Topic, TopicRequest } from "@/types/topic";
import { hasValues, getMessage } from "@/utils";

export type SaveTopicEmits = {
  'success': [payload: Topic];
};
const emit = defineEmits<SaveTopicEmits>()

const topicStore = useTopicStore()
const isLoading = ref(false)
const errMsg = ref("")
const formData = reactive<TopicRequest>({
  name: "",
  description: "",
  termLang: "",
  defLang: ""
})

async function onSubmit() {
  errMsg.value = ""
  isLoading.value=true
  try {
    const valid = hasValues({name: formData.name})
    if (!valid) {
      errMsg.value = "Topic name cannot be blank."
      return;
    }
    const res = await topicStore.create(formData);
    emit('success', res)
  } catch (e) {
    errMsg.value = getMessage(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

</style>