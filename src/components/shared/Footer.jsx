import { Link } from 'react-router-dom'
import { Pill, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react'

export const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="page-container py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg">PharmaChain</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Vietnam's trusted pharmaceutical supply chain platform. Certified, traceable, and safe.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-500 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-red-500 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm">
            {['Vitamins & Supplements', 'Pain Relief', 'Cold & Flu', 'Skincare', 'Medical Devices', 'Baby & Children'].map(item => (
              <li key={item}><Link to="/products" className="hover:text-white transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Customer Support</h4>
          <ul className="space-y-2 text-sm">
            {['My Orders', 'Returns & RMA', 'Prescription Upload', 'Health Blog', 'FAQ', ' Verify Product'].map(item => (
              <li key={item}><Link to={item.includes('Verify') ? '/trace' : '#'} className="hover:text-white transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400 shrink-0" /> 1800-6001 (Free)</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400 shrink-0" /> support@pharmachain.vn</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> My address, HCMC</li>
          </ul>
          <div className="mt-4">
            {/* <p className="text-xs text-slate-500">Licensed by Ministry of Health Vietnam</p>
            <p className="text-xs text-slate-500">GMP & GDP Certified</p> */}
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800 py-4">
      <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <p>© 2024 PharmaChain. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-slate-300">Privacy Policy</Link>
          <Link to="#" className="hover:text-slate-300">Terms of Service</Link>
          <Link to="#" className="hover:text-slate-300">Cookie Policy</Link>
        </div>
      </div>
    </div>
  </footer>
)
