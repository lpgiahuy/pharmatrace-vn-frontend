import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Select, Button as AButton, Descriptions, Timeline, Tag, Modal, Form, Typography } from 'antd'
import { ArrowLeftOutlined, ScanOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import { orderService } from '@/services/order.service'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { formatCurrency, formatDateTime } from '@/utils'
import { ORDER_STATUS } from '@/constants'
import toast from 'react-hot-toast'

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fulfillOpen, setFulfillOpen] = useState(false)
  const [fulfilling, setFulfilling] = useState(false)
  const [fulfillForm] = Form.useForm()

  useEffect(() => {
    orderService.getAdminById(id).then(setOrder).finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await orderService.updateStatus(id, newStatus)
      setOrder(o => ({ ...o, status: newStatus }))
      toast.success('Order status updated')
    } catch { toast.error('Failed to update status') }
    finally { setUpdating(false) }
  }

  const handleFulfill = async (vals) => {
    if (!vals.uids || vals.uids.length === 0) return toast.error('Please scan at least one UID')
    setFulfilling(true)
    try {
      await orderService.fulfillOrder(id, vals.uids)
      toast.success('Order fulfilled successfully!')
      setFulfillOpen(false)
      // Refetch or update status locally
      setOrder(o => ({ ...o, status: ORDER_STATUS.DangGiao || 'DangGiao' }))
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to fulfill order') }
    finally { setFulfilling(false) }
  }

  if (loading) return <PageLoader />
  if (!order)  return <div className="text-slate-500 py-16 text-center">Order not found.</div>

  return (
    <div className="max-w-3xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AButton icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/orders')}>Back</AButton>
          <h1 className="text-xl font-display font-bold text-slate-900">Order <span className="font-mono">{order.id}</span></h1>
        </div>
        {(order.status === 'ChoXacNhan' || order.status === 'DaĐongGoi') && (
          <AButton type="primary" icon={<ScanOutlined />} onClick={() => setFulfillOpen(true)}>
            Fulfill & Pack Order
          </AButton>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500">{formatDateTime(order.date)}</p>
            <div className="mt-1"><OrderStatusBadge status={order.status} /></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Update status:</span>
            <Select
              value={order.status}
              onChange={handleStatusUpdate}
              loading={updating}
              style={{ width: 160 }}
              options={Object.values(ORDER_STATUS).map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
            />
          </div>
        </div>

        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Payment">{order.paymentMethod?.toUpperCase()}</Descriptions.Item>
          <Descriptions.Item label="Total"><strong>{formatCurrency(order.total)}</strong></Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{order.address}</Descriptions.Item>
        </Descriptions>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Order Items</h3>
        <div className="space-y-3">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-surface-border last:border-0">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xl shrink-0">💊</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">Quantity: {item.quantity}</p>
              </div>
              <span className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        title={<><ScanOutlined className="mr-2 text-brand-600"/> Fulfill Order #{order.id}</>}
        open={fulfillOpen} 
        onCancel={() => setFulfillOpen(false)}
        onOk={() => fulfillForm.submit()}
        confirmLoading={fulfilling}
        okText="Confirm & Pack"
        destroyOnClose
      >
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
          Scan the QR/Barcodes of the medicine boxes being packed for this order. 
          Use a barcode scanner or type and press Enter for each UID.
        </div>
        <Form form={fulfillForm} layout="vertical" onFinish={handleFulfill}>
          <Form.Item label="Scanned Product UIDs" name="uids" rules={[{ required: true, message: 'Please provide at least one UID' }]}>
            <Select 
              mode="tags" 
              style={{ width: '100%' }} 
              placeholder="Scan barcodes here..." 
              open={false} // Prevents dropdown from opening
              tokenSeparators={[',', ' ']} // Allows pasting multiple
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
