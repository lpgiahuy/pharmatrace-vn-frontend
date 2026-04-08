import apiClient from './apiClient'

export const traceService = {
  async traceCode(code) {
    // Backend uses POST /trace/scan-qr with { uid } body
    const { data } = await apiClient.post('/trace/scan-qr', { uid: code.trim() })
    return data.data || data
  },

  async reportSuspicious(code, reason) {
    const { data } = await apiClient.post('/trace/report', { code, reason })
    return data.data || data
  },
}

export const DEMO_CODES = [
  { code: 'QR-BATCH-0001', label: '✅ Authentic product',   color: 'green'  },
  { code: 'QR-BATCH-0002', label: '⚠️ Suspicious activity', color: 'orange' },
  { code: 'QR-BATCH-0003', label: '🚨 Recalled batch',       color: 'red'    },
  { code: 'FAKE-001',      label: '❌ Counterfeit product',  color: 'red'    },
]
