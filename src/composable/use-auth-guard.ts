import {useAuthStore} from "@/stores";
import { inject, provide, ref, type InjectionKey, type Ref } from "vue";

export interface AuthContext {
  showLoginDialog: Ref<boolean>
  requireAuth: <T extends (...args: any[]) => any>(callback?: T) => boolean
  closeLoginDialog: () => void
}
const authKey = Symbol('auth-guard') as InjectionKey<AuthContext>

export function createAuthGuard() {
  const authStore = useAuthStore();
  
  const showLoginDialog = ref(false)

  const requireAuth = <T extends (...args: any[]) => any>(callback?: T): boolean => {
    if (authStore.isAuthenticated) {
      if (typeof callback === 'function') {
        callback()
      }
      return true
    } else {
      showLoginDialog.value = true
      return false
    }
  }

  const closeLoginDialog = () => {
    showLoginDialog.value = false
  }

  const auth: AuthContext = {
    showLoginDialog,
    requireAuth,
    closeLoginDialog
  }

  provide(authKey, auth)
  
  return auth
}

export function useAuthGuard(): AuthContext {
  const auth = inject<AuthContext>(authKey)
  if (!auth) {
    throw new Error('useAuthGuard() phải được sử dụng trong phạm vi của createAuthGuard()')
  }
  return auth
}