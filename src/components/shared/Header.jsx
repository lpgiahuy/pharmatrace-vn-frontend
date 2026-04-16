import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Pill, Heart, Bell, MapPin, Facebook, Youtube, ShieldCheck, Phone, Smartphone } from 'lucide-react'
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
    <header className="sticky top-0 z-40">
      {/* Top utility bar - Balanced alignment */}
      <div className="bg-white border-b border-slate-200 py-2 hidden md:block">
        <div className="page-container flex items-center justify-between text-[12px] font-bold text-slate-600">
          <div className="flex items-center gap-6">
            <Link to="/pharmacies" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase">
              <MapPin className="w-4 h-4 text-brand-500" /> Hệ thống nhà thuốc
            </Link>
            <div className="h-3 w-px bg-slate-200 mx-1"></div>
            <Link to="/blog" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase">
              <Heart className="w-4 h-4 text-medical-red" /> Góc sức khỏe
            </Link>
          </div>
          <div className="flex items-center gap-6 text-slate-500">
            <a href="#" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase">
              <Smartphone className="w-4 h-4" /> Tải ứng dụng
            </a>
            <div className="flex items-center gap-1.5 uppercase">
              <Phone className="w-4 h-4" /> Hotline <span className="font-black text-slate-900 ml-0.5">1800 6821</span>
            </div>
            <a href="#" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase">
              Doanh nghiệp <span className="px-1.5 py-0.5 rounded-sm bg-medical-green text-white text-[9px] font-black">NEW</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase">
              Deal hot tháng 04 <span className="text-orange-500">🔥</span>
            </a>
            <Link to="/account/orders" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase">
              Tra cứu đơn hàng <span className="px-1.5 py-0.5 rounded-sm bg-brand-500 text-white text-[9px] font-black">NEW</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - Brand Blue background */}
      <div className="bg-brand-500 border-b border-brand-600 shadow-md">
        <div className="page-container">
          <div className="flex items-center gap-6 h-16 md:h-20">
            {/* Logo - No shadow as requested */}
            <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobileMenu}>
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white flex items-center justify-center">
                <Pill className="w-6 h-6 text-brand-500" />
              </div>
              <div className="hidden lg:block">
                <span className="text-xl md:text-2xl font-display font-black text-white block leading-none tracking-tight">PharmaChain</span>
                <span className="text-[10px] text-white/70 font-bold tracking-[0.2em] uppercase mt-1 block">Health & Care</span>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center">
              <div className="relative flex-1 group">
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Bạn tìm gì hôm nay? Ví dụ: Vitamin C, Khẩu trang..."
                  className="w-full h-11 pl-12 pr-4 rounded-full border-none bg-white text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-slate-400 font-medium"
                />
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <button type="submit" className="h-11 ml-2 px-8 bg-medical-green text-white font-black text-sm rounded-full hover:bg-green-600 transition-all shadow-md shadow-black/10 flex items-center gap-2 uppercase tracking-wide">
                TÌM KIẾM
              </button>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                className="md:hidden p-2.5 rounded-xl text-white"
                onClick={() => setSearchVal('')}
              >
                <Search className="w-6 h-6" />
              </button>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex flex-col items-center gap-1 px-4 py-1 text-white hover:bg-white/10 rounded-xl transition-all">
                    <User className="w-6 h-6" />
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] font-black hidden sm:block max-w-[90px] truncate uppercase tracking-tight">
                         {user?.name?.split(' ').pop()}
                      </span>
                      <span className="text-[9px] font-bold uppercase opacity-60 leading-none">Tài khoản</span>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-modal border border-surface-border py-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="px-5 py-3 border-b border-surface-border mb-2 bg-slate-50/50 rounded-t-2xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tài khoản của bạn</p>
                      <p className="text-base font-black text-brand-600 truncate mt-0.5">{user?.name}</p>
                    </div>
                    <Link to="/account/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-bold transition-colors">
                      <User className="w-4.5 h-4.5" /> Thông tin cá nhân
                    </Link>
                    <Link to="/account/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-bold transition-colors">
                      <Bell className="w-4.5 h-4.5" /> Đơn hàng của tôi
                    </Link>
                    <Link to="/account/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-bold transition-colors">
                      <Heart className="w-4.5 h-4.5 text-medical-red" /> Sản phẩm yêu thích
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm text-brand-600 font-black bg-brand-50/50 hover:bg-brand-50 transition-colors">
                        🛡️ Admin Portal
                      </Link>
                    )}
                    <div className="mx-3 my-2 border-t border-slate-100"></div>
                    <button onClick={logout} className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 font-black transition-colors rounded-b-xl">
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" state={{ from: location }} className="flex flex-col items-center gap-1 px-4 py-1 text-white hover:bg-white/10 rounded-xl transition-all">
                  <User className="w-6 h-6 border-b-2 border-transparent group-hover:border-white transition-all pb-0.5" />
                  <span className="text-[14px] font-black uppercase tracking-tight">Đăng nhập</span>
                </Link>
              )}

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex flex-col items-center gap-1 px-4 py-1 text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] bg-medical-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-500 px-1 shadow-sm">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[12px] font-black uppercase tracking-tight mt-0.5">Giỏ hàng</span>
              </button>

              <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-xl text-white">
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation - Simplified bar */}
      <div className="bg-white border-b border-surface-border hidden md:block shadow-sm">
        <div className="page-container flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <Link to="/products" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-black text-brand-600 bg-brand-50 hover:bg-brand-100 whitespace-nowrap mr-2 group">
              <Menu className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform duration-300" /> DANH MỤC SẢN PHẨM
            </Link>
            <div className="flex items-center gap-1">
              {categories.slice(0, 7).map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-all whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/trace" className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-medical-green text-medical-green hover:bg-medical-green hover:text-white transition-all font-black text-[12px] uppercase tracking-tighter">
              <ShieldCheck className="w-5 h-5" /> TRUY XUẤT NGUỒN GỐC
            </Link>
          </div>
        </div>
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
