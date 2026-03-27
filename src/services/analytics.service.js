import apiClient from './apiClient'
import { env } from '@/config/env'
import { mockVouchers, mockBlogs, mockRevenueChart, mockStats } from './mockData'
import { buildQueryString } from '@/utils'

// ─── Voucher Service ───────────────────────────────────────────────────────────
export const voucherService = {
  async getAll(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      return { data: mockVouchers, total: mockVouchers.length }
    }
    const { data } = await apiClient.get(`/vouchers?${buildQueryString(params)}`)
    return data
  },

  async validate(code, orderTotal) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const voucher = mockVouchers.find(v => v.code === code && v.status === 'active')
      if (!voucher) throw new Error('Voucher not found or expired')
      if (orderTotal < voucher.minOrder) throw new Error(`Minimum order ${voucher.minOrder.toLocaleString('vi-VN')}đ required`)
      return voucher
    }
    const { data } = await apiClient.post('/vouchers/validate', { code, orderTotal })
    return data
  },

  async create(payload) {
    const { data } = await apiClient.post('/vouchers', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/vouchers/${id}`, payload)
    return data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/vouchers/${id}`)
    return data
  },
}

// ─── Blog Service ──────────────────────────────────────────────────────────────
export const blogService = {
  async getAll(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      return { data: mockBlogs, total: mockBlogs.length }
    }
    const { data } = await apiClient.get(`/blogs?${buildQueryString(params)}`)
    return data
  },

  async getBySlug(slug) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      const blog = mockBlogs.find(b => b.slug === slug || b.id == slug)
      if (!blog) throw new Error('Blog not found')
      return { ...blog, content: '<p>Full blog content would appear here with rich text formatting.</p>' }
    }
    const { data } = await apiClient.get(`/blogs/${slug}`)
    return data
  },

  async create(payload) {
    const { data } = await apiClient.post('/blogs', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/blogs/${id}`, payload)
    return data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/blogs/${id}`)
    return data
  },
}

// ─── Analytics Service ─────────────────────────────────────────────────────────
export const analyticsService = {
  async getDashboardStats() {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return mockStats
    }
    const { data } = await apiClient.get('/analytics/dashboard')
    return data
  },

  async getRevenueChart(period = 'monthly') {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return mockRevenueChart
    }
    const { data } = await apiClient.get(`/analytics/revenue?period=${period}`)
    return data
  },

  async getTopProducts(limit = 10) {
    if (env.USE_MOCK) {
      const { mockProducts } = await import('./mockData')
      return mockProducts.slice(0, limit).map(p => ({ ...p, soldCount: Math.floor(Math.random() * 1000) + 100 }))
    }
    const { data } = await apiClient.get(`/analytics/top-products?limit=${limit}`)
    return data
  },

  async getLowStockAlerts() {
    if (env.USE_MOCK) {
      const { mockInventory } = await import('./mockData')
      return mockInventory.filter(i => i.quantity < 50)
    }
    const { data } = await apiClient.get('/analytics/low-stock')
    return data
  },

  async getExpiryAlerts() {
    if (env.USE_MOCK) {
      return []
    }
    const { data } = await apiClient.get('/analytics/expiry-alerts')
    return data
  },
}
