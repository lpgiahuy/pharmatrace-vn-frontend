import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Button as AButton, Card, Select } from 'antd'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { blogService } from '@/services/analytics.service'
import toast from 'react-hot-toast'

const { TextArea } = Input

export default function BlogFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    blogService.getBySlug(id).then(b => form.setFieldsValue(b)).finally(() => setInitLoading(false))
  }, [id])

  const onFinish = async (vals) => {
    setLoading(true)
    try {
      if (isEdit) await blogService.update(id, vals)
      else        await blogService.create(vals)
      toast.success(`Post ${isEdit ? 'updated' : 'created'}`)
      navigate('/admin/blog')
    } catch { toast.error('Save failed') }
    finally { setLoading(false) }
  }

  if (initLoading) return <div className="text-center py-20 text-slate-400">Loading…</div>

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <AButton icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/blog')}>Back</AButton>
        <h1 className="text-xl font-display font-bold text-slate-900">{isEdit ? 'Edit Post' : 'New Blog Post'}</h1>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card className="mb-4">
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Post title…" />
          </Form.Item>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
              <Select placeholder="Select category" options={[
                { value: 'Health Tips', label: 'Health Tips' },
                { value: 'Medicine Guide', label: 'Medicine Guide' },
                { value: 'Wellness', label: 'Wellness' },
                { value: 'News', label: 'News' },
              ]} />
            </Form.Item>
            <Form.Item label="Author" name="author" rules={[{ required: true }]}>
              <Input placeholder="Dr. Nguyen Thi Lan" />
            </Form.Item>
          </div>
          <Form.Item label="Cover Image URL" name="coverImage">
            <Input placeholder="https://…" />
          </Form.Item>
          <Form.Item label="Excerpt" name="excerpt">
            <TextArea rows={2} placeholder="Short summary…" />
          </Form.Item>
          <Form.Item label="Content (HTML)" name="content">
            <TextArea rows={10} placeholder="<p>Full article content…</p>" />
          </Form.Item>
        </Card>
        <div className="flex gap-3">
          <AButton type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            {isEdit ? 'Save Changes' : 'Publish Post'}
          </AButton>
          <AButton onClick={() => navigate('/admin/blog')}>Cancel</AButton>
        </div>
      </Form>
    </div>
  )
}
