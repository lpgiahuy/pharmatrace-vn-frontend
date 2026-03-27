import { useEffect, useState } from 'react'
import { Table, Select, Tag, Button as AButton, Modal } from 'antd'
import { rmaService } from '@/services/order.service'
import { formatDateTime } from '@/utils'
import toast from 'react-hot-toast'

const STATUS_COLORS = { pending: 'orange', approved: 'blue', rejected: 'red', completed: 'green' }

export default function AdminRmaPage() {
  const [data, setData]       = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)

  useEffect(() => {
    setLoading(true)
    rmaService.getAll({ page }).then(r => { setData(r.data); setTotal(r.total) }).finally(() => setLoading(false))
  }, [page])

  const updateStatus = async (id, status) => {
    try {
      await rmaService.updateStatus(id, status)
      setData(d => d.map(r => r.id === id ? { ...r, status } : r))
      toast.success('RMA status updated')
    } catch { toast.error('Update failed') }
  }

  const cols = [
    { title: 'RMA ID',    dataIndex: 'id',      key: 'id',     render: v => <span className="font-mono text-xs">{v}</span> },
    { title: 'Order',     dataIndex: 'orderId', key: 'order',  render: v => <span className="font-mono text-xs">{v}</span> },
    { title: 'Reason',    dataIndex: 'reason',  key: 'reason', ellipsis: true },
    { title: 'Date',      dataIndex: 'date',    key: 'date',   render: v => formatDateTime(v) },
    { title: 'Status',    dataIndex: 'status',  key: 'status', render: v => <Tag color={STATUS_COLORS[v] || 'default'}>{v}</Tag> },
    {
      title: 'Actions', key: 'actions',
      render: (_, row) => row.status === 'pending' ? (
        <div className="flex gap-1">
          <AButton size="small" type="primary" onClick={() => updateStatus(row.id, 'approved')}>Approve</AButton>
          <AButton size="small" danger onClick={() => updateStatus(row.id, 'rejected')}>Reject</AButton>
        </div>
      ) : null,
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div><h1 className="text-xl font-display font-bold text-slate-900">RMA Requests</h1><p className="text-slate-500 text-sm">{total} total requests</p></div>
      <div className="card p-4">
        <Table dataSource={data} columns={cols} rowKey="id" loading={loading}
          pagination={{ current: page, total, pageSize: 20, onChange: setPage }}
          locale={{ emptyText: 'No RMA requests found' }}
          size="middle"
        />
      </div>
    </div>
  )
}
