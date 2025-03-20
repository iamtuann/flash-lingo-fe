import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Folder, FolderRequest, Page, Topic } from "@/types";

export type folderStore = {
  folder: Folder | null,
}

export const useFolderStore = defineStore('folderStore', {
  state: () => ({
    folder: null,
  } as folderStore),
  actions: {
    async getById(id: number | string): Promise<Folder> {
      if (this.folder != null && this.folder.id === id) {
        return this.folder;
      }
      const res = await ApiService.get(`/folders/${id}`);
      if (res.status == 200) {
        this.folder = res.data
      }
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
      if (res.status == 200) {
        this.folder = res.data
      }
      return res.data;
    },
    async update(id: string | number, request: FolderRequest): Promise<Folder> {
      this.folder = null
      const res = await ApiService.put(`/folders/${id}`, request);
      if (res.status == 200) {
        this.folder = res.data
      }
      return res.data;
    },
    async delete(id: string | number) {
      const res = await ApiService.delete(`/folders/${id}`);
      this.folder = null
      return res.data;
    },
    async addTopic(folderId: string | number, topicIds: (string | number)[]) {
      const res = await ApiService.post(`/folders/topics`, {
        folderId, topicIds
      });
      if (res.status == 200) {
        this.folder = res.data
      }
      return res.data;
    }
  }
})