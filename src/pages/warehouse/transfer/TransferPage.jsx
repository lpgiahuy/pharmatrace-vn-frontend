import { useState } from 'react'
import { Form, Input, InputNumber, Select, Button as AButton, Card, Table, Tag } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { warehouseService } from '@/services/warehouse.service'
import { formatDateTime } from '@/utils'
import toast from 'react-hot-toast'

const LOCATIONS = ['A1-01','A1-02','A2-01','A2-02','B1-01','B1-02','B2-01','C1-01','C1-02','D1-01']

export default function TransferPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleTransfer = async (vals) => {
    setLoading(true)
    try {
      const result = await warehouseService.transferStock(vals)
      setHistory(prev => [{ ...result, ...vals, key: Date.now(), transferredAt: new Date().toISOString() }, ...prev])
      toast.success('Transfer initiated successfully')
      form.resetFields()
    } catch { toast.error('Transfer failed') }
    finally { setLoading(false) }
  }

  const cols = [
    { title: 'Product',  dataIndex: 'productName', key: 'product' },
    { title: 'Batch',    dataIndex: 'batchNumber', key: 'batch',   render: v => <span className="font-mono text-xs">{v}</span> },
    { title: 'Qty',      dataIndex: 'quantity',    key: 'qty' },
    { title: 'From',     dataIndex: 'fromLocation',key: 'from',    render: v => <Tag color="orange">{v}</Tag> },
    { title: 'To',       dataIndex: 'toLocation',  key: 'to',      render: v => <Tag color="blue">{v}</Tag> },
    { title: 'Status',   dataIndex: 'status',      key: 'status',  render: v => <Tag color="green">{v}</Tag> },
    { title: 'Time',     dataIndex: 'transferredAt',key: 'time',   render: v => formatDateTime(v) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2"><SwapOutlined /> Warehouse Transfer</h1>
        <p className="text-slate-500 text-sm mt-1">Move stock between warehouse locations</p>
      </div>
      <Card title="New Transfer">
        <Form form={form} layout="vertical" onFinish={handleTransfer}>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Form.Item label="Product Name" name="productName" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Batch Number" name="batchNumber" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="From Location" name="fromLocation" rules={[{ required: true }]}>
              <Select placeholder="Select source" options={LOCATIONS.map(l => ({ value: l, label: l }))} />
            </Form.Item>
            <Form.Item label="To Location" name="toLocation" rules={[{ required: true }]}>
              <Select placeholder="Select destination" options={LOCATIONS.map(l => ({ value: l, label: l }))} />
            </Form.Item>
            <Form.Item label="Reason" name="reason">
              <Input placeholder="Reason for transfer (optional)" />
            </Form.Item>
          </div>
          <AButton type="primary" htmlType="submit" loading={loading} icon={<SwapOutlined />}>Initiate Transfer</AButton>
        </Form>
      </Card>
      {history.length > 0 && (
        <Card title="Transfer History (this session)">
          <Table dataSource={history} columns={cols} rowKey="key" pagination={false} size="small" scroll={{ x: 700 }} />
        </Card>
      )}
    </div>
  )
}
