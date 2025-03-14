import type { QuestionType, Question, Term } from '@/types'


export interface QuestionGenerator {
  generate(terms: Term[], count: number): Question[]
}

abstract class BaseQuestionGenerator implements QuestionGenerator {
  abstract generate(terms: Term[], count: number): Question[]
  
  protected shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5)
  }

  protected getTermsSubset(terms: Term[], count: number): Term[] {
    return this.shuffle(terms).slice(0, count)
  }

  protected generateId(type: QuestionType, index: number): string {
    return `${type}-${Date.now()}-${index}`
  }
}

/**
 * Generator for multiple choice questions
 */
export class MultipleChoiceGenerator extends BaseQuestionGenerator {
  generate(terms: Term[], count: number): Question[] {
    const questions: Question[] = []
    const subset = this.getTermsSubset(terms, count)
    
    subset.forEach((term, index) => {
      // 3 random terms incorrect options
      const incorrectOptions = terms
        .filter((item) => item.id !== term.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((item) => item.term)

      const options = this.shuffle([term.term, ...incorrectOptions])

      questions.push({
        id: this.generateId("multipleChoice", index),
        type: "multipleChoice",
        definition: term.definition,
        options,
        correctAnswer: term.term,
      })
    })

    return questions
  }
}

/**
 * Generator for true/false questions
 */
export class TrueFalseGenerator extends BaseQuestionGenerator {
  generate(terms: Term[], count: number): Question[] {
    const questions: Question[] = []
    const subset = this.getTermsSubset(terms, count)

    subset.forEach((term, index) => {
      const isTrue = Math.random() > 0.5

      let definition = term.definition
      if (!isTrue) {
        // Use a different term's definition
        const otherTerm = terms.filter((item) => item.id !== term.id).sort(() => Math.random() - 0.5)[0]
        definition = otherTerm.definition
      }

      questions.push({
        id: this.generateId("trueFalse", index),
        type: "trueFalse",
        term: term.term,
        definition,
        isTrue,
        correctAnswer: isTrue ? "true" : "false",
      })
    })

    return questions
  }
}

/**
 * Generator for term input questions
 */
export class TermInputGenerator extends BaseQuestionGenerator {
  generate(terms: Term[], count: number): Question[] {
    const questions: Question[] = []
    const subset = this.getTermsSubset(terms, count)

    subset.forEach((term, index) => {
      questions.push({
        id: this.generateId("termInput", index),
        type: "termInput",
        definition: term.definition,
        correctAnswer: term.term,
      })
    })

    return questions
  }
}