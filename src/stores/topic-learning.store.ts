import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { TopicLearning } from "@/types";


export const useTopicLearningStore = defineStore('topicLearning', {
  state: () => ({
    
  }),
  actions: {
    async getTopicLearning(topicId: string | number, isAuthenticated?: boolean):Promise<TopicLearning> {
      if (!isAuthenticated) {
        return {
          topicId: topicId,
          termLearningIds: []
        }
      }
      const res = await ApiService.get('/learning/flashcard', {
        params: {
          topicId: topicId
        }
      })
      return res.data
    },
    async saveTopicLearning(request: TopicLearning) {
      const res = await ApiService.post('/learning/flashcard', request)
      return res;
    }
  }
})