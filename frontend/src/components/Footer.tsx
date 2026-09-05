import React from 'react';
import { Phone, MessageCircle, MapPin, Award, Heart, Crown, Mail, ShieldCheck } from 'lucide-react';
import { VisitorStatsSection } from './VisitorCounter.js';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#FFFDF9] text-slate-800 border-t-4 border-amber-400/80 pt-10 pb-16 sm:pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Footer 3 Columns Grid (Spacious & Clean) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pb-8 border-b border-amber-200/80">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <img src="/images/brand/logo.png" alt="โต๊ะจีน รพีพัฒน์" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 leading-tight">
                  โต๊ะจีน<span className="text-red-700 ml-1">รพีพัฒน์</span>
                </span>
                <div className="text-xs font-black text-amber-800 uppercase tracking-wide">
                  RAPEEPHAT BANQUET CATERING
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              บริการจัดเลี้ยงโต๊ะจีนนครปฐมแท้ระดับภัตตาคาร ประสบการณ์กว่า 35 ปี การันตีความสดใหม่ สะอาด อร่อย ตรงเวลา ทั่วราชอาณาจักร 77 จังหวัด
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-sm font-bold text-slate-700">
            <div className="text-base font-black text-slate-900 mb-3 pb-1 border-b border-amber-200">เมนูและบริการ</div>
            <div><a href="#heritage" className="hover:text-red-700 transition-colors">🏆 ตำนานนครปฐม 35 ปี</a></div>
            <div><a href="#menu-showcase" className="hover:text-red-700 transition-colors">🍱 เมนูอาหารยอดนิยม</a></div>
            <div><a href="#packages" className="hover:text-red-700 transition-colors">🏷️ แพ็กเกจราคาเริ่มต้น 1,400.-</a></div>
            <div><a href="#portfolio" className="hover:text-red-700 transition-colors">📸 ภาพผลงานจริงทั่วไทย</a></div>
            <div><a href="#fleet-logistics" className="hover:text-red-700 transition-colors">🚚 รถครัวเคลื่อนที่ 77 จังหวัด</a></div>
          </div>

          {/* Contact Details & Locations */}
          <div className="space-y-3">
            <div className="text-base font-black text-slate-900 mb-3 pb-1 border-b border-amber-200">ติดต่อและที่ตั้งสำนักงาน</div>
            
            {/* Direct Coordinator Card with Khun Pang */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 border border-amber-300 shadow-xs flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="/images/brand/khun-pang.jpg"
                  alt="คุณแป้ง - ผู้ประสานงานโต๊ะจีน รพีพัฒน์"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="ออนไลน์พร้อมรับสายค่ะ" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="text-[10.5px] font-black text-amber-900 uppercase">ฝ่ายประสานงานจัดเลี้ยง</div>
                <div className="text-xs sm:text-sm font-black text-slate-900 truncate">คุณแป้ง (รพีพัฒน์)</div>
                <a href="tel:0813311646" className="text-xs font-black text-red-700 hover:text-red-900 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-red-600" />
                  <span>081-331-1646 (รับสายตลอด 24 ชม.)</span>
                </a>
              </div>
            </div>
            
            {/* Social Follow Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <a
                href="https://www.facebook.com/profile.php?id=61593868896647"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs border border-blue-200 transition-colors shadow-2xs"
                title="ติดตามเพจ Facebook โต๊ะจีน รพีพัฒน์"
              >
                <span>📘 Facebook เพจทางการ</span>
              </a>

              <a
                href="https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-950 font-black text-xs border border-pink-200 transition-colors shadow-2xs"
                title="ติดตามช่อง TikTok โต๊ะจีน รพีพัฒน์"
              >
                <span>🎵 TikTok ช่องทางการ</span>
              </a>

              <a
                href="https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-950 font-black text-xs border border-red-200 transition-colors shadow-2xs"
                title="ติดตามช่อง YouTube โต๊ะจีน รพีพัฒน์"
              >
                <span>▶️ YouTube ช่องทางการ</span>
              </a>

              <a
                href="https://line.me/ti/p/~pang_baichaa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-200 transition-colors shadow-2xs"
                title="เพิ่มเพื่อน LINE"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
                <span>LINE (45K+)</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <div className="flex flex-col text-xs font-semibold">
                <a href="mailto:info@rapeephat-catering.com" className="text-slate-800 hover:text-red-700">info<span className="text-red-700 font-bold px-0.5">@</span>rapeephat-catering.com</a>
                <a href="mailto:baicha@rapeephat-catering.com" className="text-slate-800 hover:text-red-700">baicha<span className="text-red-700 font-bold px-0.5">@</span>rapeephat-catering.com</a>
              </div>
            </div>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">สำนักงานใหญ่:</strong><br />
                  50/8 ม. 4 ต. คลองสาม อ.คลองหลวง จ.ปทุมธานี 12120
                </div>
              </div>
              <div className="flex items-start gap-2 bg-red-50/60 p-2.5 rounded-xl border border-red-200/80">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">ฐานผลิต & โรงครัวกลาง:</strong><br />
                  72 หมู่ 1 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม 73000
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Official Trustmark & Quality Assurance Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-300/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5 text-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-800 text-white flex flex-col items-center justify-center shrink-0 shadow-md border border-cyan-300/50 p-1">
              <div className="text-[8px] font-black leading-none text-cyan-200">กรมพัฒนา</div>
              <div className="text-[12px] font-black leading-none text-white my-0.5">DBD</div>
              <div className="text-[6.5px] font-bold tracking-widest leading-none text-cyan-300 uppercase">Registered</div>
            </div>
            <div>
              <div className="font-black text-slate-950 flex flex-wrap items-center gap-2">
                <span className="text-sm">DBD Registered ทะเบียนพาณิชย์อิเล็กทรอนิกส์ กรมพัฒนาธุรกิจการค้า</span>
                <span className="px-2 py-0.2 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black rounded-full">
                  ✓ ตรวจสอบได้ 100%
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                วัตถุดิบคัดเกรดพรีเมียม สดใหม่ต่อวัน ปรุงสุกร้อนหน้างาน 100% • สืบทอดตำนานความอร่อยต้นตำรับนครปฐม 35+ ปี
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0 text-[11px] font-bold text-slate-700">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950 font-black">
              🏛️ DBD Registered
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-black">
              🌿 สดใหม่ ปรุงสุกหน้างาน 100%
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-black">
              👑 ต้นตำรับนครปฐม 35+ ปี
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-black">
              📜 สัญญา & ใบเสร็จครบถ้วน
            </span>
          </div>
        </div>

        {/* Live Website Visitor & Traffic Counter Banner (1 Million+ Starting Milestone) */}
        <VisitorStatsSection />

        {/* Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium border-t border-amber-200">
          <div>
            © {new Date().getFullYear()} โต๊ะจีน รพีพัฒน์ พรีเมียม (RAPEEPHAT BANQUET CATERING). สงวนลิขสิทธิ์ทุกประการ
          </div>

          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <span>บริการด้วยใจเพื่อวันสำคัญของคุณ</span>
            <Heart className="w-4 h-4 text-red-600 fill-red-600" />
          </div>
        </div>

      </div>
    </footer>
  );
};
