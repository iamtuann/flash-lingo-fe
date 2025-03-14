import type { QuestionType } from "@/types";

export const questionTypes: {type: QuestionType, label: string, description: string}[] = [
  {
    type: "multipleChoice",
    label: "Multiple Choice",
    description: "Choose the correct term for a given definition from 4 options",
  },
  {
    type: "termInput",
    label: "Term Input",
    description: "Type the correct term for a given definition",
  },
  {
    type: "trueFalse",
    label: "True/False",
    description: "Determine if a term matches its definition",
  },
]