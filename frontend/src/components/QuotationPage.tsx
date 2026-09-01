import React, { useEffect } from 'react';
import { PackageTier, QuotationDoc } from '../types/quotation.js';
import { QuotationBuilder } from './QuotationBuilder/QuotationBuilder.js';
import { ArrowLeft, Phone, MessageCircle, FileText, Sparkles, Home, ShieldCheck, Crown } from 'lucide-react';

interface QuotationPageProps {
  initialPackage?: PackageTier;
  onBackToHome: () => void;
  onQuotationGenerated: (quote: QuotationDoc) => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const QuotationPage: React.FC<QuotationPageProps> = ({
  initialPackage,
  onBackToHome,
  onQuotationGenerated,
  onOpenHistory,
  historyCount,
}) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Dedicated Navbar (Red & Gold Luxury Theme) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-300 shadow-sm shadow-amber-900/5 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Back to Home Button & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-slate-900 font-black text-xs flex items-center gap-2 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="hidden sm:inline">กลับหน้าหลัก</span>
            </button>

            <a href="#" onClick={(e) => { e.preventDefault(); onBackToHome(); }} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center shrink-0">
                <img
                  src="/images/brand/logo.png"
                  alt="โต๊ะจีน รพีพัฒน์ RAPEEPHAT"
                  className="h-11 sm:h-13 w-auto object-contain"
                />
              </div>
              <div className="hidden md:flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-slate-900 leading-none">
                    โต๊ะจีน<span className="text-red-700 ml-0.5 font-black">รพีพัฒน์</span>
                  </span>
                  <span className="px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full">
                    PREMIUM
                  </span>
                </div>
                <span className="text-[10.5px] text-amber-800 font-bold mt-0.5">
                  ระบบคำนวณราคา & ออกใบเสนอราคา A4 ออนไลน์
                </span>
              </div>
            </a>
          </div>

          {/* Right Actions: History, Call, and LINE */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenHistory}
              className="relative px-3.5 sm:px-4 py-2 rounded-2xl bg-white hover:bg-amber-50/50 border-2 border-amber-300 text-slate-800 font-black text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">ประวัติเอกสาร</span>
              {historyCount > 0 && (
                <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] w-4 h-4 rounded-full font-bold flex items-center justify-center leading-none">
                  {historyCount}
                </span>
              )}
            </button>

            <a
              href="tel:0813311646"
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 border border-amber-500/40 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">081-331-1646</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Quotation Builder Section */}
      <main className="pb-16 pt-4">
        
        {/* Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium py-2">
            <button onClick={onBackToHome} className="hover:text-red-700 font-bold flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-700" />
              <span>หน้าหลัก</span>
            </button>
            <span className="text-amber-400">/</span>
            <span className="text-slate-900 font-black">คำนวณราคา & ออกใบเสนอราคา A4</span>
          </div>
        </div>

        {/* Builder Container */}
        <QuotationBuilder
          initialPackage={initialPackage}
          onQuotationGenerated={onQuotationGenerated}
        />

      </main>

      {/* Footer Note */}
      <footer className="border-t-2 border-amber-300 bg-white py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-900 font-black">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>โต๊ะจีน รพีพัฒน์ พรีเมียม • บริการจัดเลี้ยงระดับภัตตาคาร 35+ ปี ทั่วราชอาณาจักร</span>
          </div>
          <p className="font-bold text-slate-700">
            สอบถามรายละเอียดเพิ่มเติม โทร <strong className="text-red-700 font-mono text-sm font-black">081-331-1646</strong> (คุณแป้ง) | LINE: <strong>pang_baichaa</strong>
          </p>
        </div>
      </footer>

    </div>
  );
};
