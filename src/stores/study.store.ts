import { defineStore } from "pinia";
import ApiService  from "@/plugins/axios";
import { useAuthStore } from "./auth.store";
import type { StudyTime } from "@/types";

export const useStudyStore = defineStore('studyStore', {
  state: () => ({
    
  }),
  actions: {
    async getDailyStudyTime(start: Date, end: Date): Promise<StudyTime[]> {
      const res = await ApiService.get('/study/daily-time', {
        params: {
          start: start.toISOString().slice(0, 10),
          end: end.toISOString().slice(0, 10)
        }
      })
      return res.data;
    },
    async updateDailyStudyTime(durationSeconds: number) {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL
      fetch(baseUrl + '/study/daily-time', {
        method: "POST",
        body: JSON.stringify(durationSeconds),
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${useAuthStore().token}`,
        },
      });
    },
  }
})