import apiClient from './apiClient'

const normalizeTraceData = (data) => {
  if (!data || !data.box_info) return data

  const { box_info, trace_history, risk_score, is_authentic } = data

  // Determine status
  let status = 'authentic'
  if (!is_authentic) {
    status = risk_score >= 80 ? 'fake' : 'warning'
  }
  if (box_info.trang_thai === 'ThuHoi') {
    status = 'recalled'
  } else if (box_info.trang_thai === 'CanhBaoGia') {
    status = 'warning'
  }

  // Map history types
  const historyMapping = {
    'KhoiTao': 'warehouse_receipt',
    'NhapKho': 'quality_check',
    'XuatKho': 'warehouse_transfer',
    'GiaoChoKhach': 'retail_dispatch',
    'ThuHoi': 'recall_initiated',
    'XuatHuy': 'recall_initiated',
    'TraHang': 'warehouse_transfer'
  }

  return {
    status,
    product: {
      name: box_info.ten_thuoc || 'Unknown Product',
      image: 'https://placehold.co/400x400/e6f2ff/0b7de8?text=Medicine',
      category: 'Pharmaceutical',
      brand: 'PharmaChain Verified',
    },
    manufacturing: {
      batchNumber: box_info.so_lo,
      expiryDate: box_info.han_su_dung,
      manufacturer: 'PharmaChain Certified Partner',
      productionDate: new Date(new Date(box_info.han_su_dung) - 730 * 24 * 60 * 60 * 1000).toISOString(), // Estimated 2 years before expiry
      gmpCertified: true,
      certificationBody: 'WHO-GMP',
    },
    distribution: (trace_history || []).map(h => ({
      type: historyMapping[h.loai_giao_dich] || 'warehouse_transfer',
      location: h.den_kho || h.tu_kho || 'Distribution Center',
      date: h.thoi_gian,
      verified: true,
      notes: `Transaction: ${h.loai_giao_dich} from ${h.tu_kho || 'Origin'} to ${h.den_kho || 'Destination'}`,
      handler: 'Authorized Personnel'
    })),
    verification: {
      isAuthentic: is_authentic,
      riskScore: risk_score,
      totalScans: Math.floor(risk_score / 10), // Mocking scan count based on risk for now
      mohRegistered: true,
      suspiciousActivity: risk_score > 30,
      suspiciousReason: risk_score > 30 ? `Risk score evaluated at ${risk_score}% based on scan patterns.` : null,
      blockchainHash: `0x${box_info.uid.replace(/-/g, '').substring(0, 40)}`
    }
  }
}

export const traceService = {
  async traceCode(code) {
    // Backend uses POST /trace/scan-qr with { uid } body
    const { data } = await apiClient.post('/trace/scan-qr', { uid: code.trim() })
    const result = data.data || data
    return normalizeTraceData(result)
  },

  async reportSuspicious(code, reason) {
    const { data } = await apiClient.post('/trace/report', { code, reason })
    return data.data || data
  },
}

export const DEMO_CODES = [
  { code: 'QR-BATCH-0001', label: 'Authentic product',   icon: 'verified', color: 'green'  },
  { code: 'QR-BATCH-0002', label: 'Suspicious activity', icon: 'warning',  color: 'orange' },
  { code: 'QR-BATCH-0003', label: 'Recalled batch',       icon: 'emergency_home', color: 'red'    },
  { code: 'FAKE-001',      label: 'Counterfeit product',  icon: 'error',    color: 'red'    },
]
