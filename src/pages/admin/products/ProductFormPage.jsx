import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Switch, Button as AButton, Card, Upload } from 'antd'
import { UploadOutlined, SaveOutlined } from '@ant-design/icons'
import { productService } from '@/services/product.service'
import { PRODUCT_CATEGORIES } from '@/constants'
import toast from 'react-hot-toast'

const { TextArea } = Input

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    productService.getById(id)
      .then(p => form.setFieldsValue(p))
      .finally(() => setInitLoading(false))
  }, [id])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      if (isEdit) await productService.update(id, values)
      else        await productService.create(values)
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`)
      navigate('/admin/products')
    } catch { toast.error('Failed to save product') }
    finally { setLoading(false) }
  }

  if (initLoading) return <div className="text-center py-20 text-slate-400">Loading…</div>

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-slate-500 text-sm">Fill in the product details below</p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
        <Card className="mb-4">
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Form.Item label="Product Name" name="name" rules={[{ required: true }]} className="sm:col-span-2">
              <Input placeholder="e.g. Vitamin C 1000mg" />
            </Form.Item>
            <Form.Item label="Brand" name="brand" rules={[{ required: true }]}>
              <Input placeholder="e.g. Doppelherz" />
            </Form.Item>
            <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
              <Select placeholder="Select category">
                {PRODUCT_CATEGORIES.map(c => <Select.Option key={c.id} value={c.id}>{c.icon} {c.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Price (VND)" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} formatter={v => `₫ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item label="Original Price (VND)" name="originalPrice">
              <InputNumber min={0} style={{ width: '100%' }} formatter={v => `₫ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item label="Batch Number" name="batchNumber">
              <Input placeholder="BATCH-0001" />
            </Form.Item>
            <Form.Item label="Expiry Date" name="expiryDate">
              <Input type="date" />
            </Form.Item>
            <Form.Item label="In Stock" name="inStock" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>
            <Form.Item label="Prescription Required" name="isPrescription" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="Description" name="description" className="sm:col-span-2">
              <TextArea rows={4} placeholder="Product description…" />
            </Form.Item>
          </div>
        </Card>

        <div className="flex gap-3">
          <AButton type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </AButton>
          <AButton onClick={() => navigate('/admin/products')}>Cancel</AButton>
        </div>
      </Form>
    </div>
  )
}
