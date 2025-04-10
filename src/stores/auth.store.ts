import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import Cookies from "js-cookie";
import type { AxiosResponse } from "axios";
import type { AuthResponse } from "@/types/auth";

type authStore = {
  token: string,
  email: string,
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    email: '',
    isAuthenticated: false,
  } as authStore),
  actions: {
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
        const {token, ...user} = res.data;
        this.setToken(token);
        localStorage.setItem("user", JSON.stringify(user))
      }
      return res.data;
    },
    async googleLogin(code: string) {
      const res: AxiosResponse<AuthResponse> = await ApiService.post('/oauth2/google-login', {
        code
      })
      if (res.status == 200) {
        const {token, ...user} = res.data;
        this.setToken(token);
        localStorage.setItem("user", JSON.stringify(user))
      }
      return res.data;
    },
    setToken(token: string) {
      try {
        this.token = token
        Cookies.remove('token')
        Cookies.set('token', token, {secure: true, sameSite: 'strict', expires: 30})
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.email = payload.sub
        this.isAuthenticated = true;
      } catch (e) {
        console.error(e);
      }
    },
    removeToken() {
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