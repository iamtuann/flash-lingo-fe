import type { Question } from "@/types"

export interface QuestionRendererProps {
  question: Question
  userAnswer: string | string[]
  isAnswered: boolean
  onAnswerChange: (answer: string | string[]) => void
}

export { default as MultipleChoiceQuestion } from "./MultipleChoiceQuestion.vue"
export { default as TrueFalseQuestion } from "./TrueFalseQuestion.vue"
export { default as TermInputQuestion } from "./TermInputQuestion.vue"