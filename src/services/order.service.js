import apiClient from './apiClient'
import { env } from '@/config/env'
import { mockOrders } from './mockData'
import { buildQueryString } from '@/utils'

export const orderService = {
  async getAll(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return { data: mockOrders, total: mockOrders.length }
    }
    const { data } = await apiClient.get(`/orders?${buildQueryString(params)}`)
    return data
  },

  async getById(id) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      const order = mockOrders.find(o => o.id === id)
      if (!order) throw new Error('Order not found')
      return { ...order, items: [{ productId: 1, name: 'Vitamin C 1000mg', quantity: 2, price: 120000 }] }
    }
    const { data } = await apiClient.get(`/orders/${id}`)
    return data
  },

  async create(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      return { id: `ORD-${Date.now()}`, status: 'pending', ...payload }
    }
    const { data } = await apiClient.post('/orders', payload)
    return data
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status })
    return data
  },

  async cancel(id, reason) {
    const { data } = await apiClient.post(`/orders/${id}/cancel`, { reason })
    return data
  },

  async getMyOrders(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return { data: mockOrders.slice(0, 5), total: 5 }
    }
    const { data } = await apiClient.get(`/orders/my-orders?${buildQueryString(params)}`)
    return data
  },
}

export const rmaService = {
  async create(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { id: `RMA-${Date.now()}`, status: 'pending', ...payload }
    }
    const { data } = await apiClient.post('/rma', payload)
    return data
  },

  async getAll(params = {}) {
    if (env.USE_MOCK) {
      return { data: [], total: 0 }
    }
    const { data } = await apiClient.get(`/rma?${buildQueryString(params)}`)
    return data
  },

  async getById(id) {
    const { data } = await apiClient.get(`/rma/${id}`)
    return data
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/rma/${id}/status`, { status })
    return data
  },
}
