
// export interface TermRequest {
//   id?: string | number,
//   topicId: string | number,
//   term: string,
//   definition: string,
//   rank: number,
// }

export interface Term {
  id?: string | number,
  term: string,
  definition: string,
  pronunciation?: string,
  partOfSpeech?: string,
  example?: string,
  level?: string,
  imageUrl?: string,
  rank: number,
  topicId: string | number,
  modifiedAt?: string,
}

export interface Suggestion<T> {
  word: string;
  prefix: string;
  suggestions: T[];
}

export interface Word {
  id: number,
  word: string,
  pronunciation: string
}