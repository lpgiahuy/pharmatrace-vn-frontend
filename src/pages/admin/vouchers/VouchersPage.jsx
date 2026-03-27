import { useEffect, useState } from 'react'
import { Table, Button as AButton, Modal, Form, Input, InputNumber, Select, Switch, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { voucherService } from '@/services/analytics.service'
import { formatCurrency } from '@/utils'
import toast from 'react-hot-toast'

export default function VouchersPage() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [form] = Form.useForm()

  const fetchData = () => {
    setLoading(true)
    voucherService.getAll().then(r => setData(r.data)).finally(() => setLoading(false))
  }
  useEffect(fetchData, [])

  const openModal = (v = null) => { setEditing(v); form.setFieldsValue(v || { status: 'active', type: 'percent' }); setOpen(true) }

  const handleSave = async (vals) => {
    setSaving(true)
    try {
      if (editing) await voucherService.update(editing.id, vals)
      else         await voucherService.create(vals)
      toast.success(editing ? 'Voucher updated' : 'Voucher created')
      setOpen(false); fetchData()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await voucherService.delete(id); toast.success('Voucher deleted'); fetchData() }
    catch { toast.error('Delete failed') }
  }

  const cols = [
    { title: 'Code',      dataIndex: 'code',       key: 'code',  render: v => <span className="font-mono font-bold text-brand-600">{v}</span> },
    { title: 'Type',      dataIndex: 'type',       key: 'type',  render: v => <Tag>{v}</Tag> },
    { title: 'Value',     key: 'value', render: (_, r) => r.type === 'percent' ? `${r.value}%` : formatCurrency(r.value) },
    { title: 'Min Order', dataIndex: 'minOrder',   key: 'min',   render: v => formatCurrency(v) },
    { title: 'Usage',     key: 'usage',  render: (_, r) => `${r.usedCount}/${r.usageLimit}` },
    { title: 'Status',    dataIndex: 'status',     key: 'status',render: v => <Tag color={v === 'active' ? 'green' : 'red'}>{v}</Tag> },
    { title: 'Expires',   dataIndex: 'endDate',    key: 'end'  },
    {
      title: '', key: 'actions', width: 100,
      render: (_, row) => (
        <div className="flex gap-1">
          <AButton size="small" icon={<EditOutlined />} onClick={() => openModal(row)} />
          <Popconfirm title="Delete voucher?" onConfirm={() => handleDelete(row.id)} okText="Delete" okButtonProps={{ danger: true }}>
            <AButton size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-display font-bold text-slate-900">Vouchers</h1></div>
        <AButton type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Create Voucher</AButton>
      </div>
      <div className="card p-4">
        <Table dataSource={data} columns={cols} rowKey="id" loading={loading} pagination={false} size="middle" scroll={{ x: 800 }} />
      </div>

      <Modal title={editing ? 'Edit Voucher' : 'New Voucher'} open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Save" confirmLoading={saving}>
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item label="Code" name="code" rules={[{ required: true }]}><Input style={{ textTransform: 'uppercase' }} /></Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select options={[{ value: 'percent', label: 'Percentage (%)' }, { value: 'fixed', label: 'Fixed Amount (₫)' }, { value: 'freeship', label: 'Free Shipping' }]} />
          </Form.Item>
          <Form.Item label="Value" name="value" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Minimum Order (₫)" name="minOrder"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Usage Limit" name="usageLimit"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Start Date" name="startDate"><Input type="date" /></Form.Item>
            <Form.Item label="End Date" name="endDate"><Input type="date" /></Form.Item>
          </div>
          <Form.Item label="Active" name="status" valuePropName="checked" getValueFromEvent={v => v ? 'active' : 'inactive'} getValueProps={v => ({ checked: v === 'active' })}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
