import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { MapPin, Navigation, ExternalLink, Sparkles } from 'lucide-react';

interface EventLocationQrBadgeProps {
  location: string;
  size?: number;
  variant?: 'vertical' | 'horizontal' | 'compact';
  showDetails?: boolean;
  className?: string;
  theme?: 'gold' | 'red' | 'slate' | 'emerald';
}

export const EventLocationQrBadge: React.FC<EventLocationQrBadgeProps> = ({
  location,
  size = 76,
  variant = 'vertical',
  showDetails = true,
  className = '',
  theme = 'gold',
}) => {
  const cleanLocation = (location || '').trim();
  const mapsQuery = cleanLocation || 'นครปฐม';
  
  // Clean, short, universal Google Maps navigation URL
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Generate ultra-high resolution 600x600px lossless PNG QR Code via official standard qrcode engine
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(googleMapsUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 600,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating high-res QR code:', err);
        // Instant fallback to high-resolution API
        if (isMounted) {
          setQrDataUrl(
            `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(googleMapsUrl)}&margin=2`
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [googleMapsUrl]);

  // Theme styling
  const themeStyles = {
    gold: {
      card: 'bg-gradient-to-b from-amber-50 via-white to-amber-50/70 border-2 border-amber-300 shadow-2xs',
      badge: 'bg-amber-100 text-amber-950 border-amber-300',
      icon: 'text-red-600',
      title: 'text-red-700',
      tag: 'bg-red-700 text-white',
    },
    red: {
      card: 'bg-gradient-to-b from-red-50 via-white to-amber-50/70 border-2 border-red-300 shadow-2xs',
      badge: 'bg-red-100 text-red-950 border-red-300',
      icon: 'text-red-700',
      title: 'text-red-800',
      tag: 'bg-red-700 text-white',
    },
    slate: {
      card: 'bg-slate-50 border-2 border-slate-300 shadow-2xs',
      badge: 'bg-slate-100 text-slate-900 border-slate-300',
      icon: 'text-slate-700',
      title: 'text-slate-900',
      tag: 'bg-slate-800 text-white',
    },
    emerald: {
      card: 'bg-gradient-to-b from-emerald-50 via-white to-teal-50/70 border-2 border-emerald-300 shadow-2xs',
      badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      icon: 'text-emerald-700',
      title: 'text-emerald-800',
      tag: 'bg-emerald-700 text-white',
    },
  }[theme];

  // Vertical Card Variant (Tailored for Quotation & Document A4 Section 2)
  if (variant === 'vertical') {
    return (
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="สแกนด้วยกล้องมือถือหรือคลิกเพื่อเปิดแผนที่นำทาง Google Maps"
        className={`group relative flex flex-col items-center justify-between p-2 rounded-xl ${themeStyles.card} hover:border-red-500 hover:shadow-md transition-all cursor-pointer text-center w-full h-full ${className}`}
      >
        {/* Header Title with Map Pin */}
        <div className="flex items-center justify-center gap-1 w-full pb-1 border-b border-amber-200">
          <MapPin className={`w-3.5 h-3.5 ${themeStyles.icon} shrink-0 fill-red-600/20`} />
          <span className={`text-[10.5px] font-black uppercase tracking-tight ${themeStyles.title}`}>
            แผนที่จัดงาน
          </span>
          <span className="text-[7.5px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            GPS สด
          </span>
        </div>

        {/* 100% High-Contrast, Crystal-Clear, Unobstructed QR Code */}
        <div className="relative my-1 flex items-center justify-center">
          <div
            className="rounded-lg bg-white p-1 border-2 border-slate-300 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-102"
            style={{ width: `${size + 8}px`, height: `${size + 8}px` }}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code นำทาง: ${mapsQuery}`}
                crossOrigin="anonymous"
                className="w-full h-full object-contain block bg-white"
                style={{ imageRendering: 'crisp-edges' }}
              />
            ) : (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
            )}
          </div>
        </div>

        {/* Instruction Footer (High Legibility Thai Text) */}
        <div className="space-y-0.5 w-full pt-0.5" style={{ lineHeight: '1.25', overflow: 'visible' }}>
          <div className="text-[9px] font-black text-slate-900 flex items-center justify-center gap-1 leading-tight">
            <Navigation className="w-2.5 h-2.5 text-red-600 shrink-0" />
            <span>สแกนนำทาง Google Maps</span>
          </div>
          <div className="text-[8px] text-slate-600 font-bold leading-tight">
            เปิด GPS สำหรับรถครัว & แขก
          </div>
        </div>
      </a>
    );
  }

  // Horizontal Card Variant
  if (variant === 'horizontal') {
    return (
      <div
        className={`rounded-xl p-2.5 flex items-center gap-3 transition-all ${themeStyles.card} ${className}`}
      >
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="คลิกเพื่อเปิด Google Maps ไปยังสถานที่จัดงาน"
          className="relative rounded-lg bg-white p-1 border-2 border-slate-300 shadow-xs flex items-center justify-center shrink-0 hover:scale-103 transition-transform cursor-pointer"
          style={{ width: `${size + 8}px`, height: `${size + 8}px` }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code นำทาง: ${mapsQuery}`}
              crossOrigin="anonymous"
              className="w-full h-full object-contain block bg-white"
              style={{ imageRendering: 'crisp-edges' }}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
          )}
        </a>

        {showDetails && (
          <div className="flex-1 min-w-0 space-y-1" style={{ lineHeight: '1.35', overflow: 'visible' }}>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-black uppercase tracking-tight flex items-center gap-1 ${themeStyles.title}`}>
                <MapPin className={`w-3.5 h-3.5 ${themeStyles.icon} shrink-0 fill-red-600/20`} />
                <span>แผนที่จัดงาน (Google Maps)</span>
              </span>
              <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                GPS สด
              </span>
            </div>

            <div className="text-[10px] text-slate-700 font-medium leading-snug">
              สแกนด้วยกล้องมือถือ เพื่อเปิดระบบ GPS นำทางรถครัวและแขกผู้ร่วมงานทันที
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-black text-red-700 hover:text-red-800 hover:underline pt-0.5 cursor-pointer"
            >
              <span>เปิดนำทางในแอป Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // Compact Variant
  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="สแกนด้วยกล้องมือถือหรือคลิกเพื่อเปิดแผนที่นำทาง Google Maps"
      className={`group relative flex flex-col items-center justify-center p-1.5 rounded-xl ${themeStyles.card} hover:border-red-500 transition-all cursor-pointer ${className}`}
    >
      <div
        className="relative rounded-lg bg-white p-0.5 border-2 border-slate-300 shadow-xs flex items-center justify-center shrink-0"
        style={{ width: `${size + 6}px`, height: `${size + 6}px` }}
      >
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR Code นำทาง: ${mapsQuery}`}
            crossOrigin="anonymous"
            className="w-full h-full object-contain block bg-white"
            style={{ imageRendering: 'crisp-edges' }}
          />
        ) : (
          <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
        )}
      </div>

      <div className="text-center mt-0.5 space-y-0.2">
        <div className={`flex items-center justify-center gap-0.5 text-[9px] font-black ${themeStyles.title}`}>
          <Navigation className="w-2.5 h-2.5" />
          <span>สแกนนำทาง</span>
        </div>
        <div className="text-[8px] text-slate-600 font-bold leading-tight">
          Google Maps
        </div>
      </div>
    </a>
  );
};
