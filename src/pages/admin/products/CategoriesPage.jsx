import { useState, useEffect } from 'react'
import { Table, Button as AButton, Modal, Form, Input, Popconfirm, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { productService } from '@/services/product.service'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await productService.getCategories()
      setCats(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const openModal = (cat = null) => { setEditing(cat); form.setFieldsValue(cat || {}); setOpen(true) }

  const handleSave = async (vals) => {
    setSaving(true)
    try {
      if (editing) await productService.updateCategory(editing.id || editing._id, vals)
      else         await productService.createCategory(vals)
      toast.success(editing ? 'Category updated' : 'Category created')
      setOpen(false)
      form.resetFields()
      fetchCategories()
    } catch {
      toast.error(editing ? 'Failed to update category' : 'Failed to create category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productService.deleteCategory(id)
      toast.success('Category deleted')
      fetchCategories()
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const cols = [
    { title: 'Icon',  dataIndex: 'icon', key: 'icon', width: 60 },
    { title: 'Name',  dataIndex: 'name', key: 'name' },
    { title: 'Slug',  dataIndex: 'slug', key: 'slug', render: v => <span className="font-mono text-xs">{v}</span> },
    { title: 'Actions', key: 'actions', width: 120, render: (_, row) => (
      <Space>
        <AButton size="small" icon={<EditOutlined />} onClick={() => openModal(row)} />
        <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(row.id || row._id)} okText="Delete" okButtonProps={{ danger: true }}>
          <AButton size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )},
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-slate-900">Categories</h1>
        <AButton type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Add Category</AButton>
      </div>
      <div className="card p-4">
        <Table dataSource={cats} columns={cols} rowKey={row => row.id || row._id} pagination={false} loading={loading} />
      </div>
      <Modal title={editing ? 'Edit Category' : 'New Category'} open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Save" confirmLoading={saving}>
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item label="Icon (emoji or URL)" name="icon" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
