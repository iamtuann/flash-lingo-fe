import { useAuthStore } from "@/stores";
import type { Topic } from "@/types";
import { EStatus } from "@/types";

export function viewableTopic(topic: Topic | null) {
  const authStore = useAuthStore()
  if (topic == null) {
    return false;
  }
  return topic.status === EStatus.PUBLIC || topic.createdBy.email === authStore.email
}

export function editableTopic(topic: Topic | null) {
  const authStore = useAuthStore()
  if (topic == null) {
    return false;
  }
  if (authStore.isAuthenticated) {
    return authStore.email === topic.createdBy.email
  } else {
    return false
  }
}