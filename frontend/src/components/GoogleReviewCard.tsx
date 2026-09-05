import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { DEFAULT_GOOGLE_REVIEW_URL, GoogleReviewModal } from './GoogleReviewModal.js';
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Sparkles,
  Heart
} from 'lucide-react';

interface GoogleReviewCardProps {
  customReviewUrl?: string;
  className?: string;
}

export const GoogleReviewCard: React.FC<GoogleReviewCardProps> = ({
  customReviewUrl,
  className = '',
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const reviewUrl = customReviewUrl || DEFAULT_GOOGLE_REVIEW_URL;

  // Generate ultra-crisp, high-contrast QR code for instant scanning
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(reviewUrl, {
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
        console.error('QR error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [reviewUrl]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-orange-50/25 border-2 border-amber-200/90 shadow-xl shadow-amber-900/5 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 ${className}`}
      >
        {/* Soft Background Accents */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Left / Top Details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            
            {/* Google Badge & 5-Star Tag */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                {/* Google "G" Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-xs font-black text-slate-800 tracking-wide">
                  Google Maps Review
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/60 text-amber-900 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>คะแนนความพึงพอใจ 5.0 ⭐</span>
              </div>
            </div>

            {/* Glowing 5 Stars */}
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)] transition-transform hover:scale-125 cursor-pointer"
                  />
                ))}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                สแกน QR Code เพื่อให้คะแนน 5 ดาว ✨
              </h3>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                หากคุณประทับใจในรสชาติอาหารและบริการโต๊ะจีน รพีพัฒน์
                สามารถสแกน QR Code หรือกดปุ่มด้านล่างเพื่อร่วมให้คะแนน 5 ดาวบน Google Maps ได้ง่ายๆ เลยนะคะ
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {/* Primary Direct Review Button */}
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 text-white font-black text-sm shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-102 active:scale-98 transition-all cursor-pointer border border-amber-300/40 group"
              >
                <Heart className="w-4 h-4 text-amber-200 fill-amber-200 group-hover:scale-110 transition-transform" />
                <span>แตะเพื่อให้คะแนน 5 ดาวทันที</span>
                <ExternalLink className="w-4 h-4 text-amber-200" />
              </a>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-all hover:border-slate-400 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-black">คัดลอกลิงก์แล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>คัดลอกลิงก์</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right / QR Code Card - Clean, High Aesthetic, Simple */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              onClick={() => setModalOpen(true)}
              className="group relative p-4 rounded-3xl bg-white border-2 border-amber-300/90 shadow-xl hover:shadow-2xl hover:border-red-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center gap-3"
            >
              {/* QR Code Container with subtle frame */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-2 border border-slate-100 shadow-inner flex items-center justify-center relative overflow-hidden">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code สำหรับให้คะแนน 5 ดาว โต๊ะจีน รพีพัฒน์"
                    className="w-full h-full object-contain block"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />
                )}
              </div>

              {/* Status Badge under QR */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:text-red-700 transition-colors">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>สแกนด้วยกล้องมือถือ</span>
                <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors ml-0.5" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Print / Enlarge Modal */}
      <GoogleReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customReviewUrl={customReviewUrl}
      />
    </>
  );
};
