import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Topic, TopicRequest } from "@/types/topic";

type topicStore = {
  
}

export const useTopicStore = defineStore('topic', {
  state: () => ({
    
  } as topicStore),
  actions: {
    async save(request: TopicRequest): Promise<Topic> {
      const res = await ApiService.post('/topics', request)
      return res.data;
    },
    async getById(id: number | string): Promise<Topic> {
      const res = await ApiService.get('/topics/' + id)
      return res.data
    }
  }
})