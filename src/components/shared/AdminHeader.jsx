import { Layout, Dropdown } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, UserOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'

const { Header } = Layout

export const AdminHeader = ({ collapsed, onToggle, portal = 'Admin' }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const menuItems = [
    { key: 'profile', label: 'My Profile', onClick: () => navigate('/account') },
    { key: 'store',   label: 'Back to Store', onClick: () => navigate('/') },
    { type: 'divider' },
    { key: 'logout',  label: <span className="text-red-500">Sign Out</span>, onClick: logout },
  ]

  return (
    <Header
      style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', height: 64, position: 'sticky', top: 0, zIndex: 99 }}
    >
      <button onClick={onToggle} className="p-2 rounded-lg hover:bg-slate-100 transition-colors mr-4 text-slate-600">
        {collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
      </button>

      <span className="text-sm font-medium text-slate-400">{portal} Portal</span>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
          <BellOutlined style={{ fontSize: 18 }} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <button className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-700 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.role}</p>
            </div>
          </button>
        </Dropdown>
      </div>
    </Header>
  )
}
