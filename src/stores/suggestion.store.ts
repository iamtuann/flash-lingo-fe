import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Page, Photo, Suggestion, Word } from "@/types";


export const useSuggestionStore = defineStore('suggestionStore', {
  state: () => ({

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
  }
})