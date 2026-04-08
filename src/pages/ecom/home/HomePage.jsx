import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, HeartPulse, Award, ShieldCheck } from 'lucide-react'
import { productService } from '@/services/product.service'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { useCategoryStore } from '@/store/categoryStore'

const BANNERS = [
  { id: 1, title: 'Trusted Medicines, Delivered Fast', subtitle: 'Shop 10,000+ certified pharmaceutical products', cta: 'Shop Now', to: '/products', bg: 'from-brand-600 to-brand-800', img: '💊' },
  { id: 2, title: 'Vitamins & Supplements Sale', subtitle: 'Up to 30% off premium health supplements', cta: 'View Deals', to: '/products?category=1', bg: 'from-teal-500 to-teal-700', img: '🌿' },
  { id: 3, title: 'Free Delivery Over 500K', subtitle: 'Fast, secure pharmaceutical delivery', cta: 'Start Shopping', to: '/products', bg: 'from-purple-600 to-purple-800', img: '🚚' },
]

const TRUST_ITEMS = [
  { icon: Shield,     label: 'GMP Certified',     desc: 'Ministry of Health approved' },
  { icon: Truck,      label: 'Fast Delivery',      desc: 'Same-day for orders before 3pm' },
  { icon: HeartPulse, label: 'Expert Pharmacists', desc: 'Free consultation anytime' },
  { icon: Award,      label: 'Authentic Products', desc: '100% genuine pharmaceuticals' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)
  const categories = useCategoryStore(s => s.categories)

  useEffect(() => {
    productService.getFeatured()
      .then(res => setFeatured(Array.isArray(res) ? res : []))
      .catch(err => {
        console.error('[HomePage] Failed to load featured products:', err)
        setFeatured([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveBanner(b => (b + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const banner = BANNERS[activeBanner]

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className={`bg-gradient-to-r ${banner.bg} text-white transition-all duration-500`}>
        <div className="page-container py-14 flex items-center justify-between gap-8">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">{banner.title}</h1>
            <p className="text-lg text-white/80 mb-8">{banner.subtitle}</p>
            <Link to={banner.to} className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
              {banner.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden md:block text-[120px] opacity-20 select-none">{banner.img}</div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2 pb-4">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setActiveBanner(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === activeBanner ? 'bg-white w-6' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-surface-border">
        <div className="page-container py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.slice(0, 8).map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-surface-border hover:border-brand-300 hover:shadow-elevated transition-all duration-200 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className="text-xs font-medium text-slate-700 text-center leading-snug">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="text-sm text-brand-600 hover:underline font-medium flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.slice(0, 8).map(p => <ProductCard key={p?.id || p?._id} product={p} />)
          }
        </div>
      </section>

      {/* Promo Banner */}
      <section className="page-container pb-12">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 p-8 text-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-bold mb-2">Upload Prescription</h3>
              <p className="text-green-100 text-sm mb-4">Get your Rx medications delivered safely</p>
              <Link to="/account/prescriptions" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-50">
                Upload Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <span className="text-6xl opacity-20">📋</span>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white flex items-center justify-between border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div>
              <h3 className="text-xl font-display font-bold mb-2">Verify Your Medicine</h3>
              <p className="text-slate-400 text-sm mb-4">Scan QR code to trace from factory to shelf</p>
              <Link to="/trace" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-emerald-400">
                {/* 🛡️ Verify Now <ArrowRight className="w-3.5 h-3.5" /> */}
                <ShieldCheck className="w-4 h-4" /> Verify Now
              </Link>
            </div>
            <span className="text-6xl opacity-20">🔍</span>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 p-8 text-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-bold mb-2">Health Blog</h3>
              <p className="text-orange-100 text-sm mb-4">Expert health tips and medication guides</p>
              <Link to="/blog" className="inline-flex items-center gap-2 bg-white text-orange-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-orange-50">
                Read Articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <span className="text-6xl opacity-20">📰</span>
          </div>
        </div>
      </section>
    </div>
  )
}
