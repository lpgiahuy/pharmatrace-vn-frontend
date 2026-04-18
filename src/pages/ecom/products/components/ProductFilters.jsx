import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { X, Search, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils'

export const ProductFilters = memo(({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  selectedBrand,
  onBrandChange,
  onClearFilters,
  showAllCategories,
  onToggleShowAllCategories
}) => {
  const { t, i18n } = useTranslation()
  const [localMin, setLocalMin] = React.useState(minPrice || '')
  const [localMax, setLocalMax] = React.useState(maxPrice || '')
  const [brandSearch, setBrandSearch] = React.useState('')
  const [showAllBrands, setShowAllBrands] = React.useState(false)

  // Sync local inputs with props when filters are cleared
  React.useEffect(() => {
    setLocalMin(minPrice || '')
    setLocalMax(maxPrice || '')
  }, [minPrice, maxPrice])

  const BRANDS = [
    'STELLA', 'DHG Pharma', 'Davipharm', 'Hasan- Demarpharm', 'Domesco', 
    'Imexpharm', 'Traphaco', 'Nam Ha Pharma', 'OPC', 'Vemedim', 'Pymepharco'
  ]

  const PRICE_PRESETS = [
    { label: i18n.language === 'vi' ? 'Dưới 100.000 đ' : 'Under 100k', min: '', max: '100000' },
    { label: i18n.language === 'vi' ? '100.000 đ - 300.000 đ' : '100k - 300k', min: '100000', max: '300000' },
    { label: i18n.language === 'vi' ? '300.000 đ - 500.000 đ' : '300k - 500k', min: '300000', max: '500000' },
    { label: i18n.language === 'vi' ? 'Trên 500.000 đ' : 'Above 500k', min: '500000', max: '' },
  ]

  const handleApplyPrice = () => {
    onPriceChange('minPrice', localMin)
    onPriceChange('maxPrice', localMax)
  }

  const filteredBrands = BRANDS.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
  const displayedBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 5)

  const hasActiveFilters = selectedCategory || minPrice || maxPrice || selectedBrand

  return (
    <div className="card p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{t('product_list.filters', { defaultValue: 'Filters' })}</h3>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters} 
            className="text-xs text-red-500 hover:underline flex items-center gap-1"
            aria-label="Clear all filters"
          >
            <X className="w-3 h-3" /> {t('common.clear_all', { defaultValue: 'Clear all' })}
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-800">{t('product_list.category', { defaultValue: 'Danh mục' })}</h4>
        <div className="space-y-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => onCategoryChange('')}
            aria-pressed={!selectedCategory}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all group",
              !selectedCategory 
                ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm" 
                : "bg-surface-soft/50 border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-white"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
              !selectedCategory ? "border-brand-500 bg-brand-500" : "border-slate-300 group-hover:border-brand-400"
            )}>
              {!selectedCategory && <Check className="w-3 h-3 text-white" />}
            </div>
            {t('product_list.all_categories', { defaultValue: 'Tất cả danh mục' })}
          </button>

          {categories.slice(0, showAllCategories ? undefined : 6).map(cat => {
            const isActive = selectedCategory == cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                aria-pressed={isActive}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all group text-left",
                  isActive 
                    ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm" 
                    : "bg-surface-soft/50 border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  isActive ? "border-brand-500 bg-brand-500" : "border-slate-300 group-hover:border-brand-400"
                )}>
                  {isActive ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <span className="text-[10px]" aria-hidden="true">{cat.icon}</span>
                  )}
                </div>
                {cat.name}
              </button>
            )
          })}

          {categories.length > 6 && (
            <button
              onClick={onToggleShowAllCategories}
              className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors py-2"
            >
              {showAllCategories ? (
                <><ChevronUp className="w-3.5 h-3.5" /> {t('common.show_less', { defaultValue: 'Thu gọn' })}</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> {t('common.show_more_count', { count: categories.length - 6, defaultValue: `Xem thêm (${categories.length - 6})` })}</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-4">{t('product_list.price_range', { defaultValue: 'Khoảng giá' })}</h4>
        
        {/* Presets */}
        <div className="space-y-2 mb-4">
          {PRICE_PRESETS.map(preset => {
            const isActive = minPrice === preset.min && maxPrice === preset.max
            return (
              <button
                key={preset.label}
                onClick={() => {
                  onPriceChange('minPrice', preset.min)
                  onPriceChange('maxPrice', preset.max)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all group",
                  isActive 
                    ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm" 
                    : "bg-surface-soft/50 border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  isActive ? "border-brand-500 bg-brand-500" : "border-slate-300 group-hover:border-brand-400"
                )}>
                  {isActive && <Check className="w-3 h-3 text-white" />}
                </div>
                {preset.label}
              </button>
            )
          })}
        </div>

        {/* Custom Input */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {i18n.language === 'vi' ? 'Hoặc nhập khoảng giá phù hợp với bạn:' : 'Or enter personal range:'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="number"
                placeholder={i18n.language === 'vi' ? 'Tối thiểu' : 'Min'}
                value={localMin}
                onChange={e => setLocalMin(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase underline decoration-slate-300">đ</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder={i18n.language === 'vi' ? 'Tối đa' : 'Max'}
                value={localMax}
                onChange={e => setLocalMax(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase underline decoration-slate-300">đ</span>
            </div>
          </div>
          <Button 
            className="w-full h-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-widest shadow-md shadow-brand-500/10"
            onClick={handleApplyPrice}
          >
            {i18n.language === 'vi' ? 'Áp dụng' : 'Apply'}
          </Button>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-800 mb-4">{t('product_list.brand', { defaultValue: 'Thương hiệu' })}</h4>
        
        {/* Brand Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder={i18n.language === 'vi' ? 'Nhập tên thương hiệu' : 'Search Brand'}
            value={brandSearch}
            onChange={e => setBrandSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-medium"
          />
        </div>

        {/* Brand List */}
        <div className="space-y-2">
          {displayedBrands.map(brand => {
            const isActive = selectedBrand === brand
            return (
              <button
                key={brand}
                onClick={() => onBrandChange(isActive ? '' : brand)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium transition-all group text-left",
                  isActive 
                    ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm" 
                    : "bg-surface-soft/50 border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  isActive ? "border-brand-500 bg-brand-500" : "border-slate-300 group-hover:border-brand-400"
                )}>
                  {isActive && <Check className="w-3 h-3 text-white" />}
                </div>
                {brand}
              </button>
            )
          })}
        </div>

        {filteredBrands.length > 5 && (
          <button 
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors py-2"
          >
            {showAllBrands ? (
              <><ChevronUp className="w-3.5 h-3.5" /> {i18n.language === 'vi' ? 'Thu gọn' : 'Show less'}</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> {i18n.language === 'vi' ? 'Xem thêm' : 'Show more'}</>
            )}
          </button>
        )}
      </div>
    </div>
  )
})

ProductFilters.displayName = 'ProductFilters'

ProductFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.node
  })).isRequired,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
  minPrice: PropTypes.string,
  maxPrice: PropTypes.string,
  onPriceChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  showAllCategories: PropTypes.bool.isRequired,
  onToggleShowAllCategories: PropTypes.func.isRequired
}
