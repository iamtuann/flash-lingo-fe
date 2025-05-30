import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import Cookies from "js-cookie";
import type { AxiosResponse } from "axios";
import type { AuthResponse, User, UserRequest } from "@/types/auth";
import { useSessionTracker } from "@/composable";

type authStore = {
  token: string,
  email: string,
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    email: '',
    user: null,
    isAuthenticated: false,
  } as authStore),
  actions: {
    async getProfile(): Promise<User> {
      if (this.user) {
        return this.user;
      }
      const res = await ApiService.get('/auth/profile')
      if (res.status === 200) {
        this.user = res.data
      }
      return res.data;
    },
    async updateProfile(request: UserRequest): Promise<User> {
      const res = await ApiService.put('/auth/profile', request)
      if (res.status === 200) {
        this.user = res.data
      }
      return res.data;
    },
    async changePassword(currentPassword: string, newPassword: string): Promise<string> {
      const res = await ApiService.post('/auth/change-password', {
        currentPassword, newPassword
      })
      return res.data;
    },
    async register(email: string, password: string, firstName: string, lastName: string) {
      const res = await ApiService.post('/auth/register', {
        email,
        password,
        firstName,
        lastName
      })
      return res;
    },
    async login(email: string, password: string) {
      const res: AxiosResponse<AuthResponse> = await ApiService.post('/auth/login', {
        email,
        password
      })
      if (res.status == 200) {
        this.user = null
        const {token} = res.data;
        this.setToken(token);
        // localStorage.setItem("user", JSON.stringify(user))
        this.getProfile()
        useSessionTracker().initSessionTracking()
      }
      return res.data;
    },
    async googleLogin(code: string) {
      const res: AxiosResponse<AuthResponse> = await ApiService.post('/oauth2/google-login', {
        code
      })
      if (res.status == 200) {
        this.user = null
        const {token} = res.data;
        this.setToken(token);
        this.getProfile()
        useSessionTracker().initSessionTracking()
      }
      return res.data;
    },
    async googleRegister(code: string) {
      const res: AxiosResponse<AuthResponse> = await ApiService.post('/oauth2/google-register', {
        code
      })
      if (res.status == 200) {
        const {token} = res.data;
        this.setToken(token);
        useSessionTracker().initSessionTracking()
      }
      return res.data;
    },
    async logout() {
      this.removeToken()
      this.user = null
    },
    setToken(token: string) {
      try {
        this.token = token
        Cookies.remove('token')
        Cookies.set('token', token, {path: '/', secure: false, sameSite: 'lax', expires: 30})
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.email = payload.sub
        this.isAuthenticated = true;
      } catch (e) {
        console.error(e);
      }
    },
    removeToken() {
      this.isAuthenticated = false,
      this.token = '',
      this.email = '',
      Cookies.remove('token')
    },
    isTokenExpired(token:string) {
      // !!token ? token : this.token;
      if (!token) {
        return true;
      } else {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          return !payload.exp || payload.exp < currentTime;
        } catch (error) {
          return true;
        }
      }
    },
    checkToken() {

    },
    loadTokenFromCookies() {
      const token = Cookies.get('token') || ''
      if (this.isTokenExpired(token)) {
        this.removeToken();
      } else {
        this.setToken(token);
      }
    }
  }
})