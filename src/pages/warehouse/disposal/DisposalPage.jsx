import { useState } from 'react'
import { Form, Input, InputNumber, Select, Button as AButton, Card, Alert, Table, Tag } from 'antd'
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import { warehouseService } from '@/services/warehouse.service'
import { formatDateTime } from '@/utils'
import toast from 'react-hot-toast'

const DISPOSAL_REASONS = ['Expired', 'Damaged', 'Contaminated', 'Recalled', 'Overstocked', 'Quality Failure']

export default function DisposalPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleDispose = async (vals) => {
    setLoading(true)
    try {
      const result = await warehouseService.disposeStock(vals)
      setHistory(prev => [{ ...result, ...vals, key: Date.now(), disposedAt: new Date().toISOString() }, ...prev])
      toast.success('Disposal recorded successfully')
      form.resetFields()
    } catch { toast.error('Disposal failed') }
    finally { setLoading(false) }
  }

  const cols = [
    { title: 'Product',    dataIndex: 'productName', key: 'product' },
    { title: 'Batch',      dataIndex: 'batchNumber', key: 'batch',  render: v => <span className="font-mono text-xs">{v}</span> },
    { title: 'Qty',        dataIndex: 'quantity',    key: 'qty' },
    { title: 'Reason',     dataIndex: 'reason',      key: 'reason', render: v => <Tag color="red">{v}</Tag> },
    { title: 'Method',     dataIndex: 'method',      key: 'method' },
    { title: 'Disposed By',dataIndex: 'disposedBy',  key: 'by' },
    { title: 'Time',       dataIndex: 'disposedAt',  key: 'time',   render: v => formatDateTime(v) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2"><DeleteOutlined /> Disposal & Returns</h1>
        <p className="text-slate-500 text-sm mt-1">Record expired, damaged, or recalled stock disposal</p>
      </div>

      <Alert
        message="Disposal is permanent and cannot be undone"
        description="Ensure you have supervisor approval before disposing pharmaceutical stock. All disposals are logged for audit."
        type="warning"
        showIcon
        icon={<WarningOutlined />}
      />

      <Card title="Record Disposal">
        <Form form={form} layout="vertical" onFinish={handleDispose}>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Form.Item label="Product Name" name="productName" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Batch Number" name="batchNumber" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Quantity to Dispose" name="quantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
              <Select options={DISPOSAL_REASONS.map(r => ({ value: r, label: r }))} placeholder="Select reason" />
            </Form.Item>
            <Form.Item label="Disposal Method" name="method" rules={[{ required: true }]}>
              <Select options={['Incineration','Landfill','Chemical Neutralization','Return to Supplier'].map(m => ({ value: m, label: m }))} />
            </Form.Item>
            <Form.Item label="Disposed By" name="disposedBy" rules={[{ required: true }]}><Input placeholder="Staff name" /></Form.Item>
            <Form.Item label="Notes" name="notes" className="sm:col-span-2">
              <Input.TextArea rows={2} placeholder="Additional notes…" />
            </Form.Item>
          </div>
          <AButton type="primary" danger htmlType="submit" loading={loading} icon={<DeleteOutlined />}>Record Disposal</AButton>
        </Form>
      </Card>

      {history.length > 0 && (
        <Card title="Disposal Log (this session)">
          <Table dataSource={history} columns={cols} rowKey="key" pagination={false} size="small" scroll={{ x: 700 }} />
        </Card>
      )}
    </div>
  )
}
