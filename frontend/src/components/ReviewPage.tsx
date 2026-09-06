import React, { useState } from 'react';
import { Star, Heart, ExternalLink, Sparkles, Crown, Home, Phone, Check, Copy } from 'lucide-react';
import { GOOGLE_MAPS_DIRECT_URL } from './GoogleReviewModal.js';

interface ReviewPageProps {
  onNavigateHome: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ onNavigateHome }) => {
  const [rating, setRating] = useState<number>(5);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const complimentTags = [
    'อาหารอร่อยมาก รสชาติภัตตาคาร 35+ ปี',
    'วัตถุดิบสดใหม่ กุ้งปูตัวโต สะอาด',
    'บริการตรงเวลา ทีมงานสุภาพประทับใจ',
    'โต๊ะเก้าอี้ผ้าคลุมผูกโบว์สวยหรู',
    'คุ้มค่าเกินราคา แนะนำต่อแน่นอนครับ/ค่ะ',
  ];

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2500);
  };

  return (
    <div className="min-h-screen bg-luxury-mesh text-slate-900 font-sans selection:bg-red-600 selection:text-white flex flex-col items-center justify-between p-4 sm:p-6 md:p-10">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-xl flex items-center justify-between py-2">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-slate-700 hover:text-red-700 font-bold text-xs sm:text-sm cursor-pointer"
        >
          <Home className="w-4 h-4 text-red-600" />
          <span>กลับหน้าหลัก</span>
        </button>

        <a
          href="tel:0813311646"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs shadow-xs"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>081-331-1646</span>
        </a>
      </div>

      {/* Main Review Center Card */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-amber-300 shadow-2xl p-6 sm:p-8 space-y-6 text-center my-6 relative overflow-hidden animate-fadeIn">
        
        {/* Decorative Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo & Crown */}
        <div className="flex flex-col items-center space-y-2 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <img
              src="/images/brand/logo.png"
              alt="โต๊ะจีน รพีพัฒน์"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>โต๊ะจีนรพีพัฒน์ นครปฐม</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ขอบพระคุณที่ไว้วางใจบริการ ✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
            ความพึงพอใจของท่านคือกำลังใจอันยิ่งใหญ่ของเรา ร่วมให้คะแนน 5 ดาวเพื่อเป็นเกียรติแก่ทีมงานโต๊ะจีน รพีพัฒน์ นะคะ
          </p>
        </div>

        {/* Interactive 5 Glowing Gold Stars */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/50 border border-amber-200 space-y-3">
          <div className="text-xs font-black text-amber-900 uppercase tracking-wider">
            ⭐ ให้คะแนนความประทับใจ
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transform hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                aria-label={`ให้ ${star} ดาว`}
              >
                <Star
                  className={`w-9 h-9 sm:w-11 sm:h-11 ${
                    star <= rating
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="text-sm font-black text-amber-800">
            {rating === 5 ? '🌟 ยอดเยี่ยมที่สุด 5.0 ดาว' : `ความพึงพอใจ ${rating}.0 ดาว`}
          </div>
        </div>

        {/* Big Pulsing 5-Star Action Button to Google Maps */}
        <div className="space-y-3 pt-2">
          <a
            href={GOOGLE_MAPS_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-red-900/30 border-2 border-amber-300 transform hover:scale-102 active:scale-98 transition-all cursor-pointer animate-pulse"
          >
            <Heart className="w-5 h-5 text-amber-200 fill-amber-200" />
            <span>แตะเพื่อให้คะแนน 5 ดาวบน Google Maps</span>
            <ExternalLink className="w-5 h-5 text-amber-200" />
          </a>
          <p className="text-[11px] text-slate-500 font-medium">
            *ระบบจะเปิดหน้า Google Maps เพื่อให้ท่านยืนยันและโพสต์รีวิวทันทีค่ะ
          </p>
        </div>

        {/* Pre-written Compliment Tags */}
        <div className="space-y-2 pt-2 text-left">
          <div className="text-xs font-black text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>แตะเพื่อคัดลอกข้อความชมเชย (นำไปวางในรีวิวได้ทันที):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {complimentTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleCopyTag(tag)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 text-[11px] font-bold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedTag === tag ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-xs text-slate-500 font-medium">
        © โต๊ะจีน รพีพัฒน์ นครปฐม • จัดเลี้ยงภัตตาคาร 35+ ปี ทั่วไทย
      </div>

    </div>
  );
};
