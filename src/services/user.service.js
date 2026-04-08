import apiClient from './apiClient'
import { buildQueryString } from '@/utils'

const normalizeUser = (u) => {
  if (!u) return u
  return {
    ...u,
    id: u.id || u._id || u.ma_nhan_vien,
    name: u.ho_ten || u.name || '',
    phone: u.so_dien_thoai || u.phone || '',
    email: u.email || '',
    role: u.vai_tro || u.role || 'staff',
    status: u.trang_thai || u.status || 'active',
    createdAt: u.ngay_tao || u.createdAt || u.created_at,
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

export const userService = {
  async getAll(params = {}) {
    const { data } = await apiClient.get(`/admin/staff?${buildQueryString(params)}`)
    return normalizeList(data, normalizeUser)
  },

  async getById(id) {
    const { data } = await apiClient.get(`/admin/staff/${id}`)
    const result = data.data || data
    return normalizeUser(result)
  },

  async create(payload) {
    const { data } = await apiClient.post('/admin/staff/add', payload)
    return data.data || data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/admin/staff/${id}`, payload)
    return data.data || data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/admin/staff/${id}`)
    return data.data || data
  },

  async updateProfile(payload) {
    const { data } = await apiClient.put('/auth/me', payload)
    return data.data || data
  },

  async uploadAvatar(formData) {
    const { data } = await apiClient.post('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data || data
  },

  async getAddresses() {
    const { data } = await apiClient.get('/auth/me/addresses')
    return data.data || data
  },

  async addAddress(payload) {
    const { data } = await apiClient.post('/auth/me/addresses', payload)
    return data.data || data
  },

  async deleteAddress(id) {
    const { data } = await apiClient.delete(`/auth/me/addresses/${id}`)
    return data.data || data
  },

  async uploadPrescription(formData) {
    const { data } = await apiClient.post('/prescriptions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data || data
  },

  async getPrescriptions() {
    const { data } = await apiClient.get('/admin/prescriptions')
    return data.data || data
  },

  async getWishlist() {
    const { data } = await apiClient.get('/wishlist')
    return data.data || data
  },

  async toggleWishlist(productId) {
    const { data } = await apiClient.post('/wishlist/add', { productId })
    return data.data || data
  },

  async removeFromWishlist(productId) {
    const { data } = await apiClient.delete(`/wishlist/remove/${productId}`)
    return data.data || data
  },

  async getRoles() {
    const { data } = await apiClient.get('/admin/staff/roles')
    return data.data || data
  },
}
