import { useAuthStore, useStudyStore } from "@/stores";
import { onMounted } from "vue";

export function useSessionTracker() {

  const authStore = useAuthStore();
  const studyStore = useStudyStore()

  let lastActivityTime = Date.now();
  let startTime: number | null = null;
  let activityCheckInterval: ReturnType<typeof setInterval>;
  let sessionTimeout = 5 * 60 * 1000;

  onMounted(() => {
    if (authStore.isAuthenticated) {
      initSessionTracking();
      window.addEventListener('beforeunload', () => {
        endSession();
        return false;
      })
    }
  })

  function initSessionTracking() {
    startSession();
    
    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);
    window.addEventListener('click', updateLastActivity);
    
    // Mỗi 5 phút kiểm tra
    activityCheckInterval = setInterval(checkActivity, 300000);
  }

  async function startSession() {
    startTime = new Date().getTime();
  }

  function updateLastActivity() {
    lastActivityTime = Date.now();
  }
  
  function checkActivity() {
    const inactiveTime = Date.now() - lastActivityTime;
    if (inactiveTime > sessionTimeout) {
      endSession();
    }
  }

  async function endSession() {
    try {
      if (startTime !== null) {
        const endTime = new Date().getTime();
        const durationInSeconds = Math.round((endTime - startTime) / 1000);
        await studyStore.updateDailyStudyTime(durationInSeconds);
        startTime = null
      }
      
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('beforeunload', endSession);
      clearInterval(activityCheckInterval);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  return {
    initSessionTracking,
    startSession,
    endSession
  }

}