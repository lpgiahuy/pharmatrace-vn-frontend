import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { orderService } from '@/services/order.service'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils'
import { PAYMENT_METHODS } from '@/constants'
import toast from 'react-hot-toast'

const PAYMENT_OPTIONS = [
  { value: 'cod',     label: '💵 Cash on Delivery' },
  { value: 'vnpay',   label: '🏦 VNPay' },
  { value: 'momo',    label: '💜 MoMo Wallet' },
  { value: 'banking', label: '🏧 Bank Transfer' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotal, getSubtotal, getDiscount, shippingFee, voucher, clearCart, fetchCart } = useCartStore()
  const { user } = useAuthStore()
  const [payMethod, setPayMethod] = useState('cod')

  useEffect(() => {
    fetchCart()
  }, [])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '', address: '', district: '', city: 'Ho Chi Minh City', note: '' },
  })

  const onSubmit = async (formData) => {
    try {
      const fullAddress = `${formData.address}, ${formData.district}, ${formData.city}`
      const order = await orderService.create({
        dia_chi_giao_hang: fullAddress,
        paymentMethod: payMethod.toUpperCase(),
        note: formData.note,
        voucherId: voucher?.id,
      })
      clearCart()
      toast.success('Đặt hàng thành công!')
      navigate(`/order-success/${order.id}`)
    } catch (err) {
      console.error(err)
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.')
    }
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      <h1 className="section-title mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-slate-800 mb-4">Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" required error={errors.name?.message} {...register('name', { required: true })} />
                <Input label="Phone Number" required error={errors.phone?.message} {...register('phone', { required: true })} />
                <Input label="Street Address" className="sm:col-span-2" required error={errors.address?.message} {...register('address', { required: true })} />
                <Input label="District" required error={errors.district?.message} {...register('district', { required: true })} />
                <Input label="City" required {...register('city')} />
                <Input label="Order Note (optional)" className="sm:col-span-2" placeholder="Special delivery instructions..." {...register('note')} />
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="font-display font-semibold text-slate-800 mb-4">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPayMethod(opt.value)}
                    className={`p-4 rounded-xl border text-left text-sm font-medium transition-all ${payMethod === opt.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-surface-border text-slate-700 hover:border-brand-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit space-y-4">
            <h2 className="font-display font-semibold text-slate-800">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg bg-slate-50 border border-surface-border object-contain p-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-slate-500">x{item.quantity} · {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatCurrency(getSubtotal())}</span></div>
              <div className="flex justify-between text-slate-600"><span>Shipping</span><span>{formatCurrency(shippingFee)}</span></div>
              {getDiscount() > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Voucher</span><span>-{formatCurrency(getDiscount())}</span></div>}
            </div>
            <div className="divider" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-brand-600">{formatCurrency(getTotal())}</span>
            </div>
            <Button type="submit" fullWidth size="lg" loading={isSubmitting}>Place Order</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
