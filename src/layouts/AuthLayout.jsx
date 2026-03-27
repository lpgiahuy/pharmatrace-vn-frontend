import { Outlet, Link } from 'react-router-dom'
import { Pill } from 'lucide-react'

export const AuthLayout = () => (
  <div className="min-h-screen flex">
    {/* Left panel – branding */}
    <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-brand-600 to-brand-900 p-12 text-white">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-display font-bold">PharmaChain</span>
      </Link>
      <div>
        <h1 className="text-4xl font-display font-bold mb-4 leading-tight">
          Your trusted<br />pharmacy partner
        </h1>
        <p className="text-brand-200 text-lg leading-relaxed">
          Access certified medicines, track your orders, and manage your health with confidence.
        </p>
      </div>
      <div className="flex gap-6 text-sm text-brand-300">
        <span>🔒 Secure & Encrypted</span>
        <span>✓ GMP Certified</span>
        <span>📦 Fast Delivery</span>
      </div>
    </div>

    {/* Right panel – form */}
    <div className="flex-1 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <Pill className="w-5 h-5 text-brand-500" />
          <span className="text-lg font-display font-bold text-slate-800">PharmaChain</span>
        </Link>
        <Outlet />
      </div>
    </div>
  </div>
)
