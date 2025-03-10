import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Folder, FolderRequest, Page, Topic } from "@/types";

export const useFolderStore = defineStore('folderStore', {
  state: () => ({

  }),
  actions: {
    async getById(id: number | string): Promise<Folder> {
      const res = await ApiService.get(`/folders/${id}`);
      return res.data;
    },
    async getTopics(folderId: number | string, name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<Topic>> {
      const res = await ApiService.get(`/folders/${folderId}/topics`, {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    },
    async create(request: FolderRequest): Promise<Folder> {
      const res = await ApiService.post('/folders', request);
      return res.data;
    },
    async update(id: string | number, request: FolderRequest): Promise<Folder> {
      const res = await ApiService.put(`/folders/${id}`, request);
      return res.data;
    },
    async delete(id: string | number) {
      const res = await ApiService.delete(`/folders/${id}`);
      return res.data;
    },
    async addTopic(folderId: string | number, topicIds: string[] | number[]) {
      const res = await ApiService.post(`/folders/topic`, {
        folderId, topicIds
      });
      return res.data;
    }
  }
})