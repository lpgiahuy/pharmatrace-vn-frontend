import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, Plus, Minus, ChevronRight } from 'lucide-react'
import { productService } from '@/services/product.service'
import { wishlistService } from '@/services/wishlist.service'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { PageLoader } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, cn } from '@/utils'

/**
 * Helper component to safely render content that might be a string (HTMl), 
 * an array, or a nested object. Avoids "Objects are not valid as a React child" crash.
 */
function RenderSafeContent({ content, className = "text-base text-slate-700 leading-relaxed font-medium" }) {
  if (!content) return null

  if (typeof content === 'string') {
    // If it looks like HTML, use dangerouslySetInnerHTML, otherwise plain text with line breaks
    if (content.includes('<') && content.includes('>')) {
      return <div className={`prose prose-sm max-w-none font-medium ${className}`} dangerouslySetInnerHTML={{ __html: content }} />
    }
    return <p className={`${className} whitespace-pre-line`}>{content}</p>
  }

  if (Array.isArray(content)) {
    return (
      <ul className={`list-disc pl-6 space-y-2 ${className}`}>
        {content.map((item, i) => (
          <li key={i}>
            {typeof item === 'object' ? <RenderSafeContent content={item} className="mt-1" /> : item}
          </li>
        ))}
      </ul>
    )
  }

  if (typeof content === 'object') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Object.entries(content).map(([key, val]) => {
          if (!val || (typeof val === 'string' && val.trim() === '')) return null
          const labelMapping = {
            'lieu_dung': 'Liều dùng & Cách dùng',
            'cach_dung': 'Cách dùng',
            'qua_lieu_va_xu_tri': 'Quá liều và cách xử lí',
            'xu_tri': 'Cách xử lí',
            'trieu_chung': 'Triệu chứng',
            'quen_lieu': 'Quên liều',
            'huong_dan_su_dung': 'Hướng dẫn sử dụng',
          }
          const label = labelMapping[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

          return (
            <div key={key} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">{label}</h4>
              <RenderSafeContent content={val} className="text-base text-slate-700 leading-relaxed font-medium" />
            </div>
          )
        })}
      </div>
    )
  }

  return <div className={className}>{String(content)}</div>
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [qty, setQty]         = useState(1)
  const [activeTab, setActiveTab] = useState('thanh_phan')
  
  const addItem = useCartStore(s => s.addItem)
  const user = useAuthStore(s => s.user)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    setLoading(true)
    productService.getById(id)
      .then(res => {
        setProduct(res)
        setIsFavorite(res.isFavorited)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào yêu thích!')
      return
    }
    if (isToggling) return
    
    setIsToggling(true)
    const prev = isFavorite
    setIsFavorite(!prev)
    
    try {
      const res = await wishlistService.toggle(product.id)
      setIsFavorite(res.isFavorited)
    } catch (e) {
      setIsFavorite(prev)
      console.error('Toggle favorite failed', e)
    } finally {
      setIsToggling(false)
    }
  }

  if (loading) return <PageLoader />
  if (error || !product) return <div className="page-container py-16"><ErrorState error={error} /></div>

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-800 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-slate-50 border border-surface-border overflow-hidden flex items-center justify-center p-8">
            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
          {discount > 0 && (
            <div className="flex gap-2">
              <span className="badge-red px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">-{discount}% OFF</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-brand-500 font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
              ))}
            </div>
            <span className="text-sm text-slate-500">{Number(product.rating).toFixed(1)} ({product.reviewCount} đánh giá)</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500">Đã bán {product.soldCount}</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-display font-bold text-brand-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {product.inStock ? (
              <Badge color="green">Còn hàng {product.totalStock !== null && `(${product.totalStock})`}</Badge>
            ) : (
              <Badge color="red">Hết hàng</Badge>
            )}
            {product.isPrescription && <Badge color="orange">Thuốc kê đơn</Badge>}
            {product.tags?.map(tag => <Badge key={tag} color="blue">{tag}</Badge>)}
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 border border-surface-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-slate-100 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-3 hover:bg-slate-100 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              size="lg"
              disabled={!product.inStock}
              onClick={() => addItem(product, qty)}
              leftIcon={<ShoppingCart className="w-5 h-5" />}
              className="flex-1"
            >
              {product.inStock ? 'Add to Cart' : 'Hết hàng'}
            </Button>
            <button 
              onClick={handleToggleFavorite}
              disabled={isToggling}
              className={cn(
                "p-3 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50",
                isFavorite 
                  ? "bg-red-50 border-red-200 text-red-500 shadow-sm" 
                  : "border-surface-border hover:bg-slate-50 text-slate-400"
              )}
            >
              <Heart className={cn("w-5 h-5 transition-colors", isFavorite && "fill-current")} />
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl">
            {[
              { icon: Shield, label: 'Authentic',    sub: 'MOH certified' },
              { icon: Truck,  label: 'Fast Delivery', sub: 'Same-day option' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '7-day policy' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="w-5 h-5 text-brand-500" />
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-[10px] text-slate-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* Batch info */}
          <div className="mt-4 text-xs text-slate-400 space-y-0.5">
            <p>Batch: <span className="font-mono text-slate-600">{product.batchNumber}</span></p>
            <p>Expires: <span className="text-slate-600">{formatDate(product.expiryDate)}</span></p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-surface-border bg-slate-50/50">
          <h2 className="text-xl font-display font-bold text-slate-900">Mô tả sản phẩm</h2>
        </div>
        <div className="flex border-b border-surface-border overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'thanh_phan', label: 'Thành phần', keys: ['thanh_phan_chi_tiet', 'ingredients', 'thanh_phan'] },
            { id: 'chi_dinh', label: 'Chỉ định', keys: ['mo_ta_chung', 'chi_dinh', 'cong_dung'] },
            { id: 'cach_su_dung', label: 'Cách Sử Dụng', keys: ['huong_dan_su_dung', 'cach_su_dung'] },
            { id: 'than_trong', label: 'Thận trọng', keys: ['than_trong', 'tac_dung_phu', 'canh_bao_than_trong', 'chong_chi_dinh', 'nhom_benh_nhan_dac_biet'] },
            { id: 'thong_tin_san_xuat', label: 'Thông tin sản xuất', keys: ['thong_tin_san_xuat'] },
            { id: 'reviews', label: 'Đánh giá', keys: [] },
          ].filter(t => 
            t.id === 'reviews' || 
            (product.chi_tiet_thuoc && t.keys.some(k => product.chi_tiet_thuoc[k])) ||
            (t.id === 'chi_dinh' && product.description)
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-5 text-base font-bold whitespace-nowrap transition-all relative ${
                activeTab === tab.id 
                  ? 'text-brand-600 underline-offset-8' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 animate-in slide-in-from-left-full duration-300" />
              )}
            </button>
          ))}
        </div>
        <div className="p-10">
          {activeTab === 'thanh_phan' && (
            <div className="space-y-8">
              {product.chi_tiet_thuoc?.thanh_phan_chi_tiet?.hoat_chat && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    Hoạt chất
                  </h3>
                  <RenderSafeContent content={product.chi_tiet_thuoc.thanh_phan_chi_tiet.hoat_chat} className="text-base text-slate-700 leading-relaxed font-medium pl-3.5" />
                </section>
              )}
              {product.chi_tiet_thuoc?.thanh_phan_chi_tiet?.ta_duoc && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Tá dược
                  </h3>
                  <RenderSafeContent content={product.chi_tiet_thuoc.thanh_phan_chi_tiet.ta_duoc} className="text-base text-slate-700 leading-relaxed pl-3.5" />
                </section>
              )}
              {(product.chi_tiet_thuoc?.ingredients || product.chi_tiet_thuoc?.thanh_phan) && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    Chi tiết thành phần
                  </h3>
                  <div className="pl-3.5">
                    <RenderSafeContent content={product.chi_tiet_thuoc?.ingredients || product.chi_tiet_thuoc?.thanh_phan} className="text-base text-slate-700 leading-relaxed font-medium" />
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'chi_dinh' && (
            <div className="text-base text-slate-700 leading-relaxed font-medium">
              <RenderSafeContent content={product.chi_tiet_thuoc?.mo_ta_chung || product.chi_tiet_thuoc?.chi_dinh || product.chi_tiet_thuoc?.cong_dung || product.description} />
            </div>
          )}

          {activeTab === 'cach_su_dung' && (
            <div className="space-y-6">
              {product.chi_tiet_thuoc?.huong_dan_su_dung ? (
                <RenderSafeContent content={product.chi_tiet_thuoc.huong_dan_su_dung} />
              ) : (
                <RenderSafeContent content={product.chi_tiet_thuoc?.cach_su_dung} />
              )}
            </div>
          )}

          {activeTab === 'than_trong' && (
            <div className="space-y-8">
              {product.chi_tiet_thuoc?.chong_chi_dinh && (
                <section className="p-5 bg-red-50/50 rounded-2xl border border-red-100 shadow-sm">
                  <h3 className="text-base font-bold text-red-900 mb-2.5 flex items-center gap-2">
                    🚫 Chống chỉ định
                  </h3>
                  <div className="text-red-800 font-medium">
                    <RenderSafeContent content={product.chi_tiet_thuoc.chong_chi_dinh} className="text-base leading-relaxed" />
                  </div>
                </section>
              )}
              {(product.chi_tiet_thuoc?.canh_bao_than_trong || product.chi_tiet_thuoc?.than_trong) && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Cảnh báo & Thận trọng</h3>
                  <div className="pl-3.5">
                    <RenderSafeContent content={product.chi_tiet_thuoc?.canh_bao_than_trong || product.chi_tiet_thuoc?.than_trong} />
                  </div>
                </section>
              )}
              {product.chi_tiet_thuoc?.tac_dung_phu && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Tác dụng phụ</h3>
                  <div className="pl-3.5">
                    <RenderSafeContent content={product.chi_tiet_thuoc.tac_dung_phu} className="text-base text-slate-700 leading-relaxed font-medium" />
                  </div>
                </section>
              )}
              {product.chi_tiet_thuoc?.tuong_tac_thuoc && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Tương tác thuốc</h3>
                  {Array.isArray(product.chi_tiet_thuoc.tuong_tac_thuoc) ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                      <table className="w-full text-base text-left">
                        <thead className="bg-slate-50 text-slate-900 font-bold">
                          <tr>
                            <th className="px-5 py-3 border-b">Thuốc/Thực phẩm</th>
                            <th className="px-5 py-3 border-b">Hậu quả</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                          {product.chi_tiet_thuoc.tuong_tac_thuoc.map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-3 text-slate-900 font-bold">{item.thuoc}</td>
                              <td className="px-5 py-3 text-slate-700">{item.hau_qua}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                      {product.chi_tiet_thuoc.tuong_tac_thuoc}
                    </p>
                  )}
                </section>
              )}
              {product.chi_tiet_thuoc?.nhom_benh_nhan_dac_biet && (
                <section>
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-brand-500 rounded-full" />
                    Nhóm bệnh nhân đặc biệt
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {typeof product.chi_tiet_thuoc.nhom_benh_nhan_dac_biet === 'object' && !Array.isArray(product.chi_tiet_thuoc.nhom_benh_nhan_dac_biet) ? (
                      Object.entries(product.chi_tiet_thuoc.nhom_benh_nhan_dac_biet)
                        .filter(([_, val]) => val && String(val).trim() !== '')
                        .map(([key, val]) => {
                          const labels = {
                            phu_nu_mang_thai: 'Phụ nữ mang thai',
                            phu_nu_cho_con_bu: 'Phụ nữ cho con bú',
                            tre_em: 'Trẻ em',
                            nguoi_cao_tuoi: 'Người cao tuổi',
                            suy_than: 'Suy thận',
                            suy_gan: 'Suy gan',
                          }
                          const label = labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

                          return (
                            <div key={key} className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                              <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2.5">
                                {label}
                              </h4>
                                <RenderSafeContent content={val} className="text-base text-slate-800 leading-relaxed font-bold" />
                            </div>
                          )
                        })
                    ) : (
                      <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 col-span-2">
                        <p className="text-base text-slate-700 leading-relaxed font-medium">
                          {String(product.chi_tiet_thuoc.nhom_benh_nhan_dac_biet)}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'thong_tin_san_xuat' && product.chi_tiet_thuoc?.thong_tin_san_xuat && (
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { label: 'Thương hiệu', value: product.chi_tiet_thuoc.thong_tin_san_xuat.thuong_hieu, icon: '🏷️' },
                { label: 'Nhà sản xuất', value: product.chi_tiet_thuoc.thong_tin_san_xuat.nha_san_xuat, icon: '🏭' },
                { label: 'Xuất xứ', value: product.chi_tiet_thuoc.thong_tin_san_xuat.xuat_xu, icon: '📍' },
                { label: 'Quy cách đóng gói', value: product.chi_tiet_thuoc.thong_tin_san_xuat.quy_cach, icon: '📦' },
                { label: 'Bảo quản', value: product.chi_tiet_thuoc.thong_tin_san_xuat.bao_quan, icon: '🌡️' },
              ].filter(i => i.value).map(item => (
                <div key={item.label} className="flex items-start gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:bg-brand-50 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className="text-base font-bold text-slate-900 leading-tight">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-slate-500 text-base py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 font-medium">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
