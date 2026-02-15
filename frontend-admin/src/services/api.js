import axios from 'axios'
import { clearToken, getToken } from '../utils/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://phd-backend-tkru.onrender.com/api',
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken()
      window.location.replace('/login')
    }

    return Promise.reject(error)
  },
)

export default api