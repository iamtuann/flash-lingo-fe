
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
  synonyms?: string[],
  antonyms?: string[],
  modifiedAt?: string,
}
