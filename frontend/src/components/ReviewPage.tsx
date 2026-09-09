import React, { useState } from 'react';
import {
  Star,
  Heart,
  ExternalLink,
  Sparkles,
  Crown,
  Home,
  Phone,
  Check,
  Copy,
  MessageCircle,
  Send,
  PartyPopper,
  ThumbsUp,
  MapPin,
  UtensilsCrossed
} from 'lucide-react';
import { GOOGLE_MAPS_DIRECT_URL } from './GoogleReviewModal.js';

interface ReviewPageProps {
  onNavigateHome: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ onNavigateHome }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [eventType, setEventType] = useState<string>('งานมงคล / จัดเลี้ยงทั่วไป');
  const [reviewComment, setReviewComment] = useState<string>(
    'อาหารอร่อยมาก รสชาติภัตตาคาร 35 ปี วัตถุดิบสดใหม่ ปรุงสุกร้อนๆ หน้างาน บริการดีเยี่ยม แขกในงานชมทุกคนครับ/ค่ะ'
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const complimentChips = [
    '🍲 อาหารอร่อยมาก รสชาติเข้มข้น 35 ปี',
    '🦞 วัตถุดิบสดใหม่ กุ้งปลาตัวใหญ่ ปรุงร้อนๆ',
    '👔 พนักงานสุภาพ บริการดี ตรงต่อเวลา',
    '✨ โต๊ะเก้าอี้ผ้าคลุมผูกโบว์สวยหรู สะอาด',
    '💰 คุ้มค่าคุ้มราคา แขกในงานชมทุกคน',
    '👍 แนะนำต่อแน่นอน ไม่ผิดหวังเลยค่ะ'
  ];

  const handleAddChip = (chip: string) => {
    const cleanText = chip.replace(/^[^\w\s\u0E00-\u0E7F]+/u, '').trim();
    if (reviewComment.includes(cleanText)) return;
    setReviewComment((prev) => (prev ? `${prev} ${cleanText}` : cleanText));
  };

  const handleCopyReviewText = () => {
    navigator.clipboard.writeText(reviewComment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewPayload = {
      reviewerName: reviewerName || 'ลูกค้าผู้มีเกียรติ',
      eventType,
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

    // 1. Save to local storage
    try {
      const existingReviews = JSON.parse(localStorage.getItem('rapeephat_customer_reviews') || '[]');
      existingReviews.unshift(reviewPayload);
      localStorage.setItem('rapeephat_customer_reviews', JSON.stringify(existingReviews));
    } catch {}

    // 2. Send instant real-time notification to Khun Pang's iPhone via ntfy
    try {
      await fetch('https://ntfy.sh/rapeephat_live_stream_v4', {
        method: 'POST',
        headers: {
          'Title': `⭐ รีวิว ${rating} ดาวใหม่: ${reviewerName || 'ลูกค้าโต๊ะจีน'}`,
          'Priority': 'high',
          'Tags': 'star,tada,heart,restaurant',
          'Content-Type': 'text/plain; charset=utf-8',
        },
        body: `🎉 ได้รับรีวิว ${rating} ดาว!\n👤 ผู้รีวิว: ${reviewerName || 'ไม่ระบุชื่อ'} (${eventType})\n💬 ข้อความ: "${reviewComment}"\n⏱️ เวลา: ${reviewPayload.dateStr}`,
      });
    } catch (err) {
      console.error('Failed to send review ntfy:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const lineReviewUrl = `https://line.me/ti/p/~pang_baichaa`;

  return (
    <div className="min-h-screen bg-luxury-mesh text-slate-900 font-sans selection:bg-red-600 selection:text-white flex flex-col items-center justify-between p-3 sm:p-6 md:p-10">
      
      {/* Top Header Bar */}
      <header className="w-full max-w-2xl flex items-center justify-between py-2 px-1">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-slate-700 hover:text-red-700 font-black text-xs sm:text-sm cursor-pointer bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:border-red-300 transition-all"
        >
          <Home className="w-4 h-4 text-red-600" />
          <span>กลับหน้าหลัก</span>
        </button>

        <a
          href="tel:0813311646"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 font-black text-xs shadow-xs border border-amber-400/40 hover:bg-black transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>081-331-1646 (คุณแป้ง)</span>
        </a>
      </header>

      {/* Main Review Card Container */}
      <main className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-amber-300 shadow-2xl p-5 sm:p-8 space-y-6 text-center my-4 relative overflow-hidden animate-fadeIn">
        
        {/* Soft Decorative Ambient Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2.5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 flex items-center justify-center border-2 border-amber-300 shadow-md">
            <img
              src="/images/brand/logo.png"
              alt="โต๊ะจีน รพีพัฒน์ นครปฐม"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-amber-950 text-xs font-black border border-amber-300 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>โต๊ะจีน รพีพัฒน์ พรีเมียม (ต้นตำรับนครปฐม 35+ ปี)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            ร่วมให้คะแนน 5 ดาว & รีวิวความประทับใจ ✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
            หากท่านประทับใจในรสชาติอาหาร ความสะอาด และการบริการของโต๊ะจีนรพีพัฒน์
            ขอเชิญร่วมมอบกำลังใจ 5 ดาวให้แก่ทีมงานได้ที่นี่เลยนะคะ
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ⭐ INTERACTIVE STAR RATING SECTION */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-amber-50/60 border-2 border-amber-300 shadow-inner space-y-3 relative z-10">
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>แตะที่ดาวเพื่อเลือกคะแนนความพึงพอใจ</span>
          </div>

          {/* 5 Big Gold Stars */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 py-1">
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
                  className="transform hover:scale-125 active:scale-95 transition-all cursor-pointer focus:outline-none p-1"
                  aria-label={`ให้ ${star} ดาว`}
                >
                  <Star
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.7)] scale-105'
                        : 'text-slate-300 hover:text-amber-200'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="inline-block px-4 py-1 rounded-full bg-white border border-amber-300 text-sm font-black text-amber-900 shadow-2xs">
            {rating === 5 && '🌟🌟🌟🌟🌟 ยอดเยี่ยมที่สุด 5.0 ดาว (ประทับใจมาก)'}
            {rating === 4 && '⭐⭐⭐⭐ ดีมาก 4.0 ดาว'}
            {rating === 3 && '⭐⭐⭐ ปานกลาง 3.0 ดาว'}
            {rating === 2 && '⭐⭐ พอใช้ 2.0 ดาว'}
            {rating === 1 && '⭐ ต้องปรับปรุง 1.0 ดาว'}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📝 FORM / SUCCESS VIEW */}
        {/* ========================================================================= */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-4 animate-scaleUp text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <PartyPopper className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
              ขอบพระคุณสำหรับรีวิว {rating} ดาวอันมีค่ายิ่งค่ะ! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium max-w-md mx-auto">
              ทีมงานโต๊ะจีน รพีพัฒน์ ทุกคนได้รับข้อความคำชมและกำลังใจของท่านเรียบร้อยแล้วค่ะ และจะรักษามาตรฐานความอร่อยให้ดียิ่งขึ้นไปค่ะ ❤️
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={GOOGLE_MAPS_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-102 transition-transform"
              >
                <MapPin className="w-4 h-4 text-amber-200" />
                <span>เปิดดูตำแหน่งหมุดร้านบน Google Maps</span>
              </a>

              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
            
            {/* Reviewer Name & Event Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  ชื่อผู้รีวิว / เจ้าภาพ (ไม่บังคับ):
                </label>
                <input
                  type="text"
                  placeholder="เช่น คุณสมชาย หรือ แขกในงานแต่ง"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  ประเภทงานจัดเลี้ยง:
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all cursor-pointer"
                >
                  <option value="งานมงคลสมรส (งานแต่งงาน)">💍 งานมงคลสมรส (งานแต่งงาน)</option>
                  <option value="งานบุญ / งานอุปสมบท (งานบวช)">🙏 งานบุญ / งานอุปสมบท (งานบวช)</option>
                  <option value="งานเลี้ยงบริษัท / งานองค์กร">🏢 งานเลี้ยงบริษัท / งานองค์กร</option>
                  <option value="งานทำบุญบ้าน / ขึ้นบ้านใหม่">🏡 งานทำบุญบ้าน / ขึ้นบ้านใหม่</option>
                  <option value="งานวันเกิด / สังสรรค์ครอบครัว">🎂 งานวันเกิด / สังสรรค์ครอบครัว</option>
                  <option value="งานจัดเลี้ยงทั่วไป">🍲 งานจัดเลี้ยงทั่วไป</option>
                </select>
              </div>
            </div>

            {/* Quick Compliment Tags */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-black text-slate-700 flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                <span>แตะเพื่อเพิ่มข้อความคำชม (กดได้หลายข้อความ):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {complimentChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddChip(chip)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-slate-800 text-[11px] font-bold border border-amber-200 transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700">
                  ข้อความรีวิว / ความประทับใจ:
                </label>
                <button
                  type="button"
                  onClick={handleCopyReviewText}
                  className="text-[11px] font-bold text-slate-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="พิมพ์ความประทับใจในรสชาติอาหาร บริการ หรือบรรยากาศในงาน..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
              />
            </div>

            {/* Action Submit Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Button 1: Submit 5 Stars to Restaurant Directly */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-red-900/25 border-2 border-amber-300 transform hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                <Heart className="w-5 h-5 text-amber-200 fill-amber-200 animate-pulse" />
                <span>{isSubmitting ? 'กำลังบันทึกรีวิว...' : '⭐ ส่งรีวิว 5 ดาวให้ร้านทันที'}</span>
                <Send className="w-4 h-4 text-amber-200" />
              </button>

              {/* Secondary Buttons Row: Google Maps & LINE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Button: Open Google Maps Direct */}
                <a
                  href={GOOGLE_MAPS_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md border border-amber-400/40 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>เปิด Google Maps (พิกัดนครปฐม)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>

                {/* Button: Send review to LINE */}
                <a
                  href={lineReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>ส่งคำชมทาง LINE คุณแป้ง</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              </div>

            </div>

          </form>
        )}

        {/* Bottom Guarantee Note */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
          <span>ครัวรพีพัฒน์ นครปฐม • 72 หมู่ 1 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม</span>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 font-medium py-3">
        © โต๊ะจีน รพีพัฒน์ นครปฐม • รับจัดเลี้ยงภัตตาคาร 35+ ปี ทั่วประเทศไทย
      </footer>

    </div>
  );
};
