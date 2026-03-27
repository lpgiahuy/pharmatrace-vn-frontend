import { useEffect } from 'react'
import { AppRoutes } from '@/routes'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Spinner } from '@/components/ui/Spinner'
import { authService } from '@/services/auth.service'

export default function App() {
  const { isAuthenticated, updateUser, logout } = useAuthStore()
  const { globalLoading } = useUIStore()

  useEffect(() => {
    if (!isAuthenticated) return
    authService.getProfile()
      .then(user => { if (user) updateUser(user) })
      .catch(() => logout())
  }, [])

  return (
    <>
      {globalLoading && <Spinner fullScreen />}
      <AppRoutes />
    </>
  )
}
