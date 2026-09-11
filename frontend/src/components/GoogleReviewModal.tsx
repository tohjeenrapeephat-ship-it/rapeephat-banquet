import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Star,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Crown,
  Smartphone
} from 'lucide-react';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customReviewUrl?: string;
}

export const EXACT_GOOGLE_MAPS_REVIEW_URL =
  'https://g.page/r/CX9Q5ttfJy6iEAE/review';

export const DEFAULT_GOOGLE_REVIEW_URL = EXACT_GOOGLE_MAPS_REVIEW_URL;
export const GOOGLE_MAPS_DIRECT_URL = EXACT_GOOGLE_MAPS_REVIEW_URL;

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({
  isOpen,
  onClose,
  customReviewUrl,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  const reviewUrl = customReviewUrl || DEFAULT_GOOGLE_REVIEW_URL;

  // Generate ultra-high resolution QR Code with clean big blocks for instant scan
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    QRCode.toDataURL(reviewUrl, {
      errorCorrectionLevel: 'M',
      margin: 3,
      width: 700,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR Code render error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, reviewUrl]);

  // Handle Copy Review Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Direct Download of PNG QR Code
  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'QR_Code_รีวิว_Google_Maps_โต๊ะจีนรพีพัฒน์.png';
    link.href = qrDataUrl;
    link.click();
  };

  // Handle Print Table Tent Stand
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center overflow-y-auto p-2 sm:p-4 md:p-6 animate-fadeIn selection:bg-red-500 selection:text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* ========================================================================= */}
        {/* 🌟 MODAL HEADER (GOOGLE COLORS + BRAND GOLD) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white border-b-2 border-amber-400 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-amber-300">
              <img
                src="/images/brand/logo.png"
                alt="โต๊ะจีน รพีพัฒน์"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  GOOGLE MAPS & BUSINESS
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/40">
                  ⭐⭐⭐⭐⭐ 5.0 RATED
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                QR Code รีวิว 5 ดาว บน Google Maps
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 📱 INTERACTIVE REVIEW & QR CODE STAND CARD */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-7 space-y-5 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
          
          {/* Main Card to be Scanned or Printed as Table Tent */}
          <div
            ref={cardRef}
            className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl text-center space-y-4 relative overflow-hidden"
          >
            {/* Top Google & Rating Badges */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-900 text-xs font-black shadow-2xs">
                <Crown className="w-3.5 h-3.5 text-red-600" />
                <span>👑 โต๊ะจีน รพีพัฒน์ (นครปฐม)</span>
              </div>

              {/* Iconic Keyword: รีวิว 5 ดาว */}
              <div className="pt-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  รีวิว
                </div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mt-1 flex items-center justify-center gap-1">
                  <span className="text-[#EA4335]">5</span>
                  <span className="text-[#4285F4]">ด</span>
                  <span className="text-[#34A853]">า</span>
                  <span className="text-[#FBBC05]">ว</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 pt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-xs" />
                ))}
              </div>

              {/* Google Maps Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 50 50">
                  <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
                  <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
                  <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
                  <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
                  <circle cx="25" cy="20" r="7.5" fill="#FFFFFF"/>
                </svg>
                <span className="font-sans font-bold text-slate-700">Google Maps</span>
              </div>
            </div>

            {/* QR Code Frame with Gold Corner Accents (100% Unobstructed Crisp PNG) */}
            <div className="flex justify-center py-2">
              <div className="p-3.5 rounded-3xl bg-white border-3 border-amber-400 shadow-lg relative group">
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QR Code รีวิว Google Maps"
                      className="w-full h-full object-contain block bg-white"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="pt-1 space-y-1">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>เปิดกล้องมือถือแล้วส่องที่ QR Code เพื่อรีวิวได้ทันที</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                ครัวรพีพัฒน์ (โต๊ะจีน รพีพัฒน์) • 72 หมู่ 1 ต.นครปฐม อ.เมืองนครปฐม • โทร: 081-331-1646
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 🛠️ ACTION BUTTONS (DIRECT REVIEW / COPY / DOWNLOAD PNG / PRINT STAND) */}
          {/* ========================================================================= */}
          <div className="space-y-2.5">
            
            {/* Primary Button: Open Review Page Direct */}
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-102 cursor-pointer border border-amber-300"
            >
              <Star className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>เปิดหน้ารีวิวและให้คะแนน 5 ดาวทันที</span>
              <ExternalLink className="w-4 h-4 text-amber-200" />
            </a>

            {/* Grid of Secondary Utility Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-400 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">คัดลอกสำเร็จ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>คัดลอกลิงก์รีวิว</span>
                  </>
                )}
              </button>

              {/* Download PNG QR Code */}
              <button
                type="button"
                onClick={handleDownloadQrPng}
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>โหลดรูป QR (PNG)</span>
              </button>

              {/* Print Table Tent / Stand */}
              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>พิมพ์ป้ายตั้งโต๊ะ</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
