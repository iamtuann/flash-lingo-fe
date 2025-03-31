import type { User } from "./auth";

export enum GameType {
  MatchCards = 1,
}

export interface Score {
  id: number,
  gameType: GameType,
  lastModified: Date,
  user: User | null,
  topicId: string | number,
  time: number,
}