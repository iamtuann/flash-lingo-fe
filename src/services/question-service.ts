import type { Question, Term, QuestionType } from "@/types";
import { QuestionFactory } from "./question-factory";

export class QuestionService {
  private questionFactory: QuestionFactory

  constructor() {
    this.questionFactory = new QuestionFactory()
  }
  
  generateQuestions(terms: Term[], count: number, questionTypes: QuestionType[]): Question[] {
    if (terms.length === 0 || questionTypes.length === 0) {
      return []
    }

    // Shuffle terms to ensure random selection
    const shuffledTerms = [...terms].sort(() => Math.random() - 0.5)

    // Calculate how many questions of each type to generate
    const questionsPerType = Math.floor(count / questionTypes.length)
    const remainder = count % questionTypes.length

    const questions: Question[] = []

    questionTypes.forEach((type, index) => {
      // Add extra question from remainder if needed
      const typeCount = index < remainder ? questionsPerType + 1 : questionsPerType
      const typeQuestions = this.generateQuestionsOfType(shuffledTerms, type, typeCount)
      questions.push(...typeQuestions)
    })
    return questions.sort(() => Math.random() - 0.5)
  }


  private generateQuestionsOfType(terms: Term[], type: QuestionType, count: number): Question[] {
    const generator = this.questionFactory.createQuestionGenerator(type)
    return generator.generate(terms, count)
  }
}