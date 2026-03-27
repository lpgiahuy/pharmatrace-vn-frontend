import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, CheckCircle2 } from 'lucide-react'
import { userService } from '@/services/user.service'
import { Button } from '@/components/ui/Button'
import { InlineLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/utils'
import toast from 'react-hot-toast'

export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { userService.getPrescriptions().then(setPrescriptions).finally(() => setLoading(false)) }, [])

  const onDrop = useCallback(async (files) => {
    if (!files[0]) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', files[0])
      const rx = await userService.uploadPrescription(fd)
      setPrescriptions(prev => [rx, ...prev])
      toast.success('Prescription uploaded successfully!')
    } catch { toast.error('Upload failed. Please try again.') }
    finally { setUploading(false) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [], 'application/pdf': [] }, maxFiles: 1 })

  return (
    <div className="page-container py-8 max-w-2xl animate-fade-in">
      <h1 className="section-title mb-6">My Prescriptions</h1>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors mb-6 ${isDragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="font-semibold text-slate-700 mb-1">Drop your prescription here</p>
        <p className="text-sm text-slate-500">or click to browse • PDF, JPG, PNG supported</p>
        {uploading && <InlineLoader text="Uploading…" />}
      </div>
      {loading ? <InlineLoader /> : prescriptions.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No prescriptions uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center"><FileText className="w-5 h-5 text-brand-500" /></div>
              <div className="flex-1"><p className="font-medium text-slate-800">{rx.filename || `Prescription ${i + 1}`}</p><p className="text-xs text-slate-500">{formatDate(rx.uploadedAt)}</p></div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
