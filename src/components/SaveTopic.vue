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
        <Button v-if="cancelable" variant="ghost" :disabled="isLoading" @click="emit('cancel')">
          Cancel
        </Button>
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-1 h-4 w-4 animate-spin" />
          Save
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
import { useRoute } from "vue-router";

export type SaveTopicEmits = {
  'success': [payload: Topic],
  'cancel': []
};
export type SaveTopicProps = {
  role?: 'create' | 'update',
  cancelable?: boolean
}
const emit = defineEmits<SaveTopicEmits>()
const props = withDefaults(defineProps<SaveTopicProps>() , {
  role: 'create'
})

const route = useRoute();
const topicStore = useTopicStore()
const isLoading = ref(false)
const errMsg = ref("")
const formData = reactive<TopicRequest>({
  id: "",
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
    const res = await topicStore.save(formData);
    emit('success', res)
  } catch (e) {
    errMsg.value = getMessage(e)
  } finally {
    isLoading.value = false
  }
}

async function getTopicById() {
  try {
    const topicId = route.params.id as string;
    const res = await topicStore.getById(topicId);
    const { id, name, description, termLang, defLang } = res
    formData.id = id
    formData.name = name;
    formData.description = description
    formData.termLang = termLang
    formData.defLang = defLang
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