import apiClient from './apiClient'
import { env } from '@/config/env'

// ── Rich mock trace data ──────────────────────────────────────────────────────
const MOCK_TRACES = {
  'QR-BATCH-0001': {
    code: 'QR-BATCH-0001',
    uid: 'UID-PC-2024-000001',
    status: 'authentic',               // authentic | warning | fake | recalled
    scanCount: 4,
    suspiciousScans: false,
    product: {
      id: 1,
      name: 'Vitamin C 1000mg',
      brand: 'Doppelherz',
      category: 'Vitamins & Supplements',
      image: 'https://placehold.co/200x200/e6f2ff/0b7de8?text=Vit+C',
      sku: 'DH-VITC-1000',
      description: 'High-potency vitamin C supplement for immune support.',
      registrationNumber: 'VN-MOH-2023-45821',
    },
    manufacturing: {
      manufacturer: 'Doppelherz GmbH & Co. KG',
      country: 'Germany',
      facility: 'Berlin Manufacturing Plant — ISO 9001:2015',
      productionDate: '2023-08-15',
      expiryDate: '2026-08-14',
      batchNumber: 'BATCH-0001',
      lotNumber: 'LOT-DE-2308-001',
      gmpCertified: true,
      certificationBody: 'TÜV Rheinland',
    },
    importation: {
      importer: 'PharmaCo Vietnam Ltd.',
      importDate: '2023-09-20',
      importLicense: 'NK-2023-001234',
      customsClearance: 'CLEARED',
      portOfEntry: 'Cat Lai Port, Ho Chi Minh City',
      inspectionResult: 'PASSED',
      inspector: 'MOH Quality Control Division',
    },
    distribution: [
      {
        id: 1,
        type: 'warehouse_receipt',
        location: 'PharmaChain Central Warehouse, District 12, HCMC',
        coordinates: { lat: 10.8626, lng: 106.6120 },
        date: '2023-09-22',
        handler: 'Tran Van Kho',
        notes: 'Received into cold storage — Section A1-01',
        verified: true,
      },
      {
        id: 2,
        type: 'quality_check',
        location: 'QC Lab — PharmaChain HCMC',
        coordinates: { lat: 10.8626, lng: 106.6120 },
        date: '2023-09-23',
        handler: 'Dr. Nguyen Thi Lan (QC Manager)',
        notes: 'Batch sampling passed. Certificate of Analysis issued.',
        verified: true,
      },
      {
        id: 3,
        type: 'warehouse_transfer',
        location: 'Regional DC — Binh Duong Hub',
        coordinates: { lat: 10.9804, lng: 106.6519 },
        date: '2023-10-05',
        handler: 'Le Van Chuyen',
        notes: 'Transferred to distribution center for South region',
        verified: true,
      },
      {
        id: 4,
        type: 'retail_dispatch',
        location: 'PharmaChain Store #47 — Nguyen Hue, District 1',
        coordinates: { lat: 10.7769, lng: 106.7009 },
        date: '2023-10-12',
        handler: 'Pham Thi Duoc',
        notes: 'Dispatched to retail — shelf placement confirmed',
        verified: true,
      },
    ],
    verification: {
      isAuthentic: true,
      blockchainHash: '0x4a3f2c1b9e8d7a6f5c4b3a2f1e0d9c8b7a6f5e4d',
      firstScanDate: '2023-10-13T09:22:14Z',
      lastScanDate: new Date().toISOString(),
      totalScans: 4,
      suspiciousActivity: false,
      mohRegistered: true,
      certificateUrl: '#',
    },
    compliance: {
      mohApproved: true,
      gdpCompliant: true,
      coldChainMaintained: true,
      temperatureLog: '2–8°C maintained throughout',
    },
  },

  'QR-BATCH-0002': {
    code: 'QR-BATCH-0002',
    uid: 'UID-PC-2024-000002',
    status: 'warning',
    scanCount: 28,
    suspiciousScans: true,
    product: {
      id: 2,
      name: 'Paracetamol 500mg',
      brand: 'Pymepharco',
      category: 'Pain Relief',
      image: 'https://placehold.co/200x200/fff7ed/f97316?text=Paracetamol',
      sku: 'PY-PARA-500',
      registrationNumber: 'VN-MOH-2022-11045',
    },
    manufacturing: {
      manufacturer: 'Pymepharco Joint Stock Company',
      country: 'Vietnam',
      facility: 'Phu Yen Factory — GMP-WHO Certified',
      productionDate: '2023-05-10',
      expiryDate: '2025-05-09',
      batchNumber: 'BATCH-0002',
      lotNumber: 'LOT-PY-2305-002',
      gmpCertified: true,
      certificationBody: 'WHO-GMP Vietnam',
    },
    importation: null,
    distribution: [
      {
        id: 1,
        type: 'warehouse_receipt',
        location: 'PharmaChain Central Warehouse, District 12, HCMC',
        coordinates: { lat: 10.8626, lng: 106.6120 },
        date: '2023-05-20',
        handler: 'Tran Van Kho',
        notes: 'Received from local manufacturer',
        verified: true,
      },
      {
        id: 2,
        type: 'retail_dispatch',
        location: 'PharmaChain Store #12 — Le Van Sy, District 3',
        coordinates: { lat: 10.7900, lng: 106.6854 },
        date: '2023-06-01',
        handler: 'Nguyen Van Phuc',
        notes: 'Dispatched to retail outlet',
        verified: true,
      },
    ],
    verification: {
      isAuthentic: true,
      blockchainHash: '0x9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0',
      firstScanDate: '2023-06-02T14:10:00Z',
      lastScanDate: new Date().toISOString(),
      totalScans: 28,
      suspiciousActivity: true,
      suspiciousReason: 'Unusually high scan frequency — 28 scans in 30 days. Possible duplicate QR code in circulation.',
      mohRegistered: true,
    },
    compliance: {
      mohApproved: true,
      gdpCompliant: true,
      coldChainMaintained: false,
      temperatureLog: 'Temperature excursion recorded on 2023-06-15',
    },
  },

  'QR-BATCH-0003': {
    code: 'QR-BATCH-0003',
    uid: 'UID-PC-2024-000003',
    status: 'recalled',
    scanCount: 11,
    suspiciousScans: false,
    product: {
      id: 3,
      name: 'Omega-3 Fish Oil 1000mg',
      brand: 'Nature Made',
      category: 'Vitamins & Supplements',
      image: 'https://placehold.co/200x200/fef2f2/ef4444?text=Omega-3',
      sku: 'NM-OM3-1000',
      registrationNumber: 'VN-MOH-2021-78932',
    },
    manufacturing: {
      manufacturer: 'NatureMade Inc.',
      country: 'USA',
      facility: 'California GMP Facility',
      productionDate: '2022-11-01',
      expiryDate: '2024-11-30',
      batchNumber: 'BATCH-0003',
      lotNumber: 'LOT-NM-2211-003',
      gmpCertified: true,
      certificationBody: 'FDA USA',
    },
    importation: {
      importer: 'MediImport Vietnam',
      importDate: '2023-01-15',
      importLicense: 'NK-2023-000512',
      customsClearance: 'CLEARED',
      portOfEntry: 'Tan Son Nhat Airport',
      inspectionResult: 'PASSED',
    },
    distribution: [
      {
        id: 1,
        type: 'warehouse_receipt',
        location: 'PharmaChain North Warehouse, Hanoi',
        coordinates: { lat: 21.0278, lng: 105.8342 },
        date: '2023-01-20',
        handler: 'Do Thi Hang',
        notes: 'Received into inventory',
        verified: true,
      },
      {
        id: 2,
        type: 'recall_initiated',
        location: 'PharmaChain HQ — Quality Control',
        coordinates: { lat: 10.8626, lng: 106.6120 },
        date: '2024-01-10',
        handler: 'Dr. Pham Van Hung (QA Director)',
        notes: 'RECALL INITIATED — Batch recalled due to potential contamination. Class II recall per MOH directive MOH-2024-RC-001.',
        verified: true,
      },
    ],
    recallInfo: {
      recallId: 'RC-2024-0003',
      recallDate: '2024-01-10',
      severity: 'Class II',
      reason: 'Potential lipid oxidation detected in batch samples — rancidity above acceptable threshold.',
      regulatoryRef: 'MOH-2024-RC-001',
      affectedUnits: 1240,
      recoveredUnits: 987,
      status: 'IN PROGRESS',
      instruction: 'DO NOT USE. Return to purchase location for full refund. Contact 1800-6001 for assistance.',
    },
    verification: {
      isAuthentic: true,
      blockchainHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      firstScanDate: '2023-01-25T08:00:00Z',
      lastScanDate: new Date().toISOString(),
      totalScans: 11,
      suspiciousActivity: false,
      mohRegistered: true,
    },
    compliance: { mohApproved: false, gdpCompliant: true, coldChainMaintained: true },
  },

  'FAKE-001': {
    code: 'FAKE-001',
    status: 'fake',
    scanCount: 1,
    product: { name: 'Unknown Product', brand: 'Unknown' },
    verification: {
      isAuthentic: false,
      suspiciousActivity: true,
      mohRegistered: false,
      totalScans: 1,
    },
  },
}

export const traceService = {
  async traceCode(code) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 1200))
      const key = code.trim().toUpperCase()
      // Try exact match first, then partial
      const result = MOCK_TRACES[code.trim()] || MOCK_TRACES[key]
      if (!result) {
        // Check if it looks like a valid code format but not found
        const validFormat = /^(QR|UID|BATCH|PC)-/i.test(code)
        if (validFormat) throw new Error('CODE_NOT_FOUND')
        throw new Error('INVALID_CODE')
      }
      return result
    }
    const { data } = await apiClient.get(`/trace/${encodeURIComponent(code.trim())}`)
    return data
  },

  async reportSuspicious(code, reason) {
    if (env.USE_MOCK) {
      await new Promise(r => setTimeout(r, 500))
      return { reported: true }
    }
    const { data } = await apiClient.post(`/trace/${code}/report`, { reason })
    return data
  },
}

export const DEMO_CODES = [
  { code: 'QR-BATCH-0001', label: '✅ Authentic product',   color: 'green'  },
  { code: 'QR-BATCH-0002', label: '⚠️ Suspicious activity', color: 'orange' },
  { code: 'QR-BATCH-0003', label: '🚨 Recalled batch',       color: 'red'    },
  { code: 'FAKE-001',      label: '❌ Counterfeit product',  color: 'red'    },
]
