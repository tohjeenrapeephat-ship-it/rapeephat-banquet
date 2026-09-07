import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, FileText, Menu as MenuIcon, X, Sparkles, Crown, ChevronRight, Home, Utensils, Award, Calendar, MapPin, Layers } from 'lucide-react';
import { trackClickToCall, trackPageView } from '../utils/googleAnalytics.js';

export type PageView =
  | 'home'
  | 'menu'
  | 'packages'
  | 'quotation'
  | 'portfolio'
  | 'heritage'
  | 'contact'
  | 'review'
  | 'admin';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (page: PageView) => void;
  onOpenHistory: () => void;
  onOpenAdmin?: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenHistory,
  onOpenAdmin,
  historyCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navPages: { id: PageView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'หน้าแรก', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'menu', label: 'เมนูอาหาร', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'packages', label: 'แพ็กเกจราคา', icon: <Layers className="w-3.5 h-3.5" />, badge: '1,400-6,000฿' },
    { id: 'portfolio', label: 'ผลงานจัดเลี้ยง', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'heritage', label: 'ตำนาน 35+ ปี', icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'คิวงาน & ติดต่อ', icon: <Calendar className="w-3.5 h-3.5" /> },
  ];

  const handlePageClick = (pageId: PageView) => {
    trackPageView(pageId);
    setMobileMenuOpen(false);
    onNavigate(pageId);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-6 pt-2 sm:pt-3 transition-all duration-300 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 pointer-events-auto px-2.5 sm:px-4 xl:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-3 w-full ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-2 border-amber-300/90 shadow-xl shadow-amber-900/10'
            : 'bg-white/92 backdrop-blur-lg border-2 border-amber-200/80 shadow-md shadow-amber-900/5'
        }`}
      >
        {/* ========================================================================= */}
        {/* 👑 LEFT: OFFICIAL ROYAL BRAND LOGO & TITLE (CLICKABLE -> HOME) */}
        {/* ========================================================================= */}
        <button
          type="button"
          onClick={() => handlePageClick('home')}
          className="flex items-center gap-1.5 sm:gap-2 group shrink-0 text-left cursor-pointer select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transform group-hover:scale-105 transition-all shrink-0">
            <img
              src="/images/brand/logo.png"
              alt="โต๊ะจีน รพีพัฒน์ RAPEEPHAT"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-none">
                โต๊ะจีน<span className="text-red-700 ml-0.5 font-black">รพีพัฒน์</span>
              </span>
              <span className="px-1.5 py-0.5 text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white rounded-full shadow-xs border border-amber-300">
                PREMIUM
              </span>
            </div>
            <span className="text-[10px] text-amber-900 font-bold tracking-tight hidden 2xl:flex items-center gap-1 mt-0.5">
              <Crown className="w-3 h-3 text-amber-600 inline shrink-0" />
              <span>จัดเลี้ยง 35+ ปี ทั่วไทย</span>
            </span>
          </div>
        </button>

        {/* ========================================================================= */}
        {/* 🧭 CENTER: MODERN MULTI-PAGE SWITCHER PILLS (DESKTOP & LAPTOP) */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-amber-50/80 p-1 rounded-2xl border border-amber-300/70 shadow-2xs shrink-0">
          {navPages.map((page) => {
            const isActive = currentView === page.id;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => handlePageClick(page.id)}
                className={`px-2 xl:px-3 py-1 xl:py-1.5 rounded-xl text-[11px] xl:text-xs 2xl:text-sm font-bold flex items-center gap-1 xl:gap-1.5 transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md shadow-red-900/20 font-black border border-amber-300'
                    : 'text-slate-700 hover:text-red-700 hover:bg-white/90 hover:shadow-xs'
                }`}
              >
                <span className={isActive ? 'text-amber-300' : 'text-slate-500'}>
                  {page.icon}
                </span>
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ⚡ RIGHT: KEY ACTIONS (CALCULATOR CTA • CALL • HISTORY) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex items-center gap-1 xl:gap-2 shrink-0">
          
          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative p-1.5 xl:px-2.5 xl:py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-slate-800 hover:text-red-700 transition-all flex items-center gap-1 text-xs font-bold shadow-2xs whitespace-nowrap cursor-pointer"
            title="ดูประวัติใบเสนอราคา"
          >
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden 2xl:inline">ประวัติ</span>
            {historyCount > 0 && (
              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[8.5px] w-4 h-4 rounded-full font-bold flex items-center justify-center leading-none shadow-xs">
                {historyCount}
              </span>
            )}
          </button>

          {/* Direct Phone Call Button */}
          <a
            href="tel:0813311646"
            onClick={() => trackClickToCall('navbar_desktop')}
            className="p-1.5 xl:px-2.5 xl:py-1.5 rounded-xl bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/40 shadow-xs transition-all whitespace-nowrap"
            title="โทรด่วน โต๊ะจีน รพีพัฒน์: 081-331-1646"
          >
            <Phone className="w-3.5 h-3.5 animate-bounce text-amber-400" />
            <span className="text-white font-extrabold hidden xl:inline">081-331-1646</span>
          </a>

          {/* Primary Action: Dedicated Quotation Page CTA */}
          <button
            type="button"
            onClick={() => handlePageClick('quotation')}
            className={`px-2.5 xl:px-3.5 py-1.5 rounded-xl font-black text-[11.5px] xl:text-xs flex items-center gap-1 shadow-red-glow border transition-all transform hover:scale-103 active:scale-95 whitespace-nowrap cursor-pointer ${
              currentView === 'quotation'
                ? 'bg-amber-400 text-red-950 border-white ring-2 ring-amber-400 font-black'
                : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white border-amber-300/80'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${currentView === 'quotation' ? 'text-red-700 animate-spin' : 'text-amber-300'}`} />
            <span>คำนวณราคา</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 📱 MOBILE & TABLET COMPACT CONTROLS */}
        {/* ========================================================================= */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          {/* Quick Quotation Button for Mobile */}
          <button
            type="button"
            onClick={() => handlePageClick('quotation')}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-xs flex items-center gap-1 shadow-sm border border-amber-300/60"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>คำนวณราคา</span>
          </button>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative p-1.5 rounded-xl bg-white text-slate-700 border border-amber-300 shadow-2xs"
            title="ประวัติเอกสาร"
          >
            <FileText className="w-4 h-4 text-red-600" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-[8px] w-3.5 h-3.5 rounded-full font-bold flex items-center justify-center leading-none shadow-xs">
                {historyCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl bg-amber-50 text-slate-800 border border-amber-300 shadow-2xs cursor-pointer"
            aria-label="เปิดเมนูนำทาง"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-700" /> : <MenuIcon className="w-5 h-5 text-slate-800" />}
          </button>
        </div>

      </nav>

      {/* ========================================================================= */}
      {/* 📱 MOBILE SLIDE-OUT DRAWER (FULL MULTI-PAGE DIRECTORY) */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto max-w-7xl mx-auto mt-2 bg-white/98 backdrop-blur-2xl border-2 border-amber-300 rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xl animate-fadeIn">
          
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>เลือกหน้าเมนู (Multi-Page Navigation)</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-red-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grid of Pages for Mobile */}
          <div className="grid grid-cols-2 gap-2">
            {navPages.map((page) => {
              const isActive = currentView === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handlePageClick(page.id)}
                  className={`p-3 rounded-2xl text-left transition-all flex items-center justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black border-amber-300 shadow-md'
                      : 'bg-amber-50/60 hover:bg-amber-100/70 text-slate-800 font-bold border-amber-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isActive ? 'text-amber-300' : 'text-red-600'}>
                      {page.icon}
                    </span>
                    <span className="text-xs sm:text-sm">{page.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-amber-300" />}
                </button>
              );
            })}
          </div>

          {/* Key Actions in Drawer */}
          <div className="pt-2 border-t border-amber-200 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handlePageClick('quotation')}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-red-glow border border-amber-300 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>คำนวณราคา & ออกใบเสนอราคา A4</span>
            </button>

            {/* Social Channels Row */}
            <div className="grid grid-cols-3 gap-1.5">
              <a
                href="https://web.facebook.com/profile.php?id=61593868896647"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>📘 Facebook</span>
              </a>
              <a
                href="https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 rounded-xl bg-pink-50 text-pink-950 border border-pink-200 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>🎵 TikTok</span>
              </a>
              <a
                href="https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 rounded-xl bg-red-50 text-red-950 border border-red-200 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>▶️ YouTube</span>
              </a>
            </div>

            {/* Hotlines Row */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:0813311646"
                className="py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs border border-amber-500/40"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>081-331-1646</span>
              </a>
              <a
                href="https://line.me/ti/p/~pang_baichaa"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 rounded-xl bg-[#06C755] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>LINE ติดต่อเรา</span>
              </a>
            </div>

            {/* Admin Portal link in Drawer */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 text-center py-1 mt-1 font-medium"
              >
                ⚙️ เข้าสู่ระบบจัดการหลังร้าน (Admin Portal)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

