import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import type { Suggestion, Word } from "@/types";


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
  }
})