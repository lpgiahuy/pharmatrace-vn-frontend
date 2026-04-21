import { useEffect, useState, useCallback, memo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { productService } from '@/services/product.service'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { Pagination } from '@/components/ui/Pagination'
import { SearchEmpty } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useCategoryStore } from '@/store/categoryStore'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

// Sub-components
import { ProductFilters } from './components/ProductFilters'
import { ProductListPageHeader } from './components/ProductListPageHeader'

/**
 * ProductListPage handles global state for filtering, searching, and sorting products.
 * It is decoupled into specialized presentation components.
 */
export default function ProductListPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]   = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [brands, setBrands]       = useState([])
  const categories = useCategoryStore(s => s.categories)

  const page     = Number(searchParams.get('page'))     || 1
  const category = searchParams.get('category')         || ''
  const sort     = searchParams.get('sort')             || 'newest'
  const search   = searchParams.get('search')           || ''
  const minPrice = searchParams.get('minPrice')         || ''
  const maxPrice = searchParams.get('maxPrice')         || ''
  const brand    = searchParams.get('brand')            || ''

  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebounce(searchInput, 400)

  const setParam = useCallback((key, val) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set(key, val); else next.delete(key)
      if (key !== 'page') next.set('page', '1')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productService.getAll({ category, sort, search, minPrice, maxPrice, brand, limit: 10000 })
      const allData = Array.isArray(res?.data) ? res.data : []

      // Deduplicate: same drug ID may appear once per packaging variant.
      // Keep only one card per product ID — prefer the base unit or the cheapest variant.
      const seen = new Map()
      allData.forEach(p => {
        const existing = seen.get(p.id)
        if (!existing) {
          seen.set(p.id, p)
        } else {
          // Prefer the base unit if available, otherwise keep the cheaper one
          const isBase = p.la_don_vi_co_ban || p.quy_cach_dong_goi?.find(q => q.la_don_vi_co_ban && q.ten_don_vi === p.unit)
          if (isBase || p.price < existing.price) {
            seen.set(p.id, p)
          }
        }
      })

      const deduped = Array.from(seen.values())
      setProducts(deduped)
      setTotal(deduped.length)
    } catch (err) {
      console.error('[ProductListPage] Failed to fetch products:', err)
      setError(err?.response?.data?.message || err?.message || t('product_list.error_loading'))
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [category, sort, search, minPrice, maxPrice, brand, t])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { setParam('search', debouncedSearch) }, [debouncedSearch, setParam])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await productService.getBrands()
        setBrands(brandsData)
      } catch (err) {
        console.error('[ProductListPage] Failed to fetch brands:', err)
      }
    }
    fetchBrands()
  }, [])

  const displayedProducts = products.slice((page - 1) * 20, page * 20)

  const clearFilters = () => setSearchParams({})

  return (
    <div className="page-container py-8 animate-fade-in min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-60 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <ProductFilters 
            categories={categories}
            selectedCategory={category}
            onCategoryChange={val => setParam('category', val)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={setParam}
            brands={brands}
            selectedBrand={brand}
            onBrandChange={val => setParam('brand', val)}
            onClearFilters={clearFilters}
            showAllCategories={showAllCategories}
            onToggleShowAllCategories={() => setShowAllCategories(!showAllCategories)}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sub-category Quick Select */}
          {(() => {
            const activeParent = categories.find(c => c.id == category || c.children?.some(child => child.id == category));
            if (!activeParent || !activeParent.children?.length) return null;
            
            return (
              <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    {t('product_list.subcategories_of', { name: activeParent.name, defaultValue: `Danh mục ${activeParent.name}` })}
                  </h3>
                  {category != activeParent.id && (
                    <button 
                      onClick={() => setParam('category', activeParent.id)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      {t('common.view_all_in_parent', { defaultValue: 'Xem tất cả' })}
                    </button>
                  )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                  {activeParent.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setParam('category', child.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl border transition-all shrink-0",
                        category == child.id 
                          ? "bg-brand-50 border-brand-200 shadow-sm shadow-brand-100" 
                          : "bg-white border-slate-100 hover:border-brand-200 hover:shadow-md"
                      )}
                    >
                      <CategoryIcon 
                        name={child.iconName} 
                        className={cn(
                          "w-12 h-12 bg-transparent",
                          category == child.id ? "scale-110" : ""
                        )} 
                        size={24} 
                      />
                      <span className={cn(
                        "text-[11px] font-bold text-center leading-tight truncate w-full px-1",
                        category == child.id ? "text-brand-700" : "text-slate-600"
                      )}>{child.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          <ProductListPageHeader             searchInput={searchInput}
            onSearchChange={setSearchInput}
            sortValue={sort}
            onSortChange={val => setParam('sort', val)}
            onToggleFilters={() => setShowFilters(!showFilters)}
            totalResults={total}
            currentSearch={search}
            loading={loading}
          />

          {/* Error state */}
          {error && (
            <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800">{t('product_list.error_title', { defaultValue: 'Failed to load products' })}</p>
                <p className="text-xs text-red-600 mt-0.5 font-medium">{error}</p>
              </div>
              <Button 
                size="xs" 
                variant="outline" 
                className="bg-white"
                onClick={fetchProducts} 
                leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}
              >
                {t('common.retry', { defaultValue: 'Retry' })}
              </Button>
            </div>
          )}

          {/* Grid Layout */}
          {!loading && products.length === 0 ? (
            <SearchEmpty query={search} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
              className="mt-12"
            />
          )}
        </div>
      </div>
    </div>
  )
}
