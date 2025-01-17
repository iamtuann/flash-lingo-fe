import { defineStore } from "pinia";
import ApiService from '@/plugins/axios';
import Cookies from "js-cookie";

type authStore = {
  token: string,
  username: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    username: '',
  } as authStore),
  actions: {
    async login(username: string, password: string) {
      const res = await ApiService.post('/login', {
        username,
        password
      })
      if (res.status === 200) {
        
      }
    },
    setToken(token: string) {
      try {
        this.token = token
        Cookies.set('token', token, {secure: true, sameSite: 'strict', expires: 30})
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.username = payload.sub
      } catch (e) {
        console.error(e);
      }
    },
    removeToken() {
      this.token = '',
      this.username = '',
      Cookies.remove('token')
    },
    isTokenExpired(token:string) {
      !!token ? token : this.token;
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