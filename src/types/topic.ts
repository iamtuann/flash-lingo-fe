import type { User } from "./auth";
import type { EStatus } from "./common";

export interface TopicRequest {
  id?: number | string,
  name: string,
  description: string,
  shortPassage?: string,
  conversation?: string,
  termLang?: string,
  defLang?: string,
}

export interface Topic {
  id: number | string,
  name: string,
  description: string,
  shortPassage?: string,
  conversation?: string,
  createdBy: User,
  createdAt: Date,
  updatedAt: Date,
  slug: string,
  termLang: string,
  defLang: string,
  status: EStatus,
  terms: any[],
  termsNumber: number,
}

export interface TopicLearning {
  topicId: string | number,
  termLearningIds: number[]
}