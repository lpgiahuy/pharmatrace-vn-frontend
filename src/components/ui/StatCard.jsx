import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils'

export const StatCard = ({ title, value, change, trend = 'neutral', icon: Icon, color = 'blue', prefix = '', suffix = '', loading = false }) => {
  const colorMap = {
    blue:   { bg: 'bg-brand-50',  icon: 'text-brand-500',  iconBg: 'bg-brand-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-500',  iconBg: 'bg-green-100' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-500',    iconBg: 'bg-red-100'   },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500', iconBg: 'bg-orange-100'},
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', iconBg: 'bg-purple-100'},
  }
  const c = colorMap[color] || colorMap.blue
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400'

  if (loading) {
    return (
      <div className="card p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
        <div className="skeleton h-8 w-32 rounded mb-2" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    )
  }

  return (
    <div className={cn('card p-5 hover:shadow-elevated transition-shadow duration-200')}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl', c.iconBg)}>
            <Icon className={cn('w-5 h-5', c.icon)} />
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-slate-900 mb-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString('vi-VN') : value}{suffix}
      </p>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <TrendIcon className={cn('w-3.5 h-3.5', trendColor)} />
          <span className={cn('text-xs font-medium', trendColor)}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  )
}
