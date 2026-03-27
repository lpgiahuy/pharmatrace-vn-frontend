import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/utils'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      voucher: null,
      shippingFee: 30000,

      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({ items: items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
        toast.success(`${product.name} added to cart`)
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.id !== productId) }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) { get().removeItem(productId); return }
        set(state => ({ items: state.items.map(i => i.id === productId ? { ...i, quantity } : i) }))
      },

      clearCart: () => set({ items: [], voucher: null }),

      applyVoucher: (voucher) => {
        set({ voucher })
        toast.success(`Voucher ${voucher.code} applied!`)
      },

      removeVoucher: () => set({ voucher: null }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getDiscount: () => {
        const { voucher, getSubtotal } = get()
        if (!voucher) return 0
        if (voucher.type === 'percent') return Math.round(getSubtotal() * voucher.value / 100)
        if (voucher.type === 'fixed')   return voucher.value
        if (voucher.type === 'freeship') return get().shippingFee
        return 0
      },

      getTotal: () => {
        const { getSubtotal, getDiscount, shippingFee, voucher } = get()
        const shippingDiscount = voucher?.type === 'freeship' ? shippingFee : 0
        return getSubtotal() - getDiscount() + shippingFee - shippingDiscount
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'pharma-cart',
      partialize: (state) => ({ items: state.items, voucher: state.voucher }),
    }
  )
)
