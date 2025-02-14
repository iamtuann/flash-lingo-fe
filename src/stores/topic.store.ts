import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Topic, TopicRequest } from "@/types/topic";

type topicStore = {
  topic: Topic | null
}

export const useTopicStore = defineStore('topic', {
  state: () => ({
    topic: null
  } as topicStore),
  actions: {
    async save(request: TopicRequest): Promise<Topic> {
      const res = await ApiService.post('/topics', request)
      return res.data;
    },
    async getById(id: number | string): Promise<Topic> {
      if (this.topic && this.topic.id == id) {
        return this.topic
      }
      const res = await ApiService.get('/topics/' + id)
      if (res.status == 200) {
        this.topic = res.data
      } else {
        this.topic = null
      }
      return res.data
    }
  }
})