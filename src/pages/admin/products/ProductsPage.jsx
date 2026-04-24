import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button as AButton, Input, Space, Popconfirm, Tag, Grid } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { productService } from '@/services/product.service'
import { formatCurrency } from '@/utils'
import { StockBadge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const { useBreakpoint } = Grid

export default function AdminProductsPage() {
  const [data, setData]       = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const isMobile = screens.md === false

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await productService.getAllAdmin({ search })
      setData(res.data); setTotal(res.total)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [search])

  const handleDelete = async (id) => {
    try {
      await productService.delete(id)
      toast.success('Product deleted')
      fetchData()
    } catch { toast.error('Delete failed') }
  }

  const columns = [
    { title: 'Product', dataIndex: 'name', key: 'name',
      render: (name, row) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={row.image} alt={name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5" />
          <div className="max-w-[120px] sm:max-w-none">
            <p className="font-medium text-[13px] sm:text-sm text-slate-800 truncate">{name}</p>
            <p className="text-[10px] sm:text-xs text-slate-400">{row.brand}</p>
          </div>
        </div>
      ),
    },
    { title: 'Category', dataIndex: 'category',   key: 'category', responsive: ['md'], render: v => <Tag>{v}</Tag> },
    { title: 'Price',    dataIndex: 'price',       key: 'price',    render: v => <span className="text-[13px] sm:text-sm whitespace-nowrap">{formatCurrency(v)}</span> },
    { title: 'Stock',    dataIndex: 'inStock',     key: 'stock',    responsive: ['sm'], render: (_, row) => <StockBadge quantity={row.inStock ? 100 : 0} /> },
    { title: 'Batch',    dataIndex: 'batchNumber', key: 'batch',    responsive: ['lg'], render: v => <span className="font-mono text-xs">{v}</span> },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_, row) => (
        <Space size="small">
          <AButton size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/products/${row.id}/edit`)} />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(row.id)} okText="Yes" okButtonProps={{ danger: true }}>
            <AButton size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm">{total} total products</p>
        </div>
        <Link to="/admin/products/new">
          <AButton type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">Add Product</AButton>
        </Link>
      </div>

      <div className="card p-4">
        <Input
          placeholder="Search products…"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full sm:max-w-[320px] mb-4"
          allowClear
        />
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ 
            current: page, 
            total, 
            pageSize: 20, 
            onChange: setPage, 
            showTotal: (t) => screens.md ? `${t} total` : null,
            size: isMobile ? 'small' : 'default'
          }}
          size={isMobile ? 'small' : 'middle'}
          scroll={{ x: isMobile ? 500 : 700 }}
        />
      </div>
    </div>
  )
}
