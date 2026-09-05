import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { DEFAULT_GOOGLE_REVIEW_URL, GoogleReviewModal } from './GoogleReviewModal.js';
import {
  Star,
  QrCode,
  ExternalLink,
  Crown,
  Smartphone,
  Copy,
  Check
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

  // Generate ultra-high resolution, 100% scannable QR Code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(reviewUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 600,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
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
        className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-red-50/30 border-2 border-amber-300 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}
      >
        {/* Decorative Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Info & 5-Star Badges */}
        <div className="space-y-3.5 flex-1 text-center md:text-left">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border border-amber-300 text-red-950 text-xs font-black shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>GOOGLE MAPS & GOOGLE MY BUSINESS</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-2xs" />
              ))}
              <span className="ml-1.5 text-sm font-black text-slate-900 bg-amber-100 px-2 py-0.2 rounded-md border border-amber-300">
                5.0 ⭐
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              สแกน QR Code เพื่อรีวิว 5 ดาว บน Google Maps
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              ร่วมส่งต่อความประทับใจในรสชาติอาหารโต๊ะจีนนครปฐมแท้ และบริการจัดเลี้ยง เพื่อเป็นกำลังใจให้ทีมงานโต๊ะจีนรพีพัฒน์ค่ะ
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            
            {/* Open Modal Fullscreen Stand */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer border border-amber-300"
            >
              <QrCode className="w-4 h-4 text-amber-200" />
              <span>ดูป้าย QR Code ขนาดใหญ่</span>
            </button>

            {/* Direct Link to Google Maps */}
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-amber-300 hover:text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border border-amber-400/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิด Google Maps</span>
            </a>

            {/* Copy Review Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-black">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>คัดลอกลิงก์</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Column: High-Resolution Scan QR Box (100% Unobstructed & Ultra Sharp) */}
        <div
          onClick={() => setModalOpen(true)}
          className="shrink-0 p-3 rounded-2xl bg-white border-2 border-amber-300 shadow-md flex flex-col items-center gap-2 cursor-pointer hover:border-red-500 hover:shadow-lg transition-all group"
          title="คลิกเพื่อเปิดดูป้าย QR Code ขยายใหญ่และสั่งพิมพ์"
        >
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl bg-white p-1.5 border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden">
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
          <span className="text-[11px] font-black text-slate-700 group-hover:text-red-700 transition-colors flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>สแกนด้วยกล้องมือถือ</span>
          </span>
        </div>

      </div>

      {/* Google Review Modal */}
      <GoogleReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customReviewUrl={customReviewUrl}
      />
    </>
  );
};
