
export interface TestState {
  answers: Record<string, string | string[]>
  flaggedQuestions: string[]
  startTime: number
  endTime: number | null
  isSubmitted: boolean
}

export interface TestResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
  timeSpent: number
  questionResults: Record<
    string,
    {
      isCorrect: boolean
      userAnswer: string | string[]
      correctAnswer: string | string[]
    }
  >
}