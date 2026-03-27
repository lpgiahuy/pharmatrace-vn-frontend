import { useState, useRef } from 'react'
import { Button as AButton, Card, Descriptions, Tag, Alert } from 'antd'
import { QrcodeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { warehouseService } from '@/services/warehouse.service'
import { InlineLoader } from '@/components/ui/Spinner'
import { StockBadge } from '@/components/ui/Badge'
import { formatDate } from '@/utils'
import toast from 'react-hot-toast'

export default function ScannerPage() {
  const [manualCode, setManualCode] = useState('')
  const [scanning, setScanning]   = useState(false)
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const handleScan = async (code) => {
    if (!code?.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await warehouseService.scanQR(code.trim())
      setResult(data)
      toast.success('QR code scanned successfully')
    } catch (err) {
      setError('No inventory found for this QR code.')
      toast.error('Scan failed')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSearch = () => handleScan(manualCode)

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
          <QrcodeOutlined /> QR Code Scanner
        </h1>
        <p className="text-slate-500 text-sm mt-1">Scan a product QR code to view inventory details</p>
      </div>

      {/* Camera scanner placeholder */}
      <Card title="Camera Scanner">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50 mb-4">
          <QrcodeOutlined className="text-5xl text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium mb-1">Point camera at QR code</p>
          <p className="text-xs text-slate-400 mb-4">Camera access required for live scanning</p>
          <AButton
            type="primary"
            icon={<QrcodeOutlined />}
            onClick={() => toast('Camera scanning requires HTTPS and browser permission', { icon: 'ℹ️' })}
          >
            Start Camera Scan
          </AButton>
        </div>

        {/* Manual entry */}
        <div className="flex gap-2">
          <input
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
            placeholder="Or enter QR code manually…"
            className="input flex-1"
          />
          <AButton
            type="primary"
            icon={<SearchOutlined />}
            loading={loading}
            onClick={handleManualSearch}
          >
            Look Up
          </AButton>
        </div>

        {/* Demo buttons */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <p className="text-xs text-slate-400 w-full">Demo scan:</p>
          {['QR-BATCH-0001', 'QR-BATCH-0002', 'QR-BATCH-0003'].map(code => (
            <AButton key={code} size="small" onClick={() => { setManualCode(code); handleScan(code) }}>
              {code}
            </AButton>
          ))}
        </div>
      </Card>

      {loading && <InlineLoader text="Scanning…" />}

      {error && <Alert message={error} type="error" showIcon />}

      {result && (
        <Card
          title={<span className="flex items-center gap-2"><QrcodeOutlined className="text-brand-500" /> Scan Result</span>}
          extra={<AButton size="small" icon={<ReloadOutlined />} onClick={() => setResult(null)}>Clear</AButton>}
          className="border-brand-200"
        >
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Product">{result.productName}</Descriptions.Item>
            <Descriptions.Item label="Batch Number"><span className="font-mono">{result.batchNumber}</span></Descriptions.Item>
            <Descriptions.Item label="Location"><Tag color="blue">{result.location}</Tag></Descriptions.Item>
            <Descriptions.Item label="Quantity">
              <span className="font-bold">{result.quantity}</span>
              &nbsp;<span className="text-slate-400 text-xs">({result.reserved} reserved)</span>
            </Descriptions.Item>
            <Descriptions.Item label="Stock Status">
              <StockBadge quantity={result.quantity} />
            </Descriptions.Item>
            <Descriptions.Item label="Expiry Date">{formatDate(result.expiryDate)}</Descriptions.Item>
            <Descriptions.Item label="Supplier">{result.supplierName}</Descriptions.Item>
            <Descriptions.Item label="QR Code"><span className="font-mono text-xs">{result.qrCode}</span></Descriptions.Item>
            <Descriptions.Item label="Scanned At">{result.scannedAt ? new Date(result.scannedAt).toLocaleString() : 'Just now'}</Descriptions.Item>
          </Descriptions>

          <div className="mt-4 flex gap-2">
            <AButton type="primary" size="small">View Full Details</AButton>
            <AButton size="small">Update Location</AButton>
            <AButton size="small" danger>Flag for Inspection</AButton>
          </div>
        </Card>
      )}
    </div>
  )
}
