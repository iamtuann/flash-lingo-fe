import type { User } from "./auth";

export interface TopicRequest {
  id?: number,
  name: string,
  description: string,
  termLang: string,
  defLang: string,
}

export interface Topic {
  id: string,
  name: string,
  description: string,
  createdBy: User,
  createdAt: Date,
  updatedAt: Date,
  slug: string,
  termLang: string,
  defLang: string,
  status: number,
  terms: any[],
  termsNumber: number,
}