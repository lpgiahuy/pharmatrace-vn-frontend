import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, Plus, Minus, ChevronRight } from 'lucide-react'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/store/cartStore'
import { PageLoader } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/utils'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [qty, setQty]         = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    setLoading(true)
    productService.getById(id)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

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
            <span className="text-sm text-slate-500">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-display font-bold text-brand-600">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {product.inStock ? <Badge color="green">In Stock</Badge> : <Badge color="red">Out of Stock</Badge>}
            {product.isPrescription && <Badge color="orange">Prescription Required</Badge>}
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
              // disabled={!product.inStock}
              onClick={() => addItem(product, qty)}
              leftIcon={<ShoppingCart className="w-5 h-5" />}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <button className="p-3 rounded-xl border border-surface-border hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
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
        <div className="flex border-b border-surface-border">
          {['description', 'specifications', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none text-slate-600">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-surface-border">
                {Object.entries(product.specifications || {}).map(([k, v]) => (
                  <tr key={k}>
                    <td className="py-2 pr-4 font-medium text-slate-700 capitalize w-40">{k}</td>
                    <td className="py-2 text-slate-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <div className="text-slate-500 text-sm">No reviews yet. Be the first to review this product.</div>
          )}
        </div>
      </div>
    </div>
  )
}
