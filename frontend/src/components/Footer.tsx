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
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600 shrink-0" />
              <a href="tel:0813311646" className="text-slate-900 hover:text-red-700 font-black font-mono text-base">081-331-1646 (คุณแป้ง)</a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#06C755] shrink-0" />
              <a href="https://line.me/ti/p/~pang_baichaa" target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-green-600 font-bold text-sm">
                LINE: pang_baichaa
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
                  72/7 ต.นครปฐม อ.เมือง จ.นครปฐม
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Enterprise Security & PDPA Compliance Assurance Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-slate-900 flex items-center gap-1.5">
                <span>มาตรฐานความปลอดภัยระดับองค์กร & นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded">SSL 256-BIT</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                รองรับการจัดซื้อจัดจ้าง ออกใบเสนอราคา สัญญาจ้าง และเอกสารหักภาษี ณ ที่จ่าย (WHT 3%) ถูกต้องตามกฎหมาย 100%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[11px] font-bold text-slate-600">
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">🔒 HTTPS Secured</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">📋 นิติบุคคลตรวจสอบได้</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">🛡️ PDPA Compliant</span>
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
