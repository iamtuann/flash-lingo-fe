import type { Question } from "@/types"

export interface QuestionComponentProps {
  question: Question;
  userAnswer: string | string[];
  isAnswered: boolean;
  isCorrect?: boolean;
}

export interface QuestionComponentEmits {
  // (e: 'answerChange', answer: string | string[]): void;
  // 'answerChange': (answer: string | string[]) => void;
  'answerChange': [answer: string | string[]];
}

export { default as QuestionRenderer } from "./QuestionRenderer.vue"
export { default as MultipleChoiceQuestion } from "./MultipleChoiceQuestion.vue"
export { default as TrueFalseQuestion } from "./TrueFalseQuestion.vue"
export { default as TermInputQuestion } from "./TermInputQuestion.vue"