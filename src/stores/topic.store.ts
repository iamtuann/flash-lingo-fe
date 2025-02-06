import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Topic, TopicRequest } from "@/types/topic";

type topicStore = {
  token: string,
  username: string,
  isAuthenticated: boolean
}

export const useTopicStore = defineStore('topic', {
  state: () => ({
    
  } as topicStore),
  actions: {
    async create(request: TopicRequest): Promise<Topic> {
      const res = await ApiService.post('/topics', request)
      return res.data;
    }
  }
})