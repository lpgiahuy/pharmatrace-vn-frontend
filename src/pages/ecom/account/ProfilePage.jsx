import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Edit3, Save, X, ChevronRight, Award, Trophy, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth.service'
import { Avatar } from '@/components/ui/Avatar'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loyalty, setLoyalty] = useState(null)
  
  const [formData, setFormData] = useState({
    ho_ten: user?.ho_ten || user?.name || '',
    email: user?.email || '',
    dia_chi_mac_dinh: user?.dia_chi_mac_dinh || user?.address || ''
  })

  useEffect(() => {
    // Sync if user data changes in store
    setFormData({
      ho_ten: user?.ho_ten || user?.name || '',
      email: user?.email || '',
      dia_chi_mac_dinh: user?.dia_chi_mac_dinh || user?.address || ''
    })

    // Fetch loyalty progress
    authService.getLoyaltyProgress()
      .then(res => setLoyalty(res))
      .catch(err => console.error('Error fetching loyalty:', err))
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedUser = await authService.updateProfile(formData)
      updateUser(updatedUser)
      setIsEditing(false)
      toast.success('Cập nhật thông tin thành công!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật')
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'bạc': return 'from-slate-300 to-slate-500 text-slate-900 border-slate-200'
      case 'vàng': return 'from-amber-300 to-amber-600 text-amber-950 border-amber-200'
      case 'bạch kim': return 'from-indigo-300 to-indigo-600 text-indigo-950 border-indigo-200'
      default: return 'from-orange-300 to-orange-600 text-orange-950 border-orange-200' // Đồng
    }
  }

  const getTierIcon = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'bạc': return <Award className="w-8 h-8" />
      case 'vàng': return <Trophy className="w-8 h-8" />
      case 'bạch kim': return <Star className="w-8 h-8" />
      default: return <Award className="w-8 h-8" />
    }
  }

  return (
    <div className="page-container py-10 max-w-4xl mx-auto animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-brand-500 transition-colors">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/account" className="hover:text-brand-500 transition-colors">Tài khoản</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-bold uppercase tracking-wider text-xs">Thông tin cá nhân</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Card & Loyalty */}
        <div className="lg:col-span-5 space-y-6">
          {/* Virtual Membership Card */}
          <div className={`relative overflow-hidden rounded-[2rem] p-8 shadow-2xl border-4 transition-all duration-500 bg-gradient-to-br ${getTierColor(user?.hang_thanh_vien)}`}>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">PharmaChain Card</p>
                    <p className="text-sm font-bold opacity-90">Member Rewards</p>
                  </div>
                </div>
                {getTierIcon(user?.hang_thanh_vien)}
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-1 leading-none">Chủ thẻ</p>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">{user?.ho_ten || user?.name}</h3>
                <p className="text-sm font-black mt-2 tracking-widest opacity-80">{user?.so_dien_thoai?.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}</p>
              </div>

              <div className="flex justify-between items-end mt-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Hạng thẻ</p>
                    <p className="text-lg font-black uppercase leading-none">{user?.hang_thanh_vien || 'Thành viên'}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Điểm hiện tại</p>
                    <p className="text-xl font-black leading-none">{user?.diem_tich_luy || 0} <span className="text-[10px]">pts</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Progress */}
          {loyalty && loyalty.hang_tiep_theo && (
            <div className="card p-6 border-brand-100 bg-brand-50/30">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Tiến trình hạng {loyalty.hang_tiep_theo}</h4>
                    <span className="px-3 py-1 bg-brand-100 text-brand-600 rounded-full text-[10px] font-black uppercase">Thiếu {loyalty.diem_con_thieu}đ</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div 
                        className="h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(100, (user?.diem_tich_luy / (user?.diem_tich_luy + loyalty.diem_con_thieu)) * 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{user?.hang_thanh_vien}</span>
                    <span>{loyalty.hang_tiep_theo}</span>
                </div>
            </div>
          )}
        </div>

        {/* Right Column: Personal Information Form */}
        <div className="lg:col-span-7">
          <div className="card p-8 border-none shadow-xl bg-white relative">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Thông tin cá nhân</h2>
                    <p className="text-slate-400 text-xs font-bold leading-none mt-1 uppercase tracking-widest">Cập nhật thông tin để nhận thêm ưu đãi</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-brand-500 hover:bg-brand-50'}`}
              >
                {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-8">
              {/* Full Name */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-brand-500 transition-colors">
                  Họ và tên
                </label>
                <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus-within:border-brand-100 focus-within:bg-white transition-all group">
                  <User className="w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                  {isEditing ? (
                    <input 
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none focus:outline-none p-0 focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300"
                      value={formData.ho_ten}
                      onChange={e => setFormData({...formData, ho_ten: e.target.value})}
                      placeholder="Nhập họ và tên..."
                    />
                  ) : (
                    <span className="text-slate-800 font-bold">{user?.ho_ten || user?.name || 'Chưa cập nhật'}</span>
                  )}
                </div>
              </div>

              {/* Phone Number (Read-only usually) */}
              <div className="group opacity-70">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Số điện thoại
                </label>
                <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-slate-100 border-2 border-transparent cursor-not-allowed">
                  <Phone className="w-5 h-5 text-slate-300" />
                  <span className="text-slate-800 font-bold">{user?.so_dien_thoai || 'Chưa cập nhật'}</span>
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-brand-500 transition-colors">
                  Địa chỉ Email
                </label>
                <div className="flex items-center gap-4 py-3 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus-within:border-brand-100 focus-within:bg-white transition-all group">
                  <Mail className="w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
                  {isEditing ? (
                    <input 
                      type="email"
                      className="flex-1 bg-transparent border-none outline-none focus:outline-none p-0 focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="example@gmail.com"
                    />
                  ) : (
                    <span className="text-slate-800 font-bold">{user?.email || 'Chưa cập nhật'}</span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-focus-within:text-brand-500 transition-colors">
                  Địa chỉ mặc định
                </label>
                <div className="flex items-start gap-4 py-3 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus-within:border-brand-100 focus-within:bg-white transition-all group">
                  <MapPin className="w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors mt-0.5" />
                  {isEditing ? (
                    <textarea 
                      className="flex-1 bg-transparent border-none outline-none focus:outline-none p-0 focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300 resize-none min-h-[80px]"
                      value={formData.dia_chi_mac_dinh}
                      onChange={e => setFormData({...formData, dia_chi_mac_dinh: e.target.value})}
                      placeholder="Nhập địa chỉ của bạn..."
                    />
                  ) : (
                    <span className="text-slate-800 font-bold leading-relaxed">{user?.dia_chi_mac_dinh || user?.dia_chi || 'Chưa cập nhật'}</span>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6">
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-4 bg-brand-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-brand-600 transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner size="sm" /> : <Save className="w-5 h-5" />}
                        Lưu thông tin
                    </button>
                </div>
              )}
            </div>
            
            {!isEditing && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Trạng thái xác thực: Tài khoản đã được xác minh</span>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-component Helper
const Pill = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 3l9 9-9 9-9-9 9-9zM3 13l9-9 2 2-7 7 7 7-2 2-9-9z" fillOpacity="0.3"/>
    <path d="M12 2L2 12l10 10L22 12 12 2zm0 2.828L19.172 12 12 19.172 4.828 12 12 4.828z" />
  </svg>
)

const Spinner = ({ size = 'md' }) => {
    const s = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8'
    return <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${s}`}></div>
}
