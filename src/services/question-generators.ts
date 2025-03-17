import type { QuestionType, Question, Term } from '@/types'


export interface QuestionGenerator {
  generateQuestion(terms: Term[], targetTerm: Term): Question
  generate(terms: Term[], count: number): Question[]
}

abstract class BaseQuestionGenerator implements QuestionGenerator {
  abstract generateQuestion(terms: Term[], targetTerm: Term): Question
  abstract generate(terms: Term[], count: number): Question[]
  
  protected shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5)
  }

  protected getTermsSubset(terms: Term[], count: number): Term[] {
    return this.shuffle(terms).slice(0, count)
  }

  protected generateId(type: QuestionType): string {
    return `${type}-${Math.random().toString(36).substring(2, 9)}`
  }
}

/**
 * Generator for multiple choice questions
 */
export class MultipleChoiceGenerator extends BaseQuestionGenerator {
  generateQuestion(terms: Term[], targetTerm: Term): Question {
    const options = this.gengenerateOptions(targetTerm, terms)
    return {
      id: this.generateId("multipleChoice"),
      type: "multipleChoice",
      definition: targetTerm.definition,
      options,
      correctAnswer: targetTerm.term,
    }
  }
  generate(terms: Term[], count: number): Question[] {
    const questions: Question[] = []
    const subset = this.getTermsSubset(terms, count)
    subset.forEach((term, index) => {
      const question = this.generateQuestion(terms, term)
      questions.push(question)
    })
    return questions
  }

  gengenerateOptions(term: Term, terms: Term[]): string[] {
    // 3 random terms incorrect options
    const incorrectOptions = terms
      .filter((item) => item.id !== term.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.term)

    return this.shuffle([term.term, ...incorrectOptions])
  }
}

/**
 * Generator for true/false questions
 */
export class TrueFalseGenerator extends BaseQuestionGenerator {
  generateQuestion(terms: Term[], targetTerm: Term): Question {
    const isTrue = Math.random() > 0.5
    let definition = targetTerm.definition
    if (!isTrue) {
      const otherTerm = terms.filter((item) => item.id !== targetTerm.id).sort(() => Math.random() - 0.5)[0]
      definition = otherTerm.definition
    }
    return {
      id: this.generateId("trueFalse"),
      type: "trueFalse",
      term: targetTerm.term,
      definition,
      isTrue,
      correctAnswer: isTrue ? "true" : "false",
    }
  }
  generate(terms: Term[], count: number): Question[] {
    const questions: Question[] = []
    const subset = this.getTermsSubset(terms, count)
    subset.forEach((term) => {
      const question = this.generateQuestion(terms, term)
      questions.push(question)
    })
    return questions
  }
}

/**
 * Generator for term input questions
 */
export class TermInputGenerator extends BaseQuestionGenerator {
  generateQuestion(terms: Term[], targetTerm: Term): Question {
    return {
      id: this.generateId("termInput"),
      type: "termInput",
      definition: targetTerm.definition,
      correctAnswer: targetTerm.term,
    }
  }

  generate(terms: Term[], count: number): Question[] {
    const questions: Question[] = []
    const subset = this.getTermsSubset(terms, count)
    subset.forEach((term, index) => {
      const question = this.generateQuestion(terms, term);
      questions.push(question)
    })
    return questions
  }
}