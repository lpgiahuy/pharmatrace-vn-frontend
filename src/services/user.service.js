import apiClient from './apiClient'
import { env } from '@/config/env'
import { mockUsers } from './mockData'
import { buildQueryString } from '@/utils'

export const userService = {
  async getAll(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return { data: mockUsers, total: mockUsers.length }
    }
    const { data } = await apiClient.get(`/users?${buildQueryString(params)}`)
    return data
  },

  async getById(id) {
    if (env.USE_MOCK) {
      return mockUsers.find(u => u.id == id) || null
    }
    const { data } = await apiClient.get(`/users/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await apiClient.post('/users', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/users/${id}`, payload)
    return data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/users/${id}`)
    return data
  },

  async updateProfile(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return payload
    }
    const { data } = await apiClient.put('/users/me', payload)
    return data
  },

  async uploadAvatar(formData) {
    const { data } = await apiClient.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async getAddresses() {
    if (env.USE_MOCK) {
      return [{ id: 1, label: 'Home', address: '123 Nguyen Hue', district: 'District 1', city: 'Ho Chi Minh City', isDefault: true }]
    }
    const { data } = await apiClient.get('/users/me/addresses')
    return data
  },

  async addAddress(payload) {
    const { data } = await apiClient.post('/users/me/addresses', payload)
    return data
  },

  async deleteAddress(id) {
    const { data } = await apiClient.delete(`/users/me/addresses/${id}`)
    return data
  },

  async uploadPrescription(formData) {
    const { data } = await apiClient.post('/users/me/prescriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async getPrescriptions() {
    if (env.USE_MOCK) {
      return []
    }
    const { data } = await apiClient.get('/users/me/prescriptions')
    return data
  },

  async getWishlist() {
    if (env.USE_MOCK) {
      const { mockProducts } = await import('./mockData')
      return mockProducts.slice(0, 4)
    }
    const { data } = await apiClient.get('/users/me/wishlist')
    return data
  },

  async toggleWishlist(productId) {
    if (env.USE_MOCK) {
      return { added: true }
    }
    const { data } = await apiClient.post(`/users/me/wishlist/${productId}`)
    return data
  },

  async getRoles() {
    if (env.USE_MOCK) {
      return ['admin', 'manager', 'warehouse', 'pharmacist', 'staff']
    }
    const { data } = await apiClient.get('/roles')
    return data
  },
}
