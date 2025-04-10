import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Term } from "@/types/term";

type termStore = {
  
}

export const useTermStore = defineStore('term', {
  state: () => ({
    
  } as termStore),
  actions: {
    async save(request: Term): Promise<Term> {
      const res = await ApiService.post('/terms', request)
      return res.data;
    },
    async saveList(request: Term[]): Promise<Term[]> {
      const res = await ApiService.post('/terms/list', {
        terms: request
      })
      return res.data;
    },
    async changeRank(id: string | number, topicId: string | number, rank: number) {
      const res = await ApiService.post('/terms', {
        id,
        topicId,
        rank
      })
      return res.data;
    },
    async getAllByTopicId(topicId: number | string): Promise<Term[]> {
      const res = await ApiService.get('/terms', {
        params: {
          topicId: topicId
        }
      })
      return res.data
    },
    async delete(topicId: number | string, id: number | string) {
      const res = await ApiService.delete('/terms', {
        data: {
          topicId,
          id
        }
      })
      return res.data
    }
  }
})