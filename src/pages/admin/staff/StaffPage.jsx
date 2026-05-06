import { useEffect, useState } from 'react'
import { Table, Button as AButton, Modal, Form, Input, Select, Switch, Popconfirm, Tag, InputNumber } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { userService } from '@/services/user.service'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils'
import toast from 'react-hot-toast'

// Roles matching the database CHECK constraint
const ROLES = ['SuperAdmin', 'QuanLyKho', 'NhanVienBanHang']
const ROLE_COLORS = { 
  SuperAdmin: 'red', 
  QuanLyKho: 'purple', 
  NhanVienBanHang: 'blue' 
}

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
    if (user) {
      form.setFieldsValue({
        ho_ten: user.name,
        email: user.email,
        vai_tro: user.role,
        don_vi_id: user.don_vi_id,
        trang_thai: user.status === 'active'
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ trang_thai: true, vai_tro: 'NhanVienBanHang' })
    }
    setOpen(true)
  }

  const handleSave = async (vals) => {
    setSaving(true)
    try {
      const payload = {
        ho_ten: vals.ho_ten,
        email: vals.email,
        vai_tro: vals.vai_tro,
        don_vi_id: vals.don_vi_id,
        trang_thai: vals.trang_thai,
        password: vals.password // Only for new staff
      }
      
      if (editing) await userService.update(editing.id, payload)
      else         await userService.create(payload)
      
      toast.success(editing ? 'Staff member updated' : 'Staff member created')
      setOpen(false); fetchData()
    } catch { toast.error('Save operation failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await userService.delete(id); toast.success('Staff removed'); fetchData() }
    catch { toast.error('Delete operation failed') }
  }

  const cols = [
    {
      title: 'Staff Member', 
      key: 'name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-sm text-slate-800">{row.name}</p>
            <p className="text-[10px] font-mono text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { 
      title: 'Role',    
      dataIndex: 'role',      
      key: 'role',   
      render: v => <Tag color={ROLE_COLORS[v] || 'default'} className="rounded-full px-3">{v}</Tag> 
    },
    { 
      title: 'Unit ID', 
      dataIndex: 'don_vi_id', 
      key: 'unit',
      render: v => <Tag color="blue">Unit #{v}</Tag>
    },
    { 
      title: 'Status',  
      dataIndex: 'status',    
      key: 'status', 
      render: v => (
        <Badge status={v === 'active' ? 'success' : 'error'} text={v === 'active' ? 'Active' : 'Disabled'} />
      ) 
    },
    { 
      title: 'Joined Date',  
      dataIndex: 'createdAt', 
      key: 'joined', 
      render: v => <span className="text-xs text-slate-500">{formatDate(v)}</span> 
    },
    {
      title: '', 
      key: 'actions', 
      width: 90,
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

  // Custom Badge for status since Ant Design Table render can be tricky
  const Badge = ({ status, text }) => (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
      <span className="text-xs font-medium text-slate-600">{text}</span>
    </div>
  )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Staff & Permissions</h1>
          <p className="text-slate-500 text-sm">Manage enterprise users and Role-Based Access Control</p>
        </div>
        <AButton type="primary" icon={<PlusOutlined />} onClick={() => openModal()} size="large">Add Staff Member</AButton>
      </div>
      <div className="card p-4">
        <Table dataSource={data} columns={cols} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="middle" />
      </div>

      <Modal 
        title={editing ? 'Edit Staff Member' : 'Create New Staff Member'} 
        open={open} 
        onCancel={() => setOpen(false)} 
        onOk={() => form.submit()} 
        okText="Save Member" 
        confirmLoading={saving}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Full Name" name="ho_ten" rules={[{ required: true, message: 'Please enter name' }]}>
              <Input placeholder="E.g. Nguyen Van A" />
            </Form.Item>
            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input placeholder="name@pharmatrace.vn" />
            </Form.Item>
          </div>

          {!editing && (
            <Form.Item label="Temporary Password" name="password" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="Min 6 characters" />
            </Form.Item>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="System Role" name="vai_tro" rules={[{ required: true }]}>
              <Select options={ROLES.map(r => ({ value: r, label: r }))} />
            </Form.Item>
            <Form.Item label="Assigned Unit ID" name="don_vi_id" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} placeholder="E.g. 1 (Factory ID)" />
            </Form.Item>
          </div>

          <Form.Item label="Account Enabled" name="trang_thai" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
