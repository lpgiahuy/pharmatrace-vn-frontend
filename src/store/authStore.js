import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth.service'
import { STORAGE_KEYS } from '@/constants'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const result = await authService.login(credentials)
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)
          localStorage.setItem('pharma_token_expiry', result.expiresAt)
          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return result
        } catch (err) {
          set({ error: err.message || 'Login failed', isLoading: false })
          throw err
        }
      },

      logout: async () => {
        try { await authService.logout() } catch {}
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      updateUser: (updates) => set(state => ({ user: { ...state.user, ...updates } })),

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
        set({ accessToken, refreshToken: refreshToken || get().refreshToken })
      },

      hasRole: (roles) => {
        const { user } = get()
        if (!user) return false
        const allowed = Array.isArray(roles) ? roles : [roles]
        return allowed.includes(user.role)
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'pharma-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
