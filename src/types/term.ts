
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
  imageUrl?: string,
  rank: number,
  topicId: string | number,
  modifiedAt?: string,
}