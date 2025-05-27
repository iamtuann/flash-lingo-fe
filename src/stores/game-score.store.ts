import type { GameType, Score } from "@/types";
import { defineStore } from "pinia";

export type gameStore = {
  savedScore: Score | null
}

export const useGameScoreStore = defineStore('gameScore', {
  state: () => ({
    savedScore: null
  } as gameStore),
  actions: {
    async saveScore(topicId: string | number, gameType: GameType, time: number) {
      // if (!useAuthStore().isAuthenticated) {
        this.savedScore = {
          id: 0,
          gameType: gameType,
          lastModified: new Date(),
          user: null,
          topicId: topicId,
          time: time,
        }
      // } else {
        // const res = await ApiService.post('', {
  
        // })
    },
    async getTopScores(topicId: string | number, gameType: GameType): Promise<Score[]> {
      const scores = []
      if (this.savedScore) {
        scores.push(this.savedScore)
      }
  
      return scores
    }
  }
})