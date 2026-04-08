import apiClient from './apiClient'
import { buildQueryString } from '@/utils'

const normalizeOrder = (o) => {
  if (!o) return o
  return {
    ...o,
    id: o.ma_don_hang || o.id,
    date: o.ngay_dat || o.createdAt || o.date,
    status: o.trang_thai || o.status,
    total: o.tong_tien || o.total || 0,
    items: o.tong_so_luong || o.items?.length || o.items || 0,
    address: o.dia_chi_giao_hang || o.dia_chi || o.address || '',
  }
}

const normalizeRma = (r) => {
  if (!r) return r
  return {
    ...r,
    id: r.ma_phieu || r.id,
    orderId: r.ma_don_hang || r.orderId,
    reason: r.ly_do || r.reason || '',
    date: r.ngay_tao || r.createdAt || r.date,
    status: r.trang_thai || r.status,
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

export const orderService = {
  async getAll(params = {}) {
    const { data } = await apiClient.get(`/admin/orders?${buildQueryString(params)}`)
    return normalizeList(data, normalizeOrder)
  },

  async getById(id) {
    const { data } = await apiClient.get(`/admin/orders/${id}`)
    const result = data.data || data
    return normalizeOrder(result)
  },

  async create(payload) {
    const { data } = await apiClient.post('/orders/checkout', {
      dia_chi_giao_hang:      payload.address || payload.dia_chi_giao_hang,
      phuong_thuc_thanh_toan: payload.paymentMethod || payload.phuong_thuc_thanh_toan,
      ghi_chu:                payload.note || payload.ghi_chu || '',
      voucher_id:             payload.voucherId || payload.voucher_id || undefined,
    })
    return data.data || data
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/admin/orders/${id}/status`, { status })
    return data.data || data
  },

  async cancel(id, reason) {
    const { data } = await apiClient.post(`/orders/${id}/cancel`, { reason })
    return data.data || data
  },

  async getMyOrders(params = {}) {
    const { data } = await apiClient.get(`/orders/my-orders?${buildQueryString(params)}`)
    return normalizeList(data, normalizeOrder)
  },
}

export const rmaService = {
  async create(payload) {
    const { data } = await apiClient.post('/rma/request', payload)
    return data.data || data
  },

  async getAll(params = {}) {
    const { data } = await apiClient.get(`/admin/rma?${buildQueryString(params)}`)
    return normalizeList(data, normalizeRma)
  },

  async getById(id) {
    const { data } = await apiClient.get(`/admin/rma/${id}`)
    const result = data.data || data
    return normalizeRma(result)
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.put(`/admin/rma/${id}/status`, { status })
    return data.data || data
  },
}
