import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Switch, Button as AButton, Card, Upload, Space, Divider } from 'antd'
import { UploadOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { productService } from '@/services/product.service'
import { cloudinaryService } from '@/services/cloudinary.service'
import { useCategoryStore } from '@/store/categoryStore'
import toast from 'react-hot-toast'

const { TextArea } = Input

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(isEdit)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const { categories, fetchCategories } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
    if (!isEdit) return
    productService.getById(id)
      .then(p => {
        // Map back to form fields if needed
        const formData = {
          ...p,
          ten_thuoc: p.name,
          gia_ban: p.price,
          hinh_anh_url: p.image,
          mo_ta_ngan: p.description,
          la_thuoc_ke_don: p.isPrescription,
          danh_muc_id: p.categoryId,
          so_dang_ky: p.so_dang_ky,
          quy_cach: p.packagingVariants?.map(v => ({
            ten_don_vi: v.label,
            gia_ban: v.price,
            la_don_vi_co_ban: v.isBase
          })) || []
        }
        form.setFieldsValue(formData)
        setImageUrl(p.image)
      })
      .finally(() => setInitLoading(false))
  }, [id, fetchCategories, form, isEdit])

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      const url = await cloudinaryService.uploadImage(file)
      setImageUrl(url)
      form.setFieldsValue({ hinh_anh_url: url })
      toast.success('Image uploaded successfully!')
    } catch (err) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
    return false // Prevent default upload
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      let quy_cach = values.quy_cach || [];
      if (quy_cach.length === 0) {
        toast.error('Please add at least 1 packaging variant (e.g., Box, Strip).');
        setLoading(false);
        return;
      }
      
      const invalidVariants = quy_cach.some(v => !v.ten_don_vi || !v.gia_ban || Number(v.gia_ban) <= 0);
      if (invalidVariants) {
        toast.error('Unit name and a valid price (> 0) are required for all variants.');
        setLoading(false);
        return;
      }

      // Prepare payload for backend
      const payload = {
        thong_tin_thuoc: {
          ten_thuoc: values.ten_thuoc,
          so_dang_ky: values.so_dang_ky,
          danh_muc_id: values.danh_muc_id,
          hinh_anh_url: values.hinh_anh_url || '',
          la_thuoc_ke_don: values.la_thuoc_ke_don,
          mo_ta_ngan: values.mo_ta_ngan || '',
          trang_thai: values.trang_thai ?? true,
          slug: values.ten_thuoc ? values.ten_thuoc.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : '',
        },
        // packaging variants
        quy_cach_dong_goi: quy_cach.map(v => ({
          ...v,
          gia_ban: Number(v.gia_ban),
          la_don_vi_co_ban: v.la_don_vi_co_ban || false
        }))
      }

      if (isEdit) await productService.update(id, payload)
      else        await productService.create(payload)
      
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`)
      navigate('/admin/products')
    } catch (error) { 
      console.error(error)
      toast.error('Failed to save product') 
    }
    finally { setLoading(false) }
  }

  if (initLoading) return <div className="text-center py-20 text-slate-400">Loading…</div>

  return (
    <div className="max-w-4xl animate-fade-in mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <p className="text-slate-500 text-sm">Manage pharmaceutical information and traceability</p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="General Information" className="shadow-sm border-slate-200">
              <div className="grid sm:grid-cols-2 gap-x-4">
                <Form.Item label="Product Name" name="ten_thuoc" rules={[{ required: true }]} className="sm:col-span-2">
                  <Input placeholder="e.g. Panadol Extra with Optizorb" />
                </Form.Item>
                <Form.Item label="Registration Number" name="so_dang_ky">
                  <Input placeholder="VD-12345-20" />
                </Form.Item>
                <Form.Item label="Category" name="danh_muc_id" rules={[{ required: true }]}>
                  <Select placeholder="Select category">
                    {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item label="Description" name="mo_ta_ngan" className="sm:col-span-2">
                  <TextArea rows={4} placeholder="Brief description of the medicine…" />
                </Form.Item>
              </div>
            </Card>

            <Card title="Packaging & Pricing" className="shadow-sm border-slate-200">
              <Form.List name="quy_cach" initialValue={[{ ten_don_vi: 'Hộp', gia_ban: null, la_don_vi_co_ban: true }]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'ten_don_vi']}
                          rules={[{ required: true, message: 'Unit name required' }]}
                        >
                          <Input placeholder="Unit (e.g. Box, Strip)" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'gia_ban']}
                          rules={[{ required: true, message: 'Price required' }]}
                        >
                          <InputNumber min={0} placeholder="Price" formatter={v => `₫ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: 150 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'la_don_vi_co_ban']}
                          valuePropName="checked"
                          label="Base"
                        >
                          <Switch size="small" />
                        </Form.Item>
                        <AButton type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <AButton type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Packaging Variant
                      </AButton>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Product Media" className="shadow-sm border-slate-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center p-4">
                      <UploadOutlined className="text-3xl text-slate-300 mb-2" />
                      <p className="text-xs text-slate-400">No image selected</p>
                    </div>
                  )}
                </div>
                <Form.Item name="hinh_anh_url" hidden><Input /></Form.Item>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleUpload}
                >
                  <AButton loading={uploading} icon={<UploadOutlined />}>
                    {uploading ? 'Uploading...' : 'Change Image'}
                  </AButton>
                </Upload>
              </div>
            </Card>

            <Card title="Settings" className="shadow-sm border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Active Status</span>
                  <Form.Item name="trang_thai" valuePropName="checked" noStyle initialValue={true}>
                    <Switch />
                  </Form.Item>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Prescription Required</span>
                  <Form.Item name="la_thuoc_ke_don" valuePropName="checked" noStyle initialValue={false}>
                    <Switch />
                  </Form.Item>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <AButton type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} size="large" className="px-10">
            {isEdit ? 'Update Product' : 'Create Product'}
          </AButton>
          <AButton onClick={() => navigate('/admin/products')} size="large">Cancel</AButton>
        </div>
      </Form>
    </div>
  )
}
