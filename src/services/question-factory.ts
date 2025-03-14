import type { QuestionType } from '@/types'
import { MultipleChoiceGenerator, TermInputGenerator, TrueFalseGenerator, type QuestionGenerator } from './question-generators'

export class QuestionFactory {

  createQuestionGenerator(type: QuestionType): QuestionGenerator {
    switch (type) {
      case "multipleChoice":
        return new MultipleChoiceGenerator()
      case "termInput":
        return new TermInputGenerator()
      case "trueFalse":
        return new TrueFalseGenerator()
      default:
        throw new Error(`Unsupported question type: ${type}`)
    }
  }
}
