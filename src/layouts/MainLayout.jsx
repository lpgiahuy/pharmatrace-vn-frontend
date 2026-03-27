import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { CartDrawer } from '@/components/shared/CartDrawer'
import { PageLoader } from '@/components/ui/Spinner'

export const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-surface">
    <Header />
    <main className="flex-1">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <CartDrawer />
  </div>
)
