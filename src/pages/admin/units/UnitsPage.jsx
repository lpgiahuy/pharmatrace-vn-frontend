import { useEffect, useState } from 'react'
import { Table, Button as AButton, Modal, Form, Input, InputNumber, Select, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { unitService } from '@/services/user.service'
import toast from 'react-hot-toast'

const UNIT_TYPES = [
  { value: 'NhaMay',        label: 'Nhà Máy (Factory)' },
  { value: 'NhaPhanPhoi',   label: 'Nhà Phân Phối (Distributor)' },
  { value: 'NhaThuoc',      label: 'Nhà Thuốc (Pharmacy)' },
]

const TYPE_COLORS = {
  NhaMay:      'purple',
  NhaPhanPhoi: 'blue',
  NhaThuoc:    'green',
}

export default function UnitsPage() {
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchData = () => {
    setLoading(true)
    unitService.getAll().then(setData).finally(() => setLoading(false))
  }
  useEffect(fetchData, [])

  const openModal = (unit = null) => {
    setEditing(unit)
    if (unit) {
      form.setFieldsValue({
        ten_don_vi:  unit.name,
        loai_don_vi: unit.type,
        dia_chi:     unit.address,
        toa_do_lat:  unit.lat,
        toa_do_lng:  unit.lng,
      })
    } else {
      form.resetFields()
    }
    setOpen(true)
  }

  const handleSave = async (vals) => {
    setSaving(true)
    try {
      if (editing) await unitService.update(editing.id, vals)
      else         await unitService.create(vals)
      toast.success(editing ? 'Unit updated' : 'Unit created')
      setOpen(false)
      fetchData()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await unitService.delete(id); toast.success('Unit deleted'); fetchData() }
    catch { toast.error('Delete failed') }
  }

  const cols = [
    {
      title: 'Unit Name',
      dataIndex: 'name',
      key: 'name',
      render: (v, row) => (
        <div>
          <p className="font-medium text-slate-800">{v}</p>
          {row.address && <p className="text-xs text-slate-400">{row.address}</p>}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: v => <Tag color={TYPE_COLORS[v] || 'default'}>{UNIT_TYPES.find(t => t.value === v)?.label || v}</Tag>,
    },
    {
      title: 'Coordinates',
      key: 'coords',
      render: (_, row) => row.lat && row.lng
        ? (
          <a
            href={`https://maps.google.com/?q=${row.lat},${row.lng}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-brand-600 flex items-center gap-1 hover:underline"
          >
            <EnvironmentOutlined />
            {Number(row.lat).toFixed(5)}, {Number(row.lng).toFixed(5)}
          </a>
        )
        : <span className="text-slate-400 text-xs italic">Not set</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, row) => (
        <div className="flex gap-1">
          <AButton size="small" icon={<EditOutlined />} onClick={() => openModal(row)} />
          <Popconfirm title="Delete unit?" onConfirm={() => handleDelete(row.id)} okText="Delete" okButtonProps={{ danger: true }}>
            <AButton size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Units & Locations</h1>
          <p className="text-slate-500 text-sm">Manage factories, distributors, and pharmacies</p>
        </div>
        <AButton type="primary" icon={<PlusOutlined />} onClick={() => openModal()} size="large">Add Unit</AButton>
      </div>

      <div className="card p-4">
        <Table dataSource={data} columns={cols} rowKey="id" loading={loading} pagination={{ pageSize: 15 }} size="middle" />
      </div>

      <Modal
        title={editing ? 'Edit Unit' : 'New Unit'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
        confirmLoading={saving}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item label="Unit Name (Tên đơn vị)" name="ten_don_vi" rules={[{ required: true, message: 'Enter unit name' }]}>
            <Input placeholder="e.g. Nhà máy Dược Hậu Giang" />
          </Form.Item>

          <Form.Item label="Type (Loại đơn vị)" name="loai_don_vi" rules={[{ required: true, message: 'Select type' }]}>
            <Select options={UNIT_TYPES} placeholder="Select unit type" />
          </Form.Item>

          <Form.Item label="Address (Địa chỉ)" name="dia_chi">
            <Input.TextArea rows={2} placeholder="e.g. 288 Bis Nguyễn Văn Cừ, Quận 5, TP.HCM" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Latitude (Vĩ độ)"
              name="toa_do_lat"
              rules={[{
                validator: (_, v) => (!v || (v >= -90 && v <= 90)) ? Promise.resolve() : Promise.reject('Must be -90 to 90')
              }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.00001} placeholder="e.g. 10.76269" />
            </Form.Item>
            <Form.Item
              label="Longitude (Kinh độ)"
              name="toa_do_lng"
              rules={[{
                validator: (_, v) => (!v || (v >= -180 && v <= 180)) ? Promise.resolve() : Promise.reject('Must be -180 to 180')
              }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.00001} placeholder="e.g. 106.68278" />
            </Form.Item>
          </div>
          <p className="text-xs text-slate-400 -mt-2">GPS coordinates are required for pharmacy nearest-search feature.</p>
        </Form>
      </Modal>
    </div>
  )
}
