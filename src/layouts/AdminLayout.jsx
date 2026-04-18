import { Outlet } from 'react-router-dom'
import { Suspense, useState } from 'react'
import { Layout } from 'antd'
import { AdminSidebar } from '@/components/shared/AdminSidebar'
import { AdminHeader } from '@/components/shared/AdminHeader'
import { PageLoader } from '@/components/ui/Spinner'
import { useUIStore } from '@/store/uiStore'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const { Content } = Layout

export const AdminLayout = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <Layout className="min-h-screen">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapse={toggleSidebar} />
      <Layout className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-20' : 'ml-60'}`}>
        <AdminHeader collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Content className="p-6 min-h-[calc(100vh-64px)]">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  )
}
