import { useEffect, useState } from 'react'
import { Table, Button as AButton, Modal, Form, Input, Select, Switch, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { userService } from '@/services/user.service'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils'
import toast from 'react-hot-toast'

const ROLES = ['admin', 'manager', 'warehouse', 'pharmacist', 'staff']
const ROLE_COLORS = { admin: 'red', manager: 'purple', warehouse: 'cyan', pharmacist: 'blue', staff: 'default' }

export default function StaffPage() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [form] = Form.useForm()

  const fetchData = () => {
    setLoading(true)
    userService.getAll().then(r => setData(r.data)).finally(() => setLoading(false))
  }
  useEffect(fetchData, [])

  const openModal = (user = null) => {
    setEditing(user)
    form.setFieldsValue(user ? { ...user, status: user.status === 'active' } : { status: true })
    setOpen(true)
  }

  const handleSave = async (vals) => {
    setSaving(true)
    try {
      const payload = { ...vals, status: vals.status ? 'active' : 'inactive' }
      if (editing) await userService.update(editing.id, payload)
      else         await userService.create(payload)
      toast.success(editing ? 'Staff updated' : 'Staff created')
      setOpen(false); fetchData()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await userService.delete(id); toast.success('Staff removed'); fetchData() }
    catch { toast.error('Delete failed') }
  }

  const cols = [
    {
      title: 'Staff Member', key: 'name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { title: 'Role',    dataIndex: 'role',      key: 'role',   render: v => <Tag color={ROLE_COLORS[v]}>{v}</Tag> },
    { title: 'Status',  dataIndex: 'status',    key: 'status', render: v => <Tag color={v === 'active' ? 'green' : 'red'}>{v}</Tag> },
    { title: 'Joined',  dataIndex: 'createdAt', key: 'joined', render: v => formatDate(v) },
    {
      title: '', key: 'actions', width: 90,
      render: (_, row) => (
        <div className="flex gap-1">
          <AButton size="small" icon={<EditOutlined />} onClick={() => openModal(row)} />
          <Popconfirm title="Remove staff member?" onConfirm={() => handleDelete(row.id)} okText="Remove" okButtonProps={{ danger: true }}>
            <AButton size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-display font-bold text-slate-900">Staff & RBAC</h1><p className="text-slate-500 text-sm">Manage team members and their permissions</p></div>
        <AButton type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Add Staff</AButton>
      </div>
      <div className="card p-4">
        <Table dataSource={data} columns={cols} rowKey="id" loading={loading} pagination={false} size="middle" />
      </div>

      <Modal title={editing ? 'Edit Staff Member' : 'Add Staff Member'} open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Save" confirmLoading={saving}>
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          {!editing && <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}><Input.Password /></Form.Item>}
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select options={ROLES.map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))} />
          </Form.Item>
          <Form.Item label="Active" name="status" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
