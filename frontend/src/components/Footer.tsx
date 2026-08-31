import React from 'react';
import { Phone, MessageCircle, MapPin, Award, Heart, Crown, Mail } from 'lucide-react';
import { VisitorStatsSection } from './VisitorCounter.js';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-2 border-amber-300/80 py-12 text-xs text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-amber-200">
          
          {/* Official Brand Info with Full Logo */}
          <div className="space-y-3">
            <div className="bg-white p-2 rounded-2xl border-2 border-amber-300 shadow-sm inline-block">
              <img
                src="/images/brand/logo.png"
                alt="โต๊ะจีน รพีพัฒน์ RAPEEPHAT"
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              บริการจัดเลี้ยงโต๊ะจีนระดับภัตตาคาร สด สะอาด อร่อย ทั่วราชอาณาจักร การันตีประสบการณ์กว่า 35 ปี มากกว่า 6,500 งาน
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 font-bold">
            <div className="text-sm font-black text-slate-900 mb-2 flex items-center gap-1">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>เมนู & บริการ</span>
            </div>
            <div><a href="#packages" className="hover:text-red-700 transition-colors">แพ็กเกจโต๊ะจีน ฿1,400 - ฿5,000</a></div>
            <div><a href="#menu-showcase" className="hover:text-red-700 transition-colors">แกลเลอรีเมนูอาหาร</a></div>
            <div><a href="#portfolio" className="hover:text-red-700 transition-colors">ผลงานจัดเลี้ยงจริง</a></div>
            <div><a href="#clients" className="hover:text-red-700 transition-colors">ลูกค้าองค์กรที่ไว้วางใจ</a></div>
            <div><a href="#quotation" className="hover:text-red-700 text-red-700 font-black transition-colors">คำนวณราคา & ออกใบเสนอราคา (A4)</a></div>
          </div>

          {/* Contact Direct */}
          <div className="space-y-2 font-bold">
            <div className="text-sm font-black text-slate-900 mb-2">ติดต่อเจ้าหน้าที่</div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <a href="tel:0830872257" className="text-slate-900 hover:text-red-700 font-black font-mono text-sm">083-087-2257 (คุณแป้ง)</a>
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
              className="text-slate-500 hover:text-red-700 font-bold transition-colors flex items-center gap-1 bg-slate-100 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-slate-200"
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
