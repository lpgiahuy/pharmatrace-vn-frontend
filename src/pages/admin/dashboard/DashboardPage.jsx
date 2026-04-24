import { useEffect, useState } from 'react'
import { Table, Alert } from 'antd'
import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { analyticsService } from '@/services/analytics.service'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatCurrency as fc } from '@/utils'

export default function DashboardPage() {
  const [stats, setStats]       = useState(null)
  const [chart, setChart]       = useState([])
  const [topProducts, setTop]   = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsService.getDashboardStats(),
      analyticsService.getRevenueChart(),
      analyticsService.getTopProducts(5),
      analyticsService.getLowStockAlerts(),
    ]).then(([s, c, tp, ls]) => {
      setStats(s); setChart(c); setTop(tp); setLowStock(ls)
    }).finally(() => setLoading(false))
  }, [])

  const productCols = [
    { title: 'Product',  dataIndex: 'name',      key: 'name',      ellipsis: true },
    { title: 'Category', dataIndex: 'category',  key: 'category',  render: v => <span className="text-slate-500 text-xs">{v}</span> },
    { title: 'Sold',     dataIndex: 'soldCount',  key: 'sold',      render: v => <strong>{v?.toLocaleString()}</strong> },
    { title: 'Price',    dataIndex: 'price',      key: 'price',     render: v => formatCurrency(v) },
  ]

  const lowStockCols = [
    { title: 'Product',  dataIndex: 'productName', key: 'name', ellipsis: true },
    { title: 'Location', dataIndex: 'location',    key: 'loc'  },
    { title: 'Qty',      dataIndex: 'quantity',    key: 'qty',  render: v => <Badge color={v < 20 ? 'red' : 'orange'}>{v}</Badge> },
    { title: 'Expiry',   dataIndex: 'expiryDate',  key: 'exp'  },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard loading={loading} title="Total Revenue"   value={stats?.revenue?.value || 0}   change={Number(stats?.revenue?.change || 0)}   trend={stats?.revenue?.trend}   icon={DollarSign}    color="blue"   prefix="₫" />
        <StatCard loading={loading} title="Total Orders"    value={stats?.orders?.value || 0}    change={Number(stats?.orders?.change || 0)}    trend={stats?.orders?.trend}    icon={ShoppingBag}   color="green"  />
        <StatCard loading={loading} title="Total Customers" value={stats?.customers?.value || 0} change={Number(stats?.customers?.change || 0)} trend={stats?.customers?.trend} icon={Users}         color="purple" />
        <StatCard loading={loading} title="Low Stock Items" value={stats?.lowStock?.value || 0}  change={Number(stats?.lowStock?.change || 0)}  trend={stats?.lowStock?.trend}  icon={AlertTriangle} color="orange" />
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0b7de8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0b7de8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#0b7de8" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#0b7de8" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Top Selling Products</h3>
          <Table dataSource={topProducts} columns={productCols} rowKey="id" pagination={false} size="small" loading={loading} />
        </div>
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Low Stock Alerts
          </h3>
          {lowStock.length > 0 && <Alert message={`${lowStock.length} items need restocking`} type="warning" showIcon className="mb-3" />}
          <Table dataSource={lowStock} columns={lowStockCols} rowKey="id" pagination={false} size="small" loading={loading} />
        </div>
      </div>
    </div>
  )
}
