import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn, formatCurrency } from '@/utils'
import { useCartStore } from '@/store/cartStore'
import { Button } from './Button'

export const ProductCard = ({ product, className }) => {
  const addItem = useCartStore(s => s.addItem)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className={cn('card group flex flex-col overflow-hidden hover:shadow-elevated transition-shadow duration-200', className)}>
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden bg-slate-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 badge-red text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {product.isPrescription && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white">Rx</span>
        )}
        <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white shadow-card text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Heart className="w-4 h-4" />
        </button>
      </Link>

      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <Link to={`/products/${product.id}`}>
          <p className="text-[11px] text-brand-500 font-medium uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-auto">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-slate-600">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-end justify-between gap-2 mt-1">
          <div>
            <p className="text-base font-bold text-brand-600">{formatCurrency(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p>
            )}
          </div>
          <Button
            size="xs"
            variant="primary"
            disabled={!product.inStock}
            onClick={() => addItem(product)}
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
          >
            {product.inStock ? 'Add' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-square w-full" />
    <div className="p-3 flex flex-col gap-2">
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="flex justify-between items-center mt-1">
        <div className="skeleton h-5 w-24 rounded" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  </div>
)
