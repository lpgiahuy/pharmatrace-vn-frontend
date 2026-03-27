import { useState } from 'react'
import { Table, Button as AButton, Modal, Form, Input } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { PRODUCT_CATEGORIES } from '@/constants'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const [cats, setCats] = useState(PRODUCT_CATEGORIES)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()

  const openModal = (cat = null) => { setEditing(cat); form.setFieldsValue(cat || {}); setOpen(true) }

  const handleSave = (vals) => {
    if (editing) setCats(c => c.map(x => x.id === editing.id ? { ...x, ...vals } : x))
    else setCats(c => [...c, { id: Date.now(), ...vals }])
    toast.success(editing ? 'Category updated' : 'Category created')
    setOpen(false); form.resetFields()
  }

  const cols = [
    { title: 'Icon',  dataIndex: 'icon', key: 'icon', width: 60 },
    { title: 'Name',  dataIndex: 'name', key: 'name' },
    { title: 'Slug',  dataIndex: 'slug', key: 'slug', render: v => <span className="font-mono text-xs">{v}</span> },
    { title: 'Actions', key: 'actions', render: (_, row) => <AButton size="small" icon={<EditOutlined />} onClick={() => openModal(row)}>Edit</AButton> },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-slate-900">Categories</h1>
        <AButton type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Add Category</AButton>
      </div>
      <div className="card p-4">
        <Table dataSource={cats} columns={cols} rowKey="id" pagination={false} />
      </div>
      <Modal title={editing ? 'Edit Category' : 'New Category'} open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Save">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="Icon (emoji)" name="icon" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
