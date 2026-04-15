import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Pill, Heart, Bell } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Avatar } from '@/components/ui/Avatar'
import { useCategoryStore } from '@/store/categoryStore'

export const Header = () => {
  const [searchVal, setSearchVal] = useState('')
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, setCartDrawerOpen } = useUIStore()
  const itemCount = useCartStore(s => s.getItemCount())
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { categories, fetchCategories } = useCategoryStore()

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
      closeMobileMenu()
    }
  }

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-40 shadow-sm">
      {/* Top bar */}
      <div className="bg-brand-600 text-white text-xs py-1.5 text-center hidden sm:block">
        🚚 Free shipping on orders over 500,000đ &nbsp;|&nbsp; ☎ 1800-6001
      </div>

      <div className="page-container">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={closeMobileMenu}>
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-brand-600 hidden sm:block">PharmaChain</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search medicines, vitamins, health products..."
                className="input pl-10 pr-4 h-10 text-sm border-brand-100 bg-slate-50 focus:bg-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </form>
          

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              onClick={() => setSearchVal('')}
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[100px] truncate">{user?.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-modal border border-surface-border py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                  <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4" /> Tài khoản của tôi
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    📦 Đơn hàng của tôi
                  </Link>
                  <Link to="/account/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Heart className="w-4 h-4" /> Danh sách yêu thích
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50">
                      ⚙️ Admin Portal
                    </Link>
                  )}
                  {user?.role === 'warehouse' && (
                    <Link to="/warehouse" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50">
                      🏭 Warehouse Portal
                    </Link>
                  )}
                  <hr className="my-1 border-surface-border" />
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" state={{ from: location }} className="btn-secondary text-sm px-3 py-1.5">Sign In</Link>
            )}

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto no-scrollbar">
              {categories.slice(0, 7).map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50 whitespace-nowrap transition-colors"
            >
              <span>{cat.icon}</span> {cat.name}
            </Link>
          ))}
          <Link to="/products" className="px-3 py-1.5 rounded-lg text-sm text-brand-600 font-medium hover:bg-brand-50 whitespace-nowrap">
            All Products →
          </Link>
          {/* <Link to="/trace" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 whitespace-nowrap transition-colors ml-auto">
            🛡️ Verify Product
          </Link> */}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-border pb-4 animate-slide-up">
          <div className="page-container pt-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="input pl-10 h-10 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-1">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
