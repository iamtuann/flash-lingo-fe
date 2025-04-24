import type { User } from "./auth";
import type { EStatus } from "./common";
import type { Term } from "./term";

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

export interface GenerateTopicRequest {
  name: string,
  description?: string,
  termCount: number,
  level: 'Beginner' | 'Intermediate' | 'Advanced',
}

export interface GenerateTopicResponse {
  name: string,
  description?: string,
  terms: Term[],
  shortPassage: string,
}