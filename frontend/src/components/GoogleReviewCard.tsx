import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { DEFAULT_GOOGLE_REVIEW_URL, GOOGLE_MAPS_DIRECT_URL, GoogleReviewModal } from './GoogleReviewModal.js';
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Sparkles,
  Heart,
  Send,
  PartyPopper,
  ThumbsUp,
  MapPin,
  MessageCircle,
  Crown
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
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>(
    'อาหารอร่อยมาก รสชาติภัตตาคาร 35 ปี วัตถุดิบสดใหม่ ปรุงสุกร้อนๆ หน้างาน บริการดีเยี่ยม แขกในงานชมทุกคนค่ะ'
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const reviewUrl = customReviewUrl || DEFAULT_GOOGLE_REVIEW_URL;

  const quickChips = [
    '🍲 อาหารอร่อย 35 ปี',
    '🦞 วัตถุดิบสด กุ้งปลาตัวใหญ่',
    '👔 พนักงานสุภาพ บริการดีตรงเวลา',
    '✨ โต๊ะเก้าอี้ผ้าคลุมสวยหรู',
    '💰 คุ้มค่าคุ้มราคา แนะนำต่อแน่นอน'
  ];

  // Generate ultra-crisp QR code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(reviewUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 500,
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

  const handleAddChip = (chip: string) => {
    const cleanText = chip.replace(/^[^\w\s\u0E00-\u0E7F]+/u, '').trim();
    if (reviewComment.includes(cleanText)) return;
    setReviewComment((prev) => (prev ? `${prev} ${cleanText}` : cleanText));
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewPayload = {
      reviewerName: reviewerName || 'ลูกค้าผู้มีเกียรติ',
      rating,
      comment: reviewComment,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // 1. Save locally
    try {
      const existingReviews = JSON.parse(localStorage.getItem('rapeephat_customer_reviews') || '[]');
      existingReviews.unshift(reviewPayload);
      localStorage.setItem('rapeephat_customer_reviews', JSON.stringify(existingReviews));
    } catch {}

    // 2. Send instant push notification to Khun Pang's iPhone via ntfy
    try {
      await fetch('https://ntfy.sh/rapeephat_live_stream_v4', {
        method: 'POST',
        headers: {
          'Title': `⭐ รีวิว ${rating} ดาวใหม่: ${reviewerName || 'ลูกค้าโต๊ะจีน'}`,
          'Priority': 'high',
          'Tags': 'star,tada,heart,restaurant',
          'Content-Type': 'text/plain; charset=utf-8',
        },
        body: `🎉 ได้รับรีวิว ${rating} ดาว!\n👤 ผู้รีวิว: ${reviewerName || 'ลูกค้า'}\n💬 ข้อความ: "${reviewComment}"\n⏱️ เวลา: ${reviewPayload.dateStr}`,
      });
    } catch (err) {
      console.error('Failed to send review ntfy:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl bg-white border-2 border-amber-300 shadow-2xl shadow-amber-900/10 hover:border-amber-400 transition-all duration-300 p-5 sm:p-8 ${className}`}
      >
        {/* Soft Modern Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Iconic Multi-Color "รีวิว 5 ดาว Google Maps" */}
        <div className="relative z-10 text-center pb-6 mb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-red-50 border border-red-200 text-red-900 text-xs font-black shadow-2xs mb-3">
            <Crown className="w-3.5 h-3.5 text-red-600" />
            <span>👑 โต๊ะจีน รพีพัฒน์ นครปฐม (มาตรฐานภัตตาคาร 35+ ปี)</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            {/* KEYWORD 1: รีวิว */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              รีวิว
            </h2>

            {/* KEYWORD 2: 5 ดาว (Google 4 Colors) */}
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mt-1 flex items-center justify-center gap-1">
              <span className="text-[#EA4335]">5</span>
              <span className="text-[#4285F4]">ด</span>
              <span className="text-[#34A853]">า</span>
              <span className="text-[#FBBC05]">ว</span>
            </div>

            {/* 5 Stars */}
            <div className="flex items-center justify-center gap-1 pt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400 drop-shadow-xs" />
              ))}
            </div>

            {/* KEYWORD 3: Google Maps Badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold shadow-2xs">
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 50 50">
                <path d="M 25 5 C 15.6 5 8 12.6 8 22 C 8 26.5 9.8 30.5 12.8 33.5 L 25 47 L 37.2 33.5 C 40.2 30.5 42 26.5 42 22 C 42 12.6 34.4 5 25 5 Z" fill="#EA4335"/>
                <path d="M 8 22 C 8 27.5 10.8 32.3 15 35.2 L 25 47 L 25 22 Z" fill="#FBBC05"/>
                <path d="M 25 22 L 25 47 L 35 35.2 C 39.2 32.3 42 27.5 42 22 Z" fill="#34A853"/>
                <path d="M 25 5 C 34.4 5 42 12.6 42 22 L 25 22 Z" fill="#4285F4"/>
                <circle cx="25" cy="20" r="7.5" fill="#FFFFFF"/>
              </svg>
              <span className="font-sans font-bold text-slate-800">Google Maps &amp; Google Search</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Interactive Form & QR Code Stand */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column (7 cols): Interactive 5-Star Rating & Review Form */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                แตะให้ 5 ดาว &amp; เขียนความประทับใจ ✨
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">
                ร่วมแบ่งปันความประทับใจในรสชาติอาหารและบริการจัดเลี้ยง โต๊ะจีน รพีพัฒน์ ค่ะ
              </p>
            </div>

            {/* If Submitted: Show Celebration */}
            {isSubmitted ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2 animate-scaleUp text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <PartyPopper className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="text-lg font-black text-emerald-950">
                  ขอบพระคุณสำหรับรีวิว {rating} ดาวอันมีค่ายิ่งค่ะ! 🎉
                </h4>
                <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
                  ทีมงานโต๊ะจีนรพีพัฒน์ได้รับข้อความคำชมและกำลังใจเรียบร้อยแล้วค่ะ ❤️
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-emerald-700 underline pt-1 cursor-pointer"
                >
                  เขียนรีวิวเพิ่มอีกครั้ง
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                
                {/* 5 Big Gold Stars to click directly */}
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-slate-50/80 p-2.5 rounded-2xl border border-amber-200 shadow-2xs w-fit mx-auto lg:mx-0">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeLevel = hoverRating || rating;
                    const isFilled = star <= activeLevel;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transform hover:scale-125 active:scale-95 transition-all cursor-pointer focus:outline-none p-0.5"
                        aria-label={`ให้ ${star} ดาว`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-black text-amber-900 ml-1.5 hidden sm:inline">
                    {rating === 5 ? '🌟 ยอดเยี่ยม 5.0' : `${rating}.0 ดาว`}
                  </span>
                </div>

                {/* Quick Compliment Chips */}
                <div className="space-y-1 text-left">
                  <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-amber-600" />
                    <span>แตะเลือกคำชม:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddChip(chip)}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-800 text-[11px] font-bold border border-amber-200 transition-all hover:scale-102 active:scale-95 cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Name & Comment Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  <input
                    type="text"
                    placeholder="ชื่อของคุณ (ไม่บังคับ)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="sm:col-span-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-amber-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ข้อความรีวิว..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-amber-400 outline-none"
                  />
                </div>

                {/* Action Submit Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                  {/* Primary Instant Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-102 active:scale-98 transition-all cursor-pointer border border-amber-300/40 group disabled:opacity-50"
                  >
                    <Heart className="w-4 h-4 text-amber-200 fill-amber-200 group-hover:scale-110 transition-transform" />
                    <span>{isSubmitting ? 'กำลังส่งรีวิว...' : '⭐ กดส่งรีวิว 5 ดาวทันที'}</span>
                    <Send className="w-4 h-4 text-amber-200" />
                  </button>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-xs transition-all hover:border-slate-400 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-black">คัดลอกแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>คัดลอกลิงก์</span>
                      </>
                    )}
                  </button>

                  {/* Direct Google Maps Link */}
                  <a
                    href={GOOGLE_MAPS_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs border border-amber-400/30"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>เปิด Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                </div>

              </form>
            )}

          </div>

          {/* Right Column (5 cols): High-Impact QR Code Card Container */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              onClick={() => setModalOpen(true)}
              className="w-full max-w-xs group relative p-5 rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-2 border-amber-300 shadow-xl hover:shadow-2xl hover:border-red-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              {/* QR Code Container */}
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-2xl bg-white p-2 border-2 border-amber-300/80 shadow-md flex items-center justify-center relative overflow-hidden group-hover:border-red-500 transition-colors">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code สำหรับให้คะแนน 5 ดาว โต๊ะจีน รพีพัฒน์ บน Google Maps"
                    className="w-full h-full object-contain block"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />
                )}
              </div>

              {/* Status Badge & Actions under QR */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-red-700">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>สแกนด้วยกล้องมือถือเพื่อรีวิว</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  แตะที่รูปเพื่อดูป้ายขยายใหญ่ &amp; สั่งพิมพ์ A4
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs mt-1"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>ดูป้ายตั้งโต๊ะ / พิมพ์ PDF</span>
                </button>
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
