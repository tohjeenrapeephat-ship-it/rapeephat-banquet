import React from 'react';
import { Phone, MessageCircle, MapPin, Award, Heart, Crown, Mail } from 'lucide-react';
import { VisitorStatsSection } from './VisitorCounter.js';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#FFFDF9] text-slate-800 border-t-4 border-amber-400/80 pt-10 pb-16 sm:pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Footer 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-amber-200/80">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 flex items-center justify-center shrink-0">
                <img src="/images/brand/logo.png" alt="โต๊ะจีน รพีพัฒน์" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 leading-tight">
                  โต๊ะจีน<span className="text-red-700 ml-1">รพีพัฒน์</span>
                </span>
                <div className="text-[10px] font-black text-amber-800 uppercase tracking-wide">
                  RAPEEPHAT BANQUET CATERING
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              บริการจัดเลี้ยงโต๊ะจีนนครปฐมแท้ระดับภัตตาคาร ประสบการณ์กว่า 35 ปี การันตีความสดใหม่ สะอาด อร่อย ตรงเวลา ทั่วราชอาณาจักร 77 จังหวัด
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs font-bold text-slate-700">
            <div className="text-sm font-black text-slate-900 mb-2">เมนูและบริการ</div>
            <div><a href="#heritage" className="hover:text-red-700 transition-colors">🏆 ตำนานนครปฐม 35 ปี</a></div>
            <div><a href="#menu-showcase" className="hover:text-red-700 transition-colors">🍱 เมนูอาหารยอดนิยม</a></div>
            <div><a href="#packages" className="hover:text-red-700 transition-colors">🏷️ แพ็กเกจราคาเริ่มต้น 1,400.-</a></div>
            <div><a href="#portfolio" className="hover:text-red-700 transition-colors">📸 ภาพผลงานจริงทั่วไทย</a></div>
            <div><a href="#fleet-logistics" className="hover:text-red-700 transition-colors">🚚 รถครัวเคลื่อนที่ 77 จังหวัด</a></div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 font-bold">
            <div className="text-sm font-black text-slate-900 mb-2">ติดต่อเจ้าหน้าที่</div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <a href="tel:0813311646" className="text-slate-900 hover:text-red-700 font-black font-mono text-sm">081-331-1646 (คุณแป้ง)</a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
              <a href="https://line.me/ti/p/~pang_baichaa" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 font-bold">
                LINE: pang_baichaa
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-red-600" />
              <div className="flex flex-col text-xs font-mono font-bold">
                <a href="mailto:info@rapeephat-catering.com" className="hover:text-red-700">info@rapeephat-catering.com</a>
                <a href="mailto:baicha@rapeephat-catering.com" className="hover:text-red-700">baicha@rapeephat-catering.com</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>บริการจัดเลี้ยงทั่วประเทศไทย 100%</span>
            </div>
          </div>

          {/* Special Guarantee */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-red-50 border-2 border-amber-300">
            <div className="flex items-center gap-1.5 text-red-800 font-black">
              <Award className="w-4 h-4 text-amber-600" /> การันตีความสดใหม่ 100%
            </div>
            <p className="text-[11px] text-slate-700 font-bold">
              ทุกเมนูปรุงสุกสดใหม่หน้างานโดยเชฟมืออาชีพ มัดจำล็อกคิว 30% ชำระวันงาน 70%
            </p>
          </div>

        </div>

        {/* Live Website Visitor & Traffic Counter Banner (1 Million+ Starting Milestone) */}
        <VisitorStatsSection />

        {/* Copyright & Admin Portal Shortcut */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-medium border-t border-amber-200">
          <div>
            © {new Date().getFullYear()} โต๊ะจีน รพีพัฒน์ พรีเมียม (RAPEEPHAT BANQUET CATERING). สงวนลิขสิทธิ์ทุกประการ
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <a
              href="#admin"
              onClick={(e) => {
                if (onOpenAdmin) {
                  e.preventDefault();
                  onOpenAdmin();
                }
              }}
              className="text-slate-700 hover:text-red-700 font-black transition-colors flex items-center gap-1 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs cursor-pointer"
            >
              <span>🔑 เข้าสู่ระบบหลังบ้าน (Admin)</span>
            </a>
          </div>

          <div className="flex items-center gap-1 font-bold text-amber-900">
            <span>บริการด้วยใจเพื่อวันสำคัญของคุณ</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
          </div>
        </div>

      </div>
    </footer>
  );
};
