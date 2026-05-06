import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Pill, Heart, Bell, MapPin, Facebook, Youtube, ShieldCheck, Phone, Smartphone } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { Avatar } from '@/components/ui/Avatar'
import { useCategoryStore } from '@/store/categoryStore'
import { useTranslation } from 'react-i18next'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
const Logo = 'https://res.cloudinary.com/dc64co0el/image/upload/v1777731026/Logo_ck5ouv.svg'

export const Header = () => {
  const { t, i18n } = useTranslation()
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
      {/* Top utility bar - Perfectly Distributed Grid */}
      <div className="bg-white border-b border-slate-100 py-2 hidden md:block">
        <div className="page-container flex items-center justify-between text-[11px] font-bold text-slate-500">
          <Link to="/pharmacies" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-brand-500" /> {t('nav.pharmacies')}
          </Link>
          
          <div className="h-3 w-px bg-slate-200"></div>
          
          <Link to="/blog" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase whitespace-nowrap">
            <Heart className="w-3.5 h-3.5 text-medical-red" /> {t('nav.health_corner')}
          </Link>

          <div className="h-3 w-px bg-slate-200"></div>

          <a href="#" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase whitespace-nowrap">
            <Smartphone className="w-3.5 h-3.5" /> {t('nav.download_app')}
          </a>

          <div className="h-3 w-px bg-slate-200"></div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Phone className="w-3.5 h-3.5" /> <span className="uppercase">{t('nav.hotline')}</span> <span className="font-black text-slate-900">1800 6821</span>
          </div>

          <div className="h-3 w-px bg-slate-200"></div>

          <a href="#" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase whitespace-nowrap">
            {t('nav.business')} <span className="px-1.5 py-0.5 rounded-sm bg-medical-green text-white text-[8px] font-black leading-none">NEW</span>
          </a>

          <div className="h-3 w-px bg-slate-200"></div>

          <a href="#" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase whitespace-nowrap">
            {t('nav.hot_deals')} <span className="material-symbols-outlined text-[14px] text-orange-500">local_fire_department</span>
          </a>

          <div className="h-3 w-px bg-slate-200"></div>

          <Link to="/account/orders" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors uppercase whitespace-nowrap">
            {t('nav.track_order')} <span className="px-1.5 py-0.5 rounded-sm bg-brand-500 text-white text-[8px] font-black leading-none">NEW</span>
          </Link>

          <div className="h-3 w-px bg-slate-200"></div>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => i18n.changeLanguage('vi')}
              className={`text-[10px] font-black px-1.5 py-0.5 rounded transition-all ${i18n.language === 'vi' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              VI
            </button>
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className={`text-[10px] font-black px-1.5 py-0.5 rounded transition-all ${i18n.language?.startsWith('en') ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Header - Brand Blue background */}
      <div className="bg-brand-500 border-b border-brand-600 shadow-md">
        <div className="page-container">
          {/* Desktop Layout - Kept for consistency */}
          <div className="hidden md:flex items-center gap-6 h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobileMenu}>
              <img src={Logo} alt="Logo" className="h-12 w-auto object-contain" />
              <div className="hidden lg:block">
                <span className="text-xl md:text-2xl font-display font-black text-white block leading-none tracking-tight">PharmaTrace VN</span>
                <span className="text-[10px] text-white/70 font-bold tracking-[0.2em] uppercase mt-1 block">Health & Care</span>
              </div>
            </Link>

            {/* Categories Menu */}
            <Link to="/products" className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-black text-white bg-white/10 hover:bg-white/20 transition-all border border-white/5 whitespace-nowrap group">
              <Menu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> {t('nav.categories')}
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl flex items-center">
              <div className="relative flex-1 group">
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder={t('nav.search_placeholder')}
                  className="w-full h-11 pl-14 pr-4 rounded-full border-none bg-white text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-white/20 transition-all placeholder:text-slate-400 font-medium"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <button type="submit" className="h-11 ml-2 px-8 bg-medical-green text-white font-black text-sm rounded-full hover:bg-green-600 transition-all shadow-md shadow-black/10 flex items-center gap-2 uppercase tracking-wide">
                {t('nav.search_btn')}
              </button>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex flex-col items-center gap-1 px-4 py-1 text-white hover:bg-white/10 rounded-xl transition-all">
                    <User className="w-6 h-6 mb-0.5" />
                    <span className="text-[11px] font-black uppercase tracking-wide opacity-90 truncate max-w-[90px]">
                        {user ? `${t('nav.hi')} ${(user.ho_ten || user.name || '').split(' ').pop()}` : t('nav.account')}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-modal border border-surface-border py-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="px-5 py-3 border-b border-surface-border mb-2 bg-slate-50/50 rounded-t-2xl">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('nav.my_account')}</p>
                      <p className="text-base font-black text-brand-600 truncate mt-0.5">{user?.name || user?.ho_ten}</p>
                    </div>
                    <Link to="/account/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-bold transition-colors">
                      <User className="w-4.5 h-4.5" /> {t('nav.profile')}
                    </Link>
                    <Link to="/account/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-bold transition-colors">
                      <Bell className="w-4.5 h-4.5" /> {t('nav.my_orders')}
                    </Link>
                    <Link to="/account/wishlist" className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-bold transition-colors">
                      <Heart className="w-4.5 h-4.5 text-medical-red" /> {t('nav.wishlist')}
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <Link to="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm text-brand-600 font-black bg-brand-50/50 hover:bg-brand-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> {t('nav.admin_portal')}
                      </Link>
                    )}
                    <div className="mx-3 my-2 border-t border-slate-100"></div>
                    <button onClick={logout} className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 font-black transition-colors rounded-b-xl">
                      <span className="material-symbols-outlined text-[18px]">logout</span> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" state={{ from: location }} className="flex flex-col items-center gap-1 px-4 py-1 text-white hover:bg-white/10 rounded-xl transition-all">
                  <User className="w-6 h-6 mb-0.5" />
                  <span className="text-[11px] font-black uppercase tracking-wide opacity-90">{t('nav.login')}</span>
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
                <span className="text-[11px] font-black uppercase tracking-wide opacity-90 mt-0.5">{t('nav.cart')}</span>
              </button>
            </div>
          </div>

          {/* Mobile Tiered Header - Modern & Functional */}
          <div className="md:hidden flex flex-col py-3.5 gap-3.5">
            {/* Tier 1: Logo & Icons */}
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5" onClick={closeMobileMenu}>
                <img src={Logo} alt="Logo" className="h-11 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="text-xl font-display font-black text-white tracking-tight leading-none">PharmaTrace VN</span>
                  <span className="text-[9px] text-white/70 font-bold tracking-widest uppercase mt-1">Health & Care</span>
                </div>
              </Link>

              <div className="flex items-center gap-1.5">
                {isAuthenticated ? (
                  <Link to="/account/profile" className="p-2.5 text-white/90 hover:text-white transition-colors">
                    <Avatar src={user?.avatar} name={user?.name} className="w-7 h-7 border-2 border-white/20" />
                  </Link>
                ) : (
                  <Link to="/login" className="p-2.5 text-white/90 hover:text-white transition-colors">
                    <User className="w-7 h-7" />
                  </Link>
                )}
                
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className="relative p-2.5 text-white/90 hover:text-white transition-colors"
                >
                  <ShoppingCart className="w-7 h-7" />
                  {itemCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-medical-red text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-brand-500 shadow-sm leading-none">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </button>

                <button onClick={toggleMobileMenu} className="p-2.5 text-white/90 hover:text-white transition-colors">
                  {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
              </div>
            </div>

            {/* Tier 2: Prominent Search */}
            <form onSubmit={handleSearch} className="relative group overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all focus-within:bg-white focus-within:shadow-xl">
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder={t('nav.search_placeholder_mobile', { defaultValue: 'Search medicine, symptoms...' })}
                className="w-full h-12 pl-12 pr-4 bg-transparent text-white focus:text-slate-800 text-[15px] placeholder:text-white/60 focus:placeholder:text-slate-400 transition-all outline-none font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-brand-500 transition-all" />
            </form>
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
                  placeholder={t('nav.search_placeholder')}
                  className="input pl-12 h-10 text-sm rounded-full"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              {categories.map(cat => {
                const hasChildren = cat.children && cat.children.length > 0;
                const [expanded, setExpanded] = useState(false);

                return (
                  <div key={cat.id} className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/products?category=${cat.id}`}
                        onClick={closeMobileMenu}
                        className="flex-1 flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent hover:border-brand-100"
                      >
                        <CategoryIcon name={cat.iconName} className="w-10 h-10 lg:w-9 lg:h-9" size={20} />
                        <span>{cat.name}</span>
                      </Link>
                      
                      {hasChildren && (
                        <button 
                          onClick={() => setExpanded(!expanded)}
                          className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-all",
                            expanded && "bg-brand-50 text-brand-600"
                          )}
                        >
                          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      )}
                    </div>

                    {hasChildren && expanded && (
                      <div className="pl-12 flex flex-col gap-1 pb-2">
                        {cat.children.map(child => (
                          <Link
                            key={child.id}
                            to={`/products?category=${child.id}`}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium text-slate-500 hover:text-brand-600 hover:bg-brand-50/50 transition-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-400" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
