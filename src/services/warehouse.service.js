import apiClient from './apiClient'
import { env } from '@/config/env'
import { mockInventory } from './mockData'
import { buildQueryString } from '@/utils'

export const warehouseService = {
  async getInventory(params = {}) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return { data: mockInventory, total: mockInventory.length }
    }
    const { data } = await apiClient.get(`/warehouse/inventory?${buildQueryString(params)}`)
    return data
  },

  async getInventoryById(id) {
    if (env.USE_MOCK) {
      const item = mockInventory.find(i => i.id == id)
      if (!item) throw new Error('Inventory item not found')
      return item
    }
    const { data } = await apiClient.get(`/warehouse/inventory/${id}`)
    return data
  },

  async receiveStock(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      return { id: Date.now(), ...payload, qrCode: `QR-${Date.now()}`, uid: `UID-${Date.now()}` }
    }
    const { data } = await apiClient.post('/warehouse/inbound', payload)
    return data
  },

  async fulfillOrder(orderId, payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { orderId, status: 'packed', ...payload }
    }
    const { data } = await apiClient.post(`/warehouse/fulfill/${orderId}`, payload)
    return data
  },

  async transferStock(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { id: Date.now(), status: 'pending', ...payload }
    }
    const { data } = await apiClient.post('/warehouse/transfer', payload)
    return data
  },

  async getTransfers(params = {}) {
    if (env.USE_MOCK) {
      return { data: [], total: 0 }
    }
    const { data } = await apiClient.get(`/warehouse/transfers?${buildQueryString(params)}`)
    return data
  },

  async disposeStock(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { id: Date.now(), status: 'disposed', ...payload }
    }
    const { data } = await apiClient.post('/warehouse/disposal', payload)
    return data
  },

  async getDisposals(params = {}) {
    if (env.USE_MOCK) {
      return { data: [], total: 0 }
    }
    const { data } = await apiClient.get(`/warehouse/disposals?${buildQueryString(params)}`)
    return data
  },

  async recallBatch(payload) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      return { id: Date.now(), status: 'initiated', ...payload, affectedUnits: Math.floor(Math.random() * 200) + 10 }
    }
    const { data } = await apiClient.post('/warehouse/recall', payload)
    return data
  },

  async getRecalls(params = {}) {
    if (env.USE_MOCK) {
      return { data: [], total: 0 }
    }
    const { data } = await apiClient.get(`/warehouse/recalls?${buildQueryString(params)}`)
    return data
  },

  async scanQR(qrCode) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const item = mockInventory[0]
      return { ...item, qrCode, scannedAt: new Date().toISOString() }
    }
    const { data } = await apiClient.post('/warehouse/scan', { qrCode })
    return data
  },

  async getLocations() {
    if (env.USE_MOCK) {
      return ['A1-01', 'A1-02', 'A2-01', 'A2-02', 'B1-01', 'B1-02', 'B2-01', 'C1-01']
    }
    const { data } = await apiClient.get('/warehouse/locations')
    return data
  },

  async generateQR(inventoryId) {
    const { data } = await apiClient.post(`/warehouse/inventory/${inventoryId}/generate-qr`)
    return data
  },
}
