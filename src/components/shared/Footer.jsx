import { Link } from 'react-router-dom'
import { Pill, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react'

export const Footer = () => (
  <footer className="bg-brand-500 text-white mt-auto overflow-hidden">
    <div className="page-container py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* About */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Pill className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <span className="text-white font-display font-black text-2xl block leading-none">PharmaChain</span>
              <span className="text-[10px] text-white font-black tracking-widest uppercase">Health & Care</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white font-medium max-w-xs">
            Hệ thống cung ứng dược phẩm tin cậy tại Việt Nam. Cam kết 100% sản phẩm chính hãng, truy xuất nguồn gốc minh bạch và an toàn.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-brand-500 transition-all">
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-medical-red hover:text-white transition-all">
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 relative inline-block">
            Sản phẩm
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-medical-green rounded-full"></span>
          </h4>
          <ul className="space-y-4 text-[13px] font-bold text-white">
            {['Thực phẩm chức năng', 'Thuốc không kê đơn', 'Chăm sóc cá nhân', 'Dược mỹ phẩm', 'Thiết bị y tế', 'Sản phẩm cho bé'].map(item => (
              <li key={item}>
                <Link to="/products" className="hover:text-green-300 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-medical-green group-hover:scale-125 transition-all" /> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 relative inline-block">
            Hỗ trợ khách hàng
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-medical-green rounded-full"></span>
          </h4>
          <ul className="space-y-4 text-[13px] font-bold text-white">
            {['Đơn hàng của tôi', 'Chính sách đổi trả', 'Giao hàng - Thanh toán', 'Blog sức khỏe', 'Câu hỏi thường gặp', 'Tra cứu nguồn gốc'].map(item => (
              <li key={item}>
                <Link to={item.includes('Tra cứu') ? '/trace' : '#'} className="hover:text-green-300 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-medical-green group-hover:scale-125 transition-all" /> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 relative inline-block">
            Liên hệ
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-medical-green rounded-full"></span>
          </h4>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                <Phone className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] uppercase font-black tracking-tighter">Hotline miễn phí 24/7</p>
                <p className="text-white font-black text-lg leading-none">1800 6821</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                    <Mail className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                    <p className="text-white/70 text-[10px] uppercase font-black tracking-tighter">Email hỗ trợ</p>
                    <p className="text-white font-black text-sm">support@pharmachain.vn</p>
                </div>
            </li>
            <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                    <p className="text-white/70 text-[10px] uppercase font-black tracking-tighter">Văn phòng chính</p>
                    <p className="text-white font-black text-sm">Quận 1, TP. Hồ Chí Minh</p>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div className="bg-brand-600 py-6 border-t border-white/10">
      <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-black text-white uppercase tracking-[0.2em]">
        <p>© 2026 PharmaChain. Thiết kế bởi Le Pham Gia Huy.</p>
        <div className="flex gap-8">
          <Link to="#" className="hover:text-green-300 transition-colors">Bảo mật</Link>
          <Link to="#" className="hover:text-green-300 transition-colors">Điều khoản</Link>
          <Link to="#" className="hover:text-green-300 transition-colors">Giấy phép</Link>
        </div>
      </div>
    </div>
  </footer>
)
