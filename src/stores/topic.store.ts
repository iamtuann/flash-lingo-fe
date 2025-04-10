import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Topic, TopicRequest } from "@/types/topic";
import type { EStatus, Page } from "@/types";

type topicStore = {
  topic: Topic | null
}

export const useTopicStore = defineStore('topic', {
  state: () => ({
    topic: null
  } as topicStore),
  actions: {
    async searchTopic(name: string, pageIndex: number, pageSize: number, key?: string, orderBy?: string): Promise<Page<Topic>> {
      const res = await ApiService.get('/topics', {
        params: {
          name, pageIndex, pageSize, key, orderBy
        }
      })
      return res.data
    },
    async getPopularTopic(): Promise<Page<Topic>> {
      const res = await ApiService.get('/topics/list/popular')
      return res.data
    },
    async save(request: TopicRequest): Promise<Topic> {
      this.topic = null
      const res = await ApiService.post('/topics', request)
      // if (res.status == 200) {
      //   this.topic = res.data
      // }
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
    },
    async changeStatus(topicId: string | number, status: EStatus): Promise<Topic> {
      const res = await ApiService.put(`/topics/${topicId}/status`, null, {
        params: {status}
      })
      if (res.status == 200 && this.topic?.id == topicId) {
        this.topic = res.data
      } else {
        this.topic = null
      }
      return res.data
    },
    async delete(topicId: string | number) {
      await ApiService.delete(`/topics/${topicId}`)
      if (this.topic?.id == topicId) {
        this.topic = null
      }
    },
    async addToFolders(topicId: string | number, folderIds: (string | number)[]) {
      const res = await ApiService.post(`/topics/${topicId}/folders`, {
        folderIds
      });
      return res.data;
    }
  }
})