import { create } from 'zustand'
import { productService } from '@/services/product.service'

const ICONS = ['💊', '🌿', '🍼', '💖', '🧴', '🦴', '🩹', '🛡️', '🤧', '💉', '🫁', '👶', '🩺']

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  fetched: false,
  fetchCategories: async () => {
    if (get().fetched || get().loading) return
    set({ loading: true })
    try {
      const data = await productService.getCategories()
      const mapped = data.map((c, i) => ({
        id: c.id,
        name: c.ten_danh_muc || c.name,
        slug: c.slug || `cat-${c.id}`,
        icon: c.hinh_anh_icon || ICONS[i % ICONS.length]
      }))
      set({ categories: mapped, fetched: true })
    } catch (e) {
      console.error('[categoryStore]', e)
    } finally {
      set({ loading: false })
    }
  }
}))
