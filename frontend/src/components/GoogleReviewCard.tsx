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
  MessageCircle
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
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 border-2 border-amber-300 shadow-xl shadow-amber-900/5 hover:border-amber-400 transition-all duration-300 p-5 sm:p-7 ${className}`}
      >
        {/* Soft Background Accents */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Left: 1-Click Interactive 5-Star Rating & Review Form */}
          <div className="flex-1 w-full space-y-4 text-center lg:text-left">
            
            {/* Google Badge & 5-Star Tag */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
                {/* Google "G" Icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-xs font-black text-slate-800 tracking-wide">
                  รีวิวความประทับใจ
                </span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/60 text-amber-950 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>คะแนนความพึงพอใจ 5.0 ⭐</span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                แตะเลือก 5 ดาว & กดส่งรีวิวได้ทันที ✨
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">
                ร่วมให้คะแนน 5 ดาวเพื่อเป็นเกียรติและกำลังใจแก่ทีมงานโต๊ะจีน รพีพัฒน์ นครปฐม ค่ะ
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
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-white/90 p-2.5 rounded-2xl border border-amber-200 shadow-2xs w-fit mx-auto lg:mx-0">
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
                    className="sm:col-span-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:border-amber-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ข้อความรีวิว..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:border-amber-400 outline-none"
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
                    className="inline-flex items-center gap-1 px-3 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs border border-amber-400/30"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span className="hidden sm:inline">Google Maps นครปฐม</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                </div>

              </form>
            )}

          </div>

          {/* Right / QR Code Card - Clean, High Aesthetic */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              onClick={() => setModalOpen(true)}
              className="group relative p-3.5 rounded-3xl bg-white border-2 border-amber-300/90 shadow-xl hover:shadow-2xl hover:border-red-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center gap-2"
            >
              {/* QR Code Container */}
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-white p-1.5 border border-slate-100 shadow-inner flex items-center justify-center relative overflow-hidden">
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
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 group-hover:text-red-700 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>สแกนด้วยกล้องมือถือ</span>
                <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-red-600 transition-colors" />
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
