import React from 'react';
import { Home, UtensilsCrossed, Sparkles, MessageCircle, Phone } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'site' | 'quotation' | 'admin';
  onNavigateHome: () => void;
  onOpenBuilder: () => void;
  onOpenChat?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigateHome,
  onOpenBuilder,
  onOpenChat,
}) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t-2 border-amber-300 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      
      {/* 1. Home / หน้าแรก */}
      <button
        onClick={onNavigateHome}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
          currentView === 'site'
            ? 'text-red-700 font-black'
            : 'text-slate-600 hover:text-slate-900 font-bold'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentView === 'site' ? 'bg-red-50 text-red-700' : ''}`}>
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5">หน้าแรก</span>
      </button>

      {/* 2. Menu Packages / แพ็กเกจอาหาร */}
      <a
        href="#packages"
        onClick={() => {
          if (currentView !== 'site') {
            onNavigateHome();
            setTimeout(() => {
              const el = document.getElementById('packages');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-600 hover:text-red-700 font-bold transition-all"
      >
        <div className="p-1 rounded-xl hover:bg-amber-50">
          <UtensilsCrossed className="w-5 h-5 text-amber-700" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5">แพ็กเกจ</span>
      </a>

      {/* 3. CENTER HERO ACTION: Smart Quotation Builder / คำนวณราคา */}
      <button
        onClick={onOpenBuilder}
        className="flex flex-col items-center justify-center -mt-5 group"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 text-white shadow-lg shadow-red-900/30 ring-4 ring-white flex items-center justify-center transform active:scale-95 transition-all animate-pulse">
          <Sparkles className="w-6 h-6 text-amber-200" />
        </div>
        <span className="text-[10px] font-black text-red-700 mt-1 leading-tight">
          ออกใบเสนอราคา
        </span>
      </button>

      {/* 4. Real-time Live Web Chat / แชทสดหน้าเว็บ */}
      <button
        onClick={() => {
          if (onOpenChat) {
            onOpenChat();
          } else {
            window.location.href = 'https://line.me/ti/p/~pang_baichaa';
          }
        }}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-600 hover:text-red-700 font-bold transition-all relative"
      >
        <div className="p-1 rounded-xl hover:bg-red-50 relative">
          <MessageCircle className="w-5 h-5 text-red-600" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5 text-red-700 font-black">แชทสด</span>
      </button>

      {/* 5. Direct Call / โทรด่วน */}
      <a
        href="tel:0830872257"
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-slate-600 hover:text-red-700 font-bold transition-all"
      >
        <div className="p-1 rounded-xl hover:bg-red-50">
          <Phone className="w-5 h-5 text-red-700 animate-bounce" />
        </div>
        <span className="text-[10px] leading-tight mt-0.5">โทรด่วน</span>
      </a>

    </div>
  );
};
