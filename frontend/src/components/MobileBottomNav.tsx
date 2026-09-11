import React from 'react';
import { Home, UtensilsCrossed, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { PageView } from './Navbar.js';
import { trackPageView } from '../utils/googleAnalytics.js';

interface MobileBottomNavProps {
  currentView: PageView;
  onNavigate: (page: PageView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const handleNav = (page: PageView) => {
    trackPageView(page);
    onNavigate(page);
  };
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t-2 border-amber-300 shadow-[0_-4px_25px_rgba(0,0,0,0.15)] px-2 py-1 flex items-center justify-around safe-area-bottom select-none">
      
      {/* 1. Home / หน้าแรก */}
      <button
        type="button"
        onClick={() => handleNav('home')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
          currentView === 'home'
            ? 'text-red-700 font-black'
            : 'text-slate-600 hover:text-slate-900 font-bold'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentView === 'home' ? 'bg-red-50 text-red-700 shadow-xs' : ''}`}>
          <Home className="w-4.5 h-4.5" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5">หน้าแรก</span>
      </button>

      {/* 2. Menu Packages / แพ็กเกจราคา */}
      <button
        type="button"
        onClick={() => handleNav('packages')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
          currentView === 'packages' || currentView === 'menu'
            ? 'text-red-700 font-black'
            : 'text-slate-600 hover:text-red-700 font-bold'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentView === 'packages' || currentView === 'menu' ? 'bg-amber-100 text-amber-900 shadow-xs' : ''}`}>
          <UtensilsCrossed className="w-4.5 h-4.5 text-amber-700" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5">แพ็กเกจ</span>
      </button>

      {/* 3. CENTER HERO ACTION: Smart Quotation Builder / คำนวณราคา */}
      <button
        type="button"
        onClick={() => handleNav('quotation')}
        className="flex flex-col items-center justify-center -mt-5 group cursor-pointer"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 text-white shadow-lg shadow-red-900/30 ring-4 ring-white flex items-center justify-center transform active:scale-95 transition-all animate-pulse">
          <Sparkles className="w-6 h-6 text-amber-200" />
        </div>
        <span className="text-[10px] font-black text-red-700 mt-1 leading-tight">
          คำนวณราคา
        </span>
      </button>

      {/* 4. Direct LINE Chat / ทัก LINE */}
      <a
        href="https://line.me/ti/p/~pang_baichaa"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer text-[#06C755] font-black group"
      >
        <div className="p-1 rounded-xl bg-emerald-50 text-[#06C755] group-hover:scale-110 transition-transform shadow-xs">
          <MessageCircle className="w-4.5 h-4.5" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5 text-emerald-800 font-bold">ทัก LINE</span>
      </a>

      {/* 5. Direct Phone Call / โทรทันที */}
      <a
        href="tel:0813311646"
        className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer text-red-600 font-black group"
      >
        <div className="p-1 rounded-xl bg-red-100 text-red-600 animate-bounce group-hover:scale-110 transition-transform shadow-xs">
          <Phone className="w-4.5 h-4.5" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5 text-red-700 font-bold">โทรเลย</span>
      </a>

    </div>
  );
};

