import apiClient from './apiClient'
import { env } from '@/config/env'
import { mockProducts } from './mockData'
import { buildQueryString } from '@/utils'

export const productService = {
  async getAll(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      let data = [...mockProducts]
      if (params.category) data = data.filter(p => p.categoryId == params.category)
      if (params.search)   data = data.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()))
      if (params.sort === 'price_asc')  data.sort((a,b) => a.price - b.price)
      if (params.sort === 'price_desc') data.sort((a,b) => b.price - a.price)
      const page = params.page || 1, limit = params.limit || 20
      return { data: data.slice((page-1)*limit, page*limit), total: data.length, page, limit }
    }
    const { data } = await apiClient.get(`/products?${buildQueryString(params)}`)
    return data
  },

  async getById(id) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      const product = mockProducts.find(p => p.id == id || p.slug == id)
      if (!product) throw new Error('Product not found')
      return product
    }
    const { data } = await apiClient.get(`/products/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await apiClient.post('/products', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/products/${id}`, payload)
    return data
  },

  async delete(id) {
    const { data } = await apiClient.delete(`/products/${id}`)
    return data
  },

  async uploadImage(id, formData) {
    const { data } = await apiClient.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async getFeatured() {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 300))
      return mockProducts.filter((_, i) => i < 8)
    }
    const { data } = await apiClient.get('/products/featured')
    return data
  },

  async getCategories() {
    if (env.USE_MOCK) {
      const { PRODUCT_CATEGORIES } = await import('@/constants')
      return PRODUCT_CATEGORIES
    }
    const { data } = await apiClient.get('/categories')
    return data
  },

  async getReviews(productId, params = {}) {
    if (env.USE_MOCK) {
      return { data: [], total: 0 }
    }
    const { data } = await apiClient.get(`/products/${productId}/reviews?${buildQueryString(params)}`)
    return data
  },

  async addReview(productId, payload) {
    const { data } = await apiClient.post(`/products/${productId}/reviews`, payload)
    return data
  },
}
