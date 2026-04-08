import apiClient from './apiClient'
import { buildQueryString } from '@/utils'

const normalizeVoucher = (v) => {
  if (!v) return v
  return {
    ...v,
    id: v.ma_phieu || v.id,
    code: v.ma_code || v.code || '',
    type: v.loai_giam_gia || v.type || 'fixed',
    minOrder: v.don_toi_thieu || v.minOrder || 0,
    status: v.trang_thai || v.status || (new Date(v.ngay_het_han) > new Date() ? 'active' : 'expired'),
    endDate: v.ngay_het_han || v.endDate || v.expiresAt,
  }
}

const normalizeBlog = (b) => {
  if (!b) return b
  return {
    ...b,
    id: b.ma_bai_viet || b.id,
    title: b.tieu_de || b.title || '',
    views: b.luot_xem || b.views || 0,
    category: b.chuyen_muc || b.category || '',
  }
}

const normalizeList = (data, normalizer) => {
  const result = data.data || data
  if (result.items && Array.isArray(result.items)) {
    return {
      data: result.items.map(normalizer),
      total: result.total_items || result.items.length,
      page: result.current_page || 1,
      limit: result.limit_per_page || 20,
    }
  }
  if (Array.isArray(result)) return { data: result.map(normalizer), total: result.length }
  const items = result.data || []
  return { data: (Array.isArray(items) ? items : []).map(normalizer), total: items.length }
}

// ─── Voucher Service ───────────────────────────────────────────────────────────
export const voucherService = {
  async getAll(params = {}) {
    const { data } = await apiClient.get(`/admin/vouchers?${buildQueryString(params)}`)
    return normalizeList(data, normalizeVoucher)
  },

  async validate(code, orderTotal) {
    const { data } = await apiClient.post('/vouchers/apply', {
      ma_code:            code,
      tong_tien_don_hang: orderTotal,
    })
    return data.data || data
  },

  async create(payload) {
    const { data } = await apiClient.post('/admin/vouchers/add', payload)
    return data.data || data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/admin/vouchers/${id}`, payload)
    return data.data || data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/admin/vouchers/${id}`)
    return data.data || data
  },
}

// ─── Blog Service ──────────────────────────────────────────────────────────────
export const blogService = {
  async getAll(params = {}) {
    const { data } = await apiClient.get(`/admin/blogs/public?${buildQueryString(params)}`)
    return normalizeList(data, normalizeBlog)
  },

  async getBySlug(slug) {
    const { data } = await apiClient.get(`/admin/blogs/public/${slug}`)
    const result = data.data || data
    return normalizeBlog(result)
  },

  async create(payload) {
    const { data } = await apiClient.post('/admin/blogs/add', payload)
    return data.data || data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/admin/blogs/${id}`, payload)
    return data.data || data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/admin/blogs/${id}`)
    return data.data || data
  },
}

// ─── Analytics Service ─────────────────────────────────────────────────────────
export const analyticsService = {
  async getDashboardStats() {
    const { data } = await apiClient.get('/dashboard/')
    return data.data || data
  },

  async getRevenueChart(period = 'monthly') {
    const { data } = await apiClient.get(`/dashboard/revenue?period=${period}`)
    return data.data || data
  },

  async getTopProducts(limit = 10) {
    const { data } = await apiClient.get(`/dashboard/top-products?limit=${limit}`)
    return data.data || data
  },

  async getLowStockAlerts() {
    const { data } = await apiClient.get('/dashboard/low-stock')
    return data.data || data
  },

  async getExpiryAlerts() {
    const { data } = await apiClient.get('/dashboard/expiry-alerts')
    return data.data || data
  },
}
