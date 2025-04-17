import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Folder, Page, Topic, User } from "@/types";

export const useUserStore = defineStore('userStore', {
  state: () => ({

  }),
  actions: {
    async searchUsers(name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<User>> {
      const res = await ApiService.get('/users', {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    },
    async getTopCreators(): Promise<Page<User>> {
      const res = await ApiService.get('/users/list/top-creators', {
        params: {
          pageIndex: 1,
          pageSize: 12
        }
      })
      return res.data
    },
    async getAuthTopics(name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<Topic>> {
      const res = await ApiService.get('/users/topics', {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    },
    async getAuthFolders(name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<Folder>> {
      const res = await ApiService.get('/users/folders', {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    },
    async getRecentTopics(name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<Topic>> {
      const res = await ApiService.get('/users/recent-topics', {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    },
    async getProfile(userId: string | number): Promise<User> {
      const res = await ApiService.get('/users/' + userId)
      return res.data
    },
  }
})