import { useEffect, useState } from 'react'
import { Table, Select, Tag, Button as AButton, Modal, Tooltip, Descriptions } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { rmaService } from '@/services/order.service'
import { formatDateTime } from '@/utils'
import toast from 'react-hot-toast'

const STATUS_COLORS = { ChoDuyet: 'orange', DaDuyet: 'blue', TuChoi: 'red', DaHoanTien: 'green' }

export default function AdminRmaPage() {
  const [data, setData]       = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRma, setSelectedRma] = useState(null)

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
    { title: 'Order',     dataIndex: 'orderId', key: 'order',  render: v => <a href={`/admin/orders/${v}`} target="_blank" className="text-brand-600 hover:underline">{v}</a> },
    { title: 'Reason',    dataIndex: 'reason',  key: 'reason', ellipsis: true, render: v => <Tooltip title={v} placement="topLeft"><span>{v}</span></Tooltip> },
    { title: 'Date',      dataIndex: 'date',    key: 'date',   render: v => formatDateTime(v) },
    { title: 'Status',    dataIndex: 'status',  key: 'status', render: v => <Tag color={STATUS_COLORS[v] || 'default'}>{v}</Tag> },
    {
      title: 'Actions', key: 'actions', width: 150,
      render: (_, row) => (
        <div className="flex gap-1 items-center">
          <AButton size="small" icon={<EyeOutlined />} onClick={() => { setSelectedRma(row); setDetailOpen(true); }} title="View details" />
          {row.status === 'ChoDuyet' && (
            <>
              <AButton size="small" type="primary" onClick={() => updateStatus(row.id, 'DaDuyet')}>Approve</AButton>
              <AButton size="small" danger onClick={() => updateStatus(row.id, 'TuChoi')}>Reject</AButton>
            </>
          )}
        </div>
      )
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

      <Modal 
        title="RMA Request Details" 
        open={detailOpen} 
        onCancel={() => setDetailOpen(false)} 
        footer={[<AButton key="close" onClick={() => setDetailOpen(false)}>Close</AButton>]}
      >
        {selectedRma && (
          <Descriptions bordered column={1} className="mt-4">
            <Descriptions.Item label="RMA ID">{selectedRma.id}</Descriptions.Item>
            <Descriptions.Item label="Order ID">
               <a href={`/admin/orders/${selectedRma.orderId}`} target="_blank" className="font-mono text-brand-600 hover:underline">#{selectedRma.orderId}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Date">{formatDateTime(selectedRma.date)}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={STATUS_COLORS[selectedRma.status] || 'default'}>{selectedRma.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="Reason">
               <div className="whitespace-pre-wrap">{selectedRma.reason}</div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
