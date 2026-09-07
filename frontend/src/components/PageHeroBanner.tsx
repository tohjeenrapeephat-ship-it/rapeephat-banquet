import React from 'react';
import { Crown, Sparkles, ChevronRight, Home, Phone } from 'lucide-react';

interface PageHeroBannerProps {
  badge: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  breadcrumb: string;
  onNavigateHome: () => void;
  onOpenBuilder?: () => void;
  ctaText?: string;
}

export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  badge,
  title,
  highlightText,
  subtitle,
  breadcrumb,
  onNavigateHome,
  onOpenBuilder,
  ctaText = 'คำนวณราคาโต๊ะจีน',
}) => {
  return (
    <div className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-transparent border-b border-amber-200/60 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>หน้าแรก</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-700 font-bold">{breadcrumb}</span>
        </div>

        {/* Banner Content Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-red-700 to-amber-600 text-white text-xs font-black shadow-xs border border-amber-300/60">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>{badge}</span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              <span>{title}</span>
              {highlightText && (
                <span className="block mt-1 sm:mt-1.5 text-gradient-red-gold">
                  {highlightText}
                </span>
              )}
            </h1>

            {/* Page Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenBuilder && (
              <button
                type="button"
                onClick={onOpenBuilder}
                className="px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-red-glow border-2 border-amber-300/80 transition-all transform hover:scale-103 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{ctaText}</span>
              </button>
            )}

            <a
              href="tel:0813311646"
              className="px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-amber-500/40 shadow-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span className="text-white font-black">081-331-1646</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
