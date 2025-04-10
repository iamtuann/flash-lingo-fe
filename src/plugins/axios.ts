import axios from "axios";
import Cookies from "js-cookie";
import router from "@/router";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
})

instance.interceptors.request.use(
  (config) => {
  let token = Cookies.get('token')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config

}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || null
    if (status == 401) {
      
    } else if (status == 403) {
      router.replace({name: 'AccessDenied'})
    }
    return Promise.reject(error)
  }
)

export default instance;