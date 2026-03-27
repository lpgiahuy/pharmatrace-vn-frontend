import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined, ShoppingOutlined, AppstoreOutlined,
  OrderedListOutlined, TeamOutlined, TagOutlined, FileTextOutlined,
  SwapOutlined, AlertOutlined
} from '@ant-design/icons'
import { Pill as PillIcon } from 'lucide-react'

const { Sider } = Layout

const menuItems = [
  { key: '/admin',           icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
  {
    key: 'products-group', icon: <ShoppingOutlined />, label: 'Products',
    children: [
      { key: '/admin/products',    label: <Link to="/admin/products">All Products</Link> },
      { key: '/admin/categories',  label: <Link to="/admin/categories">Categories</Link> },
    ],
  },
  {
    key: 'orders-group', icon: <OrderedListOutlined />, label: 'Orders & RMA',
    children: [
      { key: '/admin/orders', label: <Link to="/admin/orders">Orders</Link> },
      { key: '/admin/rma',    label: <Link to="/admin/rma">RMA Requests</Link> },
    ],
  },
  { key: '/admin/vouchers', icon: <TagOutlined />,         label: <Link to="/admin/vouchers">Vouchers</Link> },
  { key: '/admin/blog',     icon: <FileTextOutlined />,    label: <Link to="/admin/blog">Blog / News</Link> },
  { key: '/admin/staff',    icon: <TeamOutlined />,        label: <Link to="/admin/staff">Staff & RBAC</Link> },
]

export const AdminSidebar = ({ collapsed, onCollapse }) => {
  const { pathname } = useLocation()

  const selectedKeys = [pathname]
  const openKeys = menuItems
    .filter(item => item.children?.some(c => c.key === pathname))
    .map(item => item.key)

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      collapsedWidth={80}
      style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100, boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}
      theme="light"
    >
      <div className={`flex items-center gap-2.5 px-4 h-16 border-b border-slate-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <PillIcon className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="font-display font-bold text-brand-600 text-base">PharmaChain</span>}
      </div>
      {!collapsed && (
        <div className="px-4 py-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Portal</span>
        </div>
      )}
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        items={menuItems}
        style={{ border: 'none', padding: '0 8px' }}
      />
    </Sider>
  )
}
