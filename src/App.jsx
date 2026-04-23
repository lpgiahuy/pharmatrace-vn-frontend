import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AppRoutes } from '@/routes'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Spinner } from '@/components/ui/Spinner'
import { authService } from '@/services/auth.service'

export default function App() {
  const { isAuthenticated, updateUser, logout } = useAuthStore()
  const { globalLoading } = useUIStore()
  const { pathname } = useLocation()

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!isAuthenticated) return
    authService.getProfile()
      .then(user => { if (user) updateUser(user) })
      .catch((err) => {
        // Only force logout if the token is definitely invalid (401)
        // If the endpoint is missing (404), keep using the state from localStorage
        if (err.response?.status === 401) {
          logout()
        }
      })
  }, [])

  return (
    <>
      {globalLoading && <Spinner fullScreen />}
      <AppRoutes />
    </>
  )
}

