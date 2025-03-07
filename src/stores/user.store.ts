import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Page, Topic } from "@/types";

export const useUserStore = defineStore('userStore', {
  state: () => ({

  }),
  actions: {
    async getAuthTopics(name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<Topic>> {
      const res = await ApiService.get('/users/topics', {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    }
  }
})