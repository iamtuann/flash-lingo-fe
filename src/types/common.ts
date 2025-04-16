
export enum EStatus {
  PRIVATE = 0,
  PUBLIC = 1,
  DRAFT = 2
}

export interface Photo {
  id: string;
  width: string;
  height: string;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  src: string;
  alt: string;
}

export interface StudyTime {
  id: number;
  userId: string | number;
  statDate: string; // yyyy-MM-dd
  totalDurationSeconds: number;
}