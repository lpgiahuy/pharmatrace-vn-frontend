import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, HeartPulse, Award, ShieldCheck, Eye } from 'lucide-react'
import { productService } from '@/services/product.service'
import { blogService } from '@/services/analytics.service'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { useCategoryStore } from '@/store/categoryStore'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const [featured, setFeatured] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogLoading, setBlogLoading] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)
  const categories = useCategoryStore(s => s.categories)

  const BANNERS = [
    { id: 1, title: t('home.banner1_title', { defaultValue: 'Trusted Medicines, Delivered Fast' }), subtitle: t('home.banner1_desc', { defaultValue: 'Shop 10,000+ certified pharmaceutical products' }), cta: t('home.shop_now'), to: '/products', bg: 'from-brand-600 to-brand-800', img: '💊', image: 'https://wallpapercave.com/wp/wp15262378.jpg' },
    { id: 2, title: t('home.banner2_title', { defaultValue: 'Vitamins & Supplements Sale' }), subtitle: t('home.banner2_desc', { defaultValue: 'Up to 30% off premium health supplements' }), cta: t('home.view_deals', { defaultValue: 'View Deals' }), to: '/products?category=1', bg: 'from-teal-500 to-teal-700', img: '🌿', image: 'https://wallpapercave.com/wp/wp14241262.jpg' },
    { id: 3, title: t('home.banner3_title', { defaultValue: 'Free Delivery Over 500K' }), subtitle: t('home.banner3_desc', { defaultValue: 'Fast, secure pharmaceutical delivery' }), cta: t('home.start_shopping', { defaultValue: 'Start Shopping' }), to: '/products', bg: 'from-purple-600 to-purple-800', img: '🚚', image: 'https://wallpapercave.com/wp/wp13751014.jpg' },
  ]

  const TRUST_ITEMS = [
    { icon: Shield,     label: t('home.trust1_label', { defaultValue: 'GMP Certified' }),     desc: t('home.trust1_desc', { defaultValue: 'Ministry of Health approved' }) },
    { icon: Truck,      label: t('home.trust2_label', { defaultValue: 'Fast Delivery' }),      desc: t('home.trust2_desc', { defaultValue: 'Same-day for orders before 3pm' }) },
    { icon: HeartPulse, label: t('home.trust3_label', { defaultValue: 'Expert Pharmacists' }), desc: t('home.trust3_desc', { defaultValue: 'Free consultation anytime' }) },
    { icon: Award,      label: t('home.trust4_label', { defaultValue: 'Authentic Products' }), desc: t('home.trust4_desc', { defaultValue: '100% genuine pharmaceuticals' }) },
  ]

  useEffect(() => {
    productService.getFeatured(20)
      .then(res => {
        const all = Array.isArray(res) ? res : []
        const seen = new Map()
        all.forEach(p => {
          const existing = seen.get(p.id)
          if (!existing || p.price < existing.price) seen.set(p.id, p)
        })
        setFeatured(Array.from(seen.values()))
      })
      .catch(err => {
        console.error('[HomePage] Failed to load featured products:', err)
        setFeatured([])
      })
      .finally(() => setLoading(false))

    setBlogLoading(true)
    blogService.getAll({ limit: 3 })
      .then(res => setBlogs(res.data || []))
      .catch(err => console.error('[HomePage] Failed to load blogs:', err))
      .finally(() => setBlogLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveBanner(b => (b + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [BANNERS.length])

  return (
    <div className="animate-fade-in bg-surface pb-12">
      {/* Hero Section */}
      <section className="bg-white pb-6 pt-4">
        <div className="page-container">
          <div>
            {/* Main Slider */}
            <div className="relative group overflow-hidden rounded-2xl shadow-sm h-[200px] md:h-[320px] lg:h-[380px]">
              <div 
                className={`w-full h-full ${!BANNERS[activeBanner].image ? `bg-gradient-to-br ${BANNERS[activeBanner].bg}` : 'bg-cover bg-center'} transition-all duration-700 flex items-center px-12 text-white relative`}
                style={BANNERS[activeBanner].image ? { backgroundImage: `url(${BANNERS[activeBanner].image})` } : {}}
              >
                {/* Overlay for image clarity */}
                {BANNERS[activeBanner].image && <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[2px]" />}
                
                <div className="max-w-md relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">{t('home.exclusive_offers')}</span>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{BANNERS[activeBanner].title}</h2>
                  <p className="text-lg text-white/90 mb-8 hidden md:block line-clamp-2">{BANNERS[activeBanner].subtitle}</p>
                  <Link to={BANNERS[activeBanner].to} className="inline-flex items-center gap-2 bg-white text-brand-600 font-black px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-all shadow-xl shadow-brand-900/10">
                    {BANNERS[activeBanner].cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                {!BANNERS[activeBanner].image && (
                  <div className="hidden md:flex flex-1 justify-center text-[180px] opacity-20 transform translate-x-12 rotate-12">
                    {BANNERS[activeBanner].img}
                  </div>
                )}
              </div>
              
              {/* Slider Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
                {BANNERS.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveBanner(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeBanner ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Bar */}
      <section className="bg-white border-b border-surface-border">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_ITEMS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{label}</p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="page-container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">{t('home.featured_categories')}</h2>
          <Link to="/products" className="text-sm text-brand-500 font-black hover:underline uppercase">{t('home.view_all')}</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-8 gap-x-4">
          {categories.slice(0, 8).map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="flex flex-col items-center gap-3 transition-transform duration-200 hover:-translate-y-1 group"
            >
              <div className="w-20 h-20 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-3xl group-hover:border-brand-200 group-hover:shadow-md transition-all">
                {cat.icon}
              </div>
              <span className="text-[13px] font-bold text-slate-700 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="page-container mb-12">
        <div className="bg-medical-red rounded-2xl overflow-hidden shadow-xl shadow-medical-red/10">
          <div className="bg-medical-red px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase italic">{t('home.flash_sale')}</h2>
              <div className="flex items-center gap-2 text-white">
                <span className="bg-black/20 px-2 py-1 rounded-md font-bold tabular-nums">04</span> :
                <span className="bg-black/20 px-2 py-1 rounded-md font-bold tabular-nums">24</span> :
                <span className="bg-black/20 px-2 py-1 rounded-md font-bold tabular-nums">59</span>
              </div>
            </div>
            <Link to="/products" className="text-white text-xs font-black uppercase hover:underline">{t('home.low_stock')}</Link>
          </div>
          <div className="bg-white p-4">
            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
              {featured.slice(0, 6).map(p => (
                <div key={p.id} className="min-w-[180px] max-w-[200px]">
                  <ProductCard product={p} className="border-none shadow-none hover:shadow-none translate-y-0" />
                  <div className="mt-2 px-3">
                    <div className="h-4 bg-red-100 rounded-full relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-medical-red to-orange-400 w-[60%] rounded-full" />
                        <span className="absolute inset-0 text-[10px] font-black text-white flex items-center justify-center uppercase">{t('home.selling_fast')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="page-container mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h2 className="section-title">{t('home.recommended')}</h2>
                <div className="flex items-center gap-6">
                    {['Sức khỏe', 'Làm đẹp', 'Vitamin'].map(tab => (
                        <button key={tab} className="text-sm font-bold text-slate-400 hover:text-brand-500 transition-colors uppercase tracking-widest">{tab}</button>
                    ))}
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        : featured.slice(0, 10).map(p => <ProductCard key={p?.id || p?._id} product={p} />)
                    }
                </div>
                {!loading && featured.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <Link to="/products" className="px-12 py-3.5 bg-white border-2 border-brand-500 text-brand-600 font-black rounded-xl hover:bg-brand-50 transition-all uppercase tracking-widest text-sm shadow-xl shadow-brand-100/50">
                            {t('home.view_all')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Health Blog Section */}
      <section className="page-container pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">{t('home.health_handbook')}</h2>
          <Link to="/blog" className="text-sm text-brand-500 font-black hover:underline uppercase">{t('home.view_all_posts')}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map(blog => (
            <Link key={blog.id} to={`/blog/${blog.id}`} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 card-hover group">
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block">{blog.category || 'Sức khỏe'}</span>
              <h3 className="text-[15px] font-black text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 leading-tight">
                {blog.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                {blog.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400">{blog.author} · {new Date(blog.publishedAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                   <Eye className="w-3 h-3" /> {blog.views?.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Secure Traceability Section */}
      <section className="page-container pb-12">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl overflow-hidden shadow-2xl shadow-brand-900/20 relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-brand-100 text-[10px] font-bold uppercase tracking-widest mb-6">
                <ShieldCheck className="w-4 h-4 text-medical-green" /> {t('home.guaranteed_authentic')}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
                {t('home.traceability')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{t('home.absolute_transparency')}</span>
              </h2>
              <p className="text-lg text-brand-100/90 mb-8 max-w-lg">
                {t('home.trace_desc')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group/input">
                    <input 
                        placeholder={t('home.uid_placeholder')}
                        className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all font-mono"
                    />
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within/input:text-brand-300 transition-colors" />
                </div>
                <Link to="/trace" className="h-14 px-8 bg-medical-green hover:bg-green-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-900/20 whitespace-nowrap uppercase">
                  {t('home.check_now')} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-[11px] font-bold text-brand-200 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {t('home.transparency')}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {t('home.security')}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {t('home.tamper_proof')}</span>
              </div>
            </div>
            
            <div className="relative shrink-0 w-full sm:w-72 lg:w-80 h-72 lg:h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 border border-white/10" />
                <div className="absolute inset-0 bg-white/10 rounded-3xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500 border border-white/10" />
                <div className="relative z-10 w-full h-full bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center">
                    <div className="w-full aspect-square border-4 border-slate-50 flex items-center justify-center rounded-2xl mb-4 relative overflow-hidden group/qr">
                        <div className="text-[120px] filter grayscale group-hover:grayscale-0 transition-all duration-500">📱</div>
                        <div className="absolute inset-0 bg-brand-500/10 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity">
                            <span className="bg-brand-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">{t('home.scan_qr')}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">{t('home.qr_desc')}</p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
