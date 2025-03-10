import type { User } from "./auth";

export interface Folder {
  id: string | number,
  name: string,
  createdBy: User,
  description: string,
  createdAt: Date,
  updatedAt: Date,
  slug: string,
  status: number,
  itemsNumber: string,
  topicIds: number[]
}

export interface FolderRequest {
  name: string,
  description?: string,
  status?: number
}