import type { Question, Term, QuestionType } from "@/types";
import { QuestionFactory } from "./question-factory";

export class QuestionService {
  private questionFactory: QuestionFactory
  private generatorCache: Map<QuestionType, any> = new Map()

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
      const typeCount = index < remainder ? questionsPerType + 1 : questionsPerType
      const typeQuestions = this.generateQuestionsOfType(shuffledTerms, type, typeCount)
      questions.push(...typeQuestions)
    })
    return questions.sort(() => Math.random() - 0.5)
  }

  generateTestQuestions(terms: Term[], questionTypes: QuestionType[]): Question[] {
    if (terms.length === 0 || questionTypes.length === 0) {
      return []
    }
    const shuffledTerms = [...terms].sort(() => Math.random() - 0.5)
    const totalType = questionTypes.length
    const generatedQuestions: Question[] = []
    shuffledTerms.forEach((term) => {
      const randomType = questionTypes[Math.floor(Math.random() * totalType)]
      const question = this.generateQuestionOfTerm(shuffledTerms, term, randomType)
      if (question) {
        generatedQuestions.push(question)
      }
    })
    return generatedQuestions;
  }


  private generateQuestionsOfType(terms: Term[], type: QuestionType, count: number): Question[] {
    try {
      let generator = this.generatorCache.get(type)
      if (!generator) {
        generator = this.questionFactory.createQuestionGenerator(type)
        this.generatorCache.set(type, generator)
      }
      return generator.generate(terms, count)
    } catch (error) {
      console.error(`Error generating questions of type ${type}:`, error)
      return []
    }
  }

  private generateQuestionOfTerm(terms: Term[], targetTerm: Term, type: QuestionType): Question | null {
    try {
      let generator = this.generatorCache.get(type)
      if (!generator) {
        generator = this.questionFactory.createQuestionGenerator(type)
        this.generatorCache.set(type, generator)
      }
      return generator.generateQuestion(terms, targetTerm)
    } catch (error) {
      console.error(`Error generating questions of type ${type}:`, error)
      return null
    }
  }
}