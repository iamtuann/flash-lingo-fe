import { defineStore } from "pinia";
import type {Question, TestResult, TestState} from '@/types';

export interface testStore {
  questions: Question[],
  testState: TestState | null,
  testResult: TestResult | null
}

export const useTestStore = defineStore('testStore', {
  state: () => ({
    questions: [],
    testState: null,
    testResult: null
  } as testStore),
  actions: {
    haveResult() {
      return this.questions.length > 0 && this.testState != null && this.testResult != null
    }
  }
})