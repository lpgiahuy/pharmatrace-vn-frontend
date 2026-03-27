import axios from 'axios'
import toast from 'react-hot-toast'
import { env } from '@/config/env'
import { STORAGE_KEYS } from '@/constants'
import { isTokenExpired } from '@/utils'

const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token))
  failedQueue = []
}

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (!accessToken) return config

    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const shouldRefresh =
      refreshToken &&
      isTokenExpired(accessToken) === false &&
      Date.now() > (Number(localStorage.getItem('pharma_token_expiry')) - env.REFRESH_TOKEN_THRESHOLD)

    if (shouldRefresh && !isRefreshing) {
      isRefreshing = true
      try {
        const { data } = await axios.post(`${env.API_BASE_URL}/auth/refresh`, { refreshToken })
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
        localStorage.setItem('pharma_token_expiry', data.expiresAt)
        config.headers.Authorization = `Bearer ${data.accessToken}`
        processQueue(null, data.accessToken)
      } catch (err) {
        processQueue(err, null)
        _logout()
      } finally {
        isRefreshing = false
      }
    } else if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (!refreshToken) { _logout(); return Promise.reject(error) }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${env.API_BASE_URL}/auth/refresh`, { refreshToken })
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
        localStorage.setItem('pharma_token_expiry', data.expiresAt)
        processQueue(null, data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(original)
      } catch (err) {
        processQueue(err, null)
        _logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    }

    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    if (!error.response) {
      toast.error('Network error. Please check your connection.')
    }

    return Promise.reject(error)
  }
)

const _logout = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  localStorage.removeItem('pharma_token_expiry')
  window.location.href = '/login'
}

export default apiClient
