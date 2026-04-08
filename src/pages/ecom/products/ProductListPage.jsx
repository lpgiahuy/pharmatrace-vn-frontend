import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, AlertCircle, RefreshCcw } from 'lucide-react'
import { productService } from '@/services/product.service'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { Pagination } from '@/components/ui/Pagination'
import { SearchEmpty } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '@/constants'
import { useDebounce } from '@/hooks/useDebounce'

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]   = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const page     = Number(searchParams.get('page'))     || 1
  const category = searchParams.get('category')         || ''
  const sort     = searchParams.get('sort')             || 'newest'
  const search   = searchParams.get('search')           || ''
  const minPrice = searchParams.get('minPrice')         || ''
  const maxPrice = searchParams.get('maxPrice')         || ''

  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebounce(searchInput, 400)

  const setParam = (key, val) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set(key, val); else next.delete(key)
      if (key !== 'page') next.set('page', '1')
      return next
    })
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productService.getAll({ category, sort, search, minPrice, maxPrice, limit: 10000 })
      const allData = Array.isArray(res?.data) ? res.data : []
      setProducts(allData)
      setTotal(allData.length)
    } catch (err) {
      console.error('[ProductListPage] Failed to fetch products:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to load products')
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [category, sort, search, minPrice, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setParam('search', debouncedSearch) }, [debouncedSearch])

  const displayedProducts = products.slice((page - 1) * 20, page * 20)

  const clearFilters = () => setSearchParams({})

  return (
    <div className="page-container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-60 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="card p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Filters</h3>
              {(category || search || minPrice || maxPrice) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Category</p>
              <div className="space-y-1">
                <button
                  onClick={() => setParam('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!category ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  All Categories
                </button>
                {PRODUCT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setParam('category', cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${category == cat.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Price Range (VND)</p>
              <div className="flex gap-2">
                <Input placeholder="Min" type="number" value={minPrice} onChange={e => setParam('minPrice', e.target.value)} className="text-xs" />
                <Input placeholder="Max" type="number" value={maxPrice} onChange={e => setParam('maxPrice', e.target.value)} className="text-xs" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                className="input text-sm w-48"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden btn-secondary gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Failed to load products</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
              <Button size="xs" variant="secondary" onClick={fetchProducts} leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}>
                Retry
              </Button>
            </div>
          )}

          {/* Results count */}
          <p className="text-sm text-slate-500 mb-4">
            {loading ? 'Loading…' : `${(total ?? 0).toLocaleString()} products found`}
            {search && <span className="ml-1">for "<strong>{search}</strong>"</span>}
          </p>

          {/* Grid */}
          {!loading && products.length === 0 ? (
            <SearchEmpty query={search} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : displayedProducts.map(p => <ProductCard key={p?.id || p?._id} product={p} />)
              }
            </div>
          )}

          {/* Pagination */}
          {!loading && total > 20 && (
            <Pagination
              page={page}
              totalPages={Math.ceil(total / 20)}
              onChange={p => setParam('page', p)}
              className="mt-8"
            />
          )}
        </div>
      </div>
    </div>
  )
}
