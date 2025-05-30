import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { GenerateTopicRequest, GenerateTopicResponse, Page, Photo, Suggestion, Thesaurus, Word } from "@/types";


export const useSuggestionStore = defineStore('suggestionStore', {
  state: () => ({
    generatedTopic: null
  } as {
    generatedTopic: GenerateTopicResponse | null
  }),
  actions: {
    async getSuggestWords(prefix: string, limit?: number): Promise<Suggestion<Word>> {
      limit = limit || 3
      const res = await ApiService.get('/suggestions/word', {
        params: {
          prefix,
          limit,
        }
      })
      return res.data
    },
    async getSuggestionDefinitions(word: string, prefix: string, limit?: number): Promise<Suggestion<string>> {
      limit = limit || 3
      const res = await ApiService.get('/suggestions/definition', {
        params: {
          word,
          prefix,
          limit,
        }
      })
      return res.data
    },
    async getPronunciation(word: string, prefix?: string): Promise<Suggestion<string>> {
      const res = await ApiService.get('/suggestions/pronunciation', {
        params: {
          word,
          prefix
        }
      })
      return res.data
    },
    async generateExamples(term: string, definition: string): Promise<string[]> {
      const res = await ApiService.post('/suggestions/examples/generate', null, {
        params: {
          term,
          definition
        }
      })
      return res.data
    },
    async searchPhotos(query: string): Promise<Page<Photo>> {
      const res = await ApiService.get('/suggestions/search-photos', {
        params: {
          query
        }
      })
      return res.data
    },
    async generateTopic(request: GenerateTopicRequest): Promise<GenerateTopicResponse> {
      const res = await ApiService.post('/suggestions/topic/generate', request)
      if (res.status === 200) {
        this.generatedTopic = res.data
      }
      return res.data
    },
    async getThesaurus(word: string): Promise<Thesaurus> {
      const res = await ApiService.get('/suggestions/thesaurus', {
        params: {
          word
        }
      })
      return res.data
    }
  }
})