import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { rmaService } from '@/services/order.service'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { RMA_REASONS } from '@/constants'
import toast from 'react-hot-toast'

export default function RmaPage() {
  const [submitted, setSubmitted] = useState(null)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      const rma = await rmaService.create(data)
      setSubmitted(rma)
      toast.success('RMA request submitted!')
      reset()
    } catch { toast.error('Failed to submit RMA request.') }
  }

  return (
    <div className="page-container py-8 max-w-xl animate-fade-in">
      <h1 className="section-title mb-2">Return / Refund Request</h1>
      <p className="text-slate-500 text-sm mb-6">Fill in the form below to initiate a return or refund.</p>
      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          ✅ RMA submitted — ID: <strong className="font-mono">{submitted.id}</strong>. Our team will contact you within 24 hours.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <Input label="Order ID" placeholder="ORD-001234" required error={errors.orderId?.message} {...register('orderId', { required: 'Order ID is required' })} />
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Reason <span className="text-red-500">*</span></label>
          <select className="input" {...register('reason', { required: true })}>
            <option value="">Select a reason…</option>
            {RMA_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <Textarea label="Description" placeholder="Describe the issue in detail…" required error={errors.description?.message} {...register('description', { required: 'Please describe the issue' })} />
        <Input label="Preferred Resolution" placeholder="Refund / Replacement" {...register('resolution')} />
        <Button type="submit" fullWidth loading={isSubmitting}>Submit RMA Request</Button>
      </form>
    </div>
  )
}
