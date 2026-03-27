import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button as AButton, Input, Space, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { productService } from '@/services/product.service'
import { formatCurrency } from '@/utils'
import { StockBadge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const [data, setData]       = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await productService.getAll({ page, limit: 20, search })
      setData(res.data); setTotal(res.total)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page, search])

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
        <div className="flex items-center gap-3">
          <img src={row.image} alt={name} className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5" />
          <div>
            <p className="font-medium text-sm text-slate-800">{name}</p>
            <p className="text-xs text-slate-400">{row.brand}</p>
          </div>
        </div>
      ),
    },
    { title: 'Category', dataIndex: 'category',   key: 'category', render: v => <Tag>{v}</Tag> },
    { title: 'Price',    dataIndex: 'price',       key: 'price',    render: v => formatCurrency(v) },
    { title: 'Stock',    dataIndex: 'inStock',     key: 'stock',    render: (_, row) => <StockBadge quantity={row.inStock ? 100 : 0} /> },
    { title: 'Batch',    dataIndex: 'batchNumber', key: 'batch',    render: v => <span className="font-mono text-xs">{v}</span> },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, row) => (
        <Space>
          <AButton size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/products/${row.id}/edit`)} />
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(row.id)} okText="Delete" okButtonProps={{ danger: true }}>
            <AButton size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-display font-bold text-slate-900">Products</h1><p className="text-slate-500 text-sm">{total} total products</p></div>
        <Link to="/admin/products/new"><AButton type="primary" icon={<PlusOutlined />}>Add Product</AButton></Link>
      </div>
      <div className="card p-4">
        <Input
          placeholder="Search products…"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ maxWidth: 320, marginBottom: 16 }}
          allowClear
        />
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ current: page, total, pageSize: 20, onChange: setPage, showTotal: t => `${t} total` }}
          size="middle"
          scroll={{ x: 700 }}
        />
      </div>
    </div>
  )
}
