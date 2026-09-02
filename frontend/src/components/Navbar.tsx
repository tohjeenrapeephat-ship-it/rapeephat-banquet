import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, FileText, Menu as MenuIcon, X, Sparkles, Crown } from 'lucide-react';

interface NavbarProps {
  onOpenBuilder: () => void;
  onOpenHistory: () => void;
  onOpenAdmin?: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBuilder, onOpenHistory, onOpenAdmin, historyCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#schedule-queue', label: '📅 ตารางคิวงาน' },
    { href: '#heritage', label: '🏆 ตำนานความอร่อย 35+ ปี' },
    { href: '#menu-showcase', label: 'เมนูอาหาร' },
    { href: '#packages', label: 'แพ็กเกจราคา' },
    { href: '#portfolio', label: 'ผลงานจัดเลี้ยง' },
    { href: '#fleet-logistics', label: '🚚 รถบริการทั่วไทย' },
    { href: '#testimonials', label: 'รีวิวลูกค้า 👍' },
    { href: '#contact', label: 'ติดต่อเรา' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3.5 transition-all duration-300 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 pointer-events-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 lg:gap-4 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-2 border-amber-300/90 shadow-xl shadow-amber-900/10'
            : 'bg-white/90 backdrop-blur-lg border-2 border-amber-200/80 shadow-md shadow-amber-900/5'
        }`}
      >
        {/* ========================================================================= */}
        {/* 👑 LEFT: OFFICIAL ROYAL BRAND LOGO & TITLE (RED & GOLD LUXURY) */}
        {/* ========================================================================= */}
        <a href="#" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center transform group-hover:scale-105 transition-all shrink-0">
            <img
              src="/images/brand/logo.png"
              alt="โต๊ะจีน รพีพัฒน์ RAPEEPHAT"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                โต๊ะจีน<span className="text-red-700 ml-0.5 font-black">รพีพัฒน์</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white rounded-full shadow-xs border border-amber-300">
                PREMIUM
              </span>
            </div>
            <span className="text-xs text-amber-900 font-bold tracking-tight flex items-center gap-1 mt-0.5">
              <Crown className="w-3.5 h-3.5 text-amber-600 inline shrink-0" /> จัดเลี้ยงภัตตาคาร 35+ ปี ทั่วไทย
            </span>
          </div>
        </a>

        {/* ========================================================================= */}
        {/* 🧭 CENTER: MODERN PILL NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center gap-1 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200/80 shadow-2xs">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-slate-800 hover:text-red-700 hover:bg-white hover:shadow-xs transition-all whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* ⚡ RIGHT: ACTION BUTTONS (RED & GOLD LUXURY) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          
          {/* History Button with Gold Rim & Red Badge */}
          <button
            onClick={onOpenHistory}
            className="relative px-3.5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-300/80 text-slate-800 hover:text-red-700 transition-all flex items-center gap-2 text-xs xl:text-sm font-black shadow-2xs whitespace-nowrap cursor-pointer"
            title="ดูประวัติใบเสนอราคา"
          >
            <FileText className="w-4 h-4 text-red-600" />
            <span>ประวัติเอกสาร</span>
            {historyCount > 0 && (
              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] w-4.5 h-4.5 rounded-full font-bold flex items-center justify-center leading-none shadow-xs">
                {historyCount}
              </span>
            )}
          </button>

          {/* Direct Facebook Page Link */}
          <a
            href="https://www.facebook.com/profile.php?id=61593868896647"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border-2 border-blue-300 font-black text-xs xl:text-sm flex items-center gap-1.5 shadow-2xs transition-all whitespace-nowrap"
            title="ติดตามเพจ Facebook โต๊ะจีน รพีพัฒน์"
          >
            <span>📘 เพจ Facebook</span>
          </a>

          {/* Direct Phone Call Button */}
          <a
            href="tel:0813311646"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs xl:text-sm flex items-center gap-2 border border-amber-500/40 shadow-sm transition-all whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 animate-bounce text-amber-400" />
            <span className="text-white font-extrabold">081-331-1646</span>
          </a>

          {/* Primary Action: Dedicated Quotation Builder Page Button */}
          <button
            onClick={onOpenBuilder}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs xl:text-sm flex items-center gap-2 shadow-red-glow border-2 border-amber-300/70 transition-all transform hover:scale-103 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>คำนวณราคา</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 📱 MOBILE & TABLET HAMBURGER BUTTON */}
        {/* ========================================================================= */}
        <div className="flex lg:hidden items-center gap-1.5">
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-2xl bg-white text-slate-700 border border-amber-300 shadow-2xs"
            title="ประวัติเอกสาร"
          >
            <FileText className="w-4 h-4 text-red-600" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-[9px] w-4 h-4 rounded-full font-bold flex items-center justify-center leading-none shadow-xs">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-2xl bg-amber-50 text-slate-800 border border-amber-300 shadow-2xs"
            aria-label="เปิดเมนู"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-700" /> : <MenuIcon className="w-5 h-5 text-slate-800" />}
          </button>
        </div>

      </nav>

      {/* Mobile Drawer (Clean & Modern Red & Gold Glassmorphism) */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto max-w-7xl mx-auto mt-2 bg-white/98 backdrop-blur-2xl border-2 border-amber-300 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-1 text-sm text-slate-800 font-bold">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl hover:bg-amber-50 hover:text-red-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-amber-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBuilder();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-red-glow border border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>คำนวณราคา & ออกใบเสนอราคา A4</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:0813311646"
                className="py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs border border-amber-500/40"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>081-331-1646</span>
              </a>
              <a
                href="https://line.me/ti/p/~pang_baichaa"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl bg-[#06C755] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>LINE ติดต่อเรา</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
