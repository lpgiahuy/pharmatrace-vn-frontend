import apiClient from './apiClient'
import { env } from '@/config/env'
import { STORAGE_KEYS } from '@/constants'

const mockLogin = async (credentials) => {
  await new Promise(r => setTimeout(r, 600))
  const mockUsers = {
    'admin@pharmachain.vn':     { role: 'admin',     name: 'Admin User' },
    'warehouse@pharmachain.vn': { role: 'warehouse', name: 'Warehouse Staff' },
    'customer@test.com':        { role: 'customer',  name: 'Test Customer' },
  }
  const user = mockUsers[credentials.email]
  if (!user || credentials.password !== 'password123') {
    throw new Error('Invalid email or password')
  }
  return {
    accessToken:  'mock_access_token_' + user.role,
    refreshToken: 'mock_refresh_token_' + user.role,
    expiresAt:    Date.now() + 3600000,
    user: { id: 1, email: credentials.email, ...user, avatar: null },
  }
}

export const authService = {
  async login(credentials) {
    if (env.USE_MOCK) return mockLogin(credentials)
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  async register(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      return { message: 'Registration successful. Please verify your email.' }
    }
    const { data } = await apiClient.post('/auth/register', payload)
    return data
  },

  async logout() {
    try {
      if (!env.USE_MOCK) {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        await apiClient.post('/auth/logout', { refreshToken })
      }
    } finally {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
      localStorage.removeItem('pharma_token_expiry')
    }
  },

  async getProfile() {
    if (env.USE_MOCK) {
      const stored = localStorage.getItem(STORAGE_KEYS.USER)
      return stored ? JSON.parse(stored) : null
    }
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  async forgotPassword(email) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { message: 'Reset link sent to your email.' }
    }
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { message: 'Password reset successfully.' }
    }
    const { data } = await apiClient.post('/auth/reset-password', payload)
    return data
  },

  async changePassword(payload) {
    const { data } = await apiClient.put('/auth/change-password', payload)
    return data
  },
}
