import { useAuthStore } from "@/stores";
import type { Topic } from "@/types";

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