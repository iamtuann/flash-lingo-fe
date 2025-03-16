import type { QuestionType } from "@/types";

export const questionTypes: {type: QuestionType, label: string, questionTitle?: string, description: string}[] = [
  {
    type: "multipleChoice",
    label: "Multiple Choice",
    questionTitle: "Which term matches this definition?",
    description: "Choose the correct term for a given definition from 4 options",
  },
  {
    type: "termInput",
    label: "Term Input",
    questionTitle: "Enter the term for this definition",
    description: "Type the correct term for a given definition",
  },
  {
    type: "trueFalse",
    label: "True/False",
    questionTitle: "Is this definition correct for the term?",
    description: "Determine if a term matches its definition",
  },
]