

export type QuestionType = 
  "multipleChoice"
  | "trueFalse"
  | "termInput"
  // | "fillInBlank"
  // | "matching"
  // | "wordAssociation"
  // | "synonymAntonym"

export interface Question {
  id: string,
  type: QuestionType,
  term?: string,
  definition?: string,
  options?: string[],
  correctAnswer: string | string[],
  isTrue?: boolean
}

export interface QuizState {
  currentQuestionIndex: number,
  score: number,
  userAnswers: Record<string, string | string[]>,
  isAnswered: boolean,
  isCorrect: boolean,
  quizCompleted: boolean,
}