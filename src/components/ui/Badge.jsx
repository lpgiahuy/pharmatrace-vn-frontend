import { cn } from '@/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants'

const colorMap = {
  blue:   'bg-brand-50 text-brand-700 border-brand-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  cyan:   'bg-cyan-50 text-cyan-700 border-cyan-200',
  gray:   'bg-slate-100 text-slate-600 border-slate-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export const Badge = ({ color = 'gray', children, className, dot = false }) => (
  <span className={cn(
    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
    colorMap[color],
    className
  )}>
    {dot && <span className={cn('w-1.5 h-1.5 rounded-full', {
      'bg-brand-500': color === 'blue',
      'bg-green-500': color === 'green',
      'bg-red-500':   color === 'red',
      'bg-orange-500':color === 'orange',
      'bg-slate-400': color === 'gray',
    })} />}
    {children}
  </span>
)

export const OrderStatusBadge = ({ status }) => (
  <Badge color={ORDER_STATUS_COLORS[status] || 'gray'} dot>
    {ORDER_STATUS_LABELS[status] || status}
  </Badge>
)

export const StockBadge = ({ quantity, threshold = 20 }) => {
  if (quantity === 0)           return <Badge color="red">Out of Stock</Badge>
  if (quantity <= threshold)    return <Badge color="orange">Low Stock</Badge>
  return <Badge color="green">In Stock</Badge>
}

export const RoleBadge = ({ role }) => {
  const colors = { admin: 'red', manager: 'purple', warehouse: 'cyan', pharmacist: 'blue', staff: 'gray', customer: 'green' }
  return <Badge color={colors[role] || 'gray'}>{role}</Badge>
}
