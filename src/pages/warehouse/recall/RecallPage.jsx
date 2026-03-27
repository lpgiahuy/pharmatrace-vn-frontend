import { useState } from 'react'
import { Form, Input, Select, Button as AButton, Card, Alert, Steps, Tag } from 'antd'
import { AlertOutlined, WarningOutlined } from '@ant-design/icons'
import { warehouseService } from '@/services/warehouse.service'
import toast from 'react-hot-toast'

export default function RecallPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  const handleRecall = async (vals) => {
    setLoading(true)
    try {
      const res = await warehouseService.recallBatch(vals)
      setResult(res)
      setCurrentStep(2)
      toast.success(`Recall initiated — ${res.affectedUnits} units affected`)
    } catch { toast.error('Recall initiation failed') }
    finally { setLoading(false) }
  }

  const RECALL_REASONS = ['Contamination', 'Mislabeling', 'Potency Failure', 'Packaging Defect', 'Adverse Events', 'Regulatory Order']

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2"><AlertOutlined className="text-red-500" /> Batch Recall</h1>
        <p className="text-slate-500 text-sm mt-1">Initiate an emergency product recall by batch number</p>
      </div>

      <Alert
        message="Emergency Action — Recall Protocol"
        description="Initiating a recall will immediately quarantine all units from the specified batch, notify relevant staff, and create an audit trail. This action is irreversible."
        type="error"
        showIcon
      />

      <Steps current={currentStep} size="small" className="mb-4" items={[
        { title: 'Enter Details' },
        { title: 'Confirm Recall' },
        { title: 'Recall Active' },
      ]} />

      {currentStep < 2 ? (
        <Card title="Recall Details">
          <Form form={form} layout="vertical" onFinish={handleRecall}>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Form.Item label="Product Name" name="productName" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="Batch Number" name="batchNumber" rules={[{ required: true }]}>
                <Input placeholder="BATCH-0001" />
              </Form.Item>
              <Form.Item label="Recall Reason" name="reason" rules={[{ required: true }]}>
                <Select options={RECALL_REASONS.map(r => ({ value: r, label: r }))} placeholder="Select reason" />
              </Form.Item>
              <Form.Item label="Severity Level" name="severity" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'Class I',   label: '🔴 Class I — Serious health risk' },
                  { value: 'Class II',  label: '🟠 Class II — Temporary adverse health risk' },
                  { value: 'Class III', label: '🟡 Class III — Unlikely to cause harm' },
                ]} />
              </Form.Item>
              <Form.Item label="Initiated By" name="initiatedBy" rules={[{ required: true }]}><Input placeholder="Your name" /></Form.Item>
              <Form.Item label="Regulatory Reference" name="regulatoryRef"><Input placeholder="MOH order / case number (if any)" /></Form.Item>
              <Form.Item label="Description" name="description" className="sm:col-span-2">
                <Input.TextArea rows={3} placeholder="Detailed description of the recall reason…" />
              </Form.Item>
            </div>
            <AButton
              type="primary" danger htmlType="submit" loading={loading}
              icon={<AlertOutlined />} size="large"
              onClick={() => setCurrentStep(1)}
            >
              Initiate Batch Recall
            </AButton>
          </Form>
        </Card>
      ) : (
        <Card className="border-red-200 bg-red-50">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertOutlined className="text-3xl text-red-500" />
            </div>
            <h2 className="text-xl font-display font-bold text-red-700 mb-2">Recall Active</h2>
            <p className="text-red-600 mb-1">Recall ID: <strong className="font-mono">{result?.id}</strong></p>
            <p className="text-red-600 mb-4">Affected Units: <strong>{result?.affectedUnits}</strong></p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Tag color="red">Status: {result?.status}</Tag>
              <Tag color="orange">Batch: {form.getFieldValue('batchNumber')}</Tag>
            </div>
            <p className="text-xs text-red-400 mt-4">All relevant staff have been notified. Quarantine is in effect.</p>
            <AButton className="mt-4" onClick={() => { setResult(null); setCurrentStep(0); form.resetFields() }}>
              Initiate Another Recall
            </AButton>
          </div>
        </Card>
      )}
    </div>
  )
}
