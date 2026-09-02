import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { formatThaiDateShort, getDayOfWeekThai } from '../services/queueService.js';
import {
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  Crown,
  X
} from 'lucide-react';

export interface AvailableQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // ISO format "YYYY-MM-DD" or similar
  availableTables?: number | string;
  note?: string;
  province?: string;
  isAvailableCapacity?: boolean;
  onProceedToBuilder?: (selectedDate: string) => void;
}

export const AvailableQueueModal: React.FC<AvailableQueueModalProps> = ({
  isOpen,
  onClose,
  date,
  availableTables,
  note,
  province,
  isAvailableCapacity,
  onProceedToBuilder,
}) => {
  // Trigger celebratory confetti on open
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.55 },
          colors: ['#10B981', '#059669', '#34D399', '#F59E0B', '#EF4444'],
          disableForReducedMotion: true,
        });
      } catch {
        // Safe fallback if confetti isn't supported
      }

      // Close on Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !date) return null;

  const thaiDateFormatted = formatThaiDateShort(date);
  
  // Format table quota display
  const tableDisplay = availableTables
    ? typeof availableTables === 'number'
      ? `${availableTables} โต๊ะ`
      : availableTables.toString().includes('โต๊ะ')
      ? availableTables.toString()
      : `${availableTables} โต๊ะ`
    : '10 - 200 โต๊ะ';

  const isPartiallyFilled = Boolean(isAvailableCapacity || (availableTables && typeof availableTables === 'number'));

  const handleProceed = () => {
    if (onProceedToBuilder) {
      onProceedToBuilder(date);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden text-slate-900 p-6 sm:p-7 space-y-4 sm:space-y-5 my-auto transform transition-all">
        
        {/* Top Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-20 cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 🟢 Top Mascot Sticker: Joyful Chef Celebrating Open/Available Queue */}
        <div className="flex flex-col items-center justify-center -mt-2">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 transform hover:scale-105 transition-transform duration-300">
            <img
              src="/images/stickers/chef-happy.jpg"
              alt="เชฟโต๊ะจีนรพีพัฒน์ ยินดีให้บริการค่ะ"
              className="w-full h-full object-contain drop-shadow-xl animate-pulse"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 🏷️ Top Status Pills Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1 shadow-2xs">
            👑 แจ้งสถานะคิวงานจัดเลี้ยง
          </span>
          {isPartiallyFilled ? (
            <span className="text-xs font-black text-amber-950 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1 shadow-2xs">
              🎪 พร้อมรับจัดเลี้ยง {tableDisplay}
            </span>
          ) : (
            <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1 shadow-2xs">
              🟢 คิวงานว่าง พร้อมบริการ
            </span>
          )}
        </div>

        {/* 📢 Title & Subtitle Announcement */}
        <div className="text-center space-y-1.5">
          <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-snug">
            ยินดีต้อนรับค่ะ! 🎉<br />
            <span className="text-emerald-700 font-black">
              {isPartiallyFilled
                ? `วันที่ ${thaiDateFormatted} คิวงานยังไม่เต็มค่ะ`
                : `วันที่ ${thaiDateFormatted} คิวงานว่างพร้อมให้บริการค่ะ`}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1 max-w-md mx-auto">
            ทีมเชฟมืออาชีพและขบวนรถครัวสัญจรพร้อมบริการปรุงอาหารสุกร้อนสดๆ หน้างาน และดูแลแขกผู้มีเกียรติของท่านอย่างสมเกียรติระดับภัตตาคาร 35+ ปีค่ะ
          </p>
        </div>

        {/* 📌 Note / Table Capacity Pill Box */}
        <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-900 text-center">
          {note ? (
            <span>• {note}</span>
          ) : isPartiallyFilled ? (
            <span>• คิวงานยังไม่เต็มค่ะ (รับได้ตามจำนวน {tableDisplay})</span>
          ) : (
            <span>• คิวงานว่างพร้อมให้บริการเต็มรูปแบบ สามารถจองล็อกวันและออกใบเสนอราคาได้ทันทีนะคะ</span>
          )}
        </div>

        {/* ✨ Privileges & Services Box */}
        <div className="p-4 bg-gradient-to-br from-amber-50/50 via-emerald-50/30 to-emerald-50/70 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-slate-800 font-medium space-y-1.5 text-left">
          <div className="font-black text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm pb-0.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>สิทธิพิเศษ & การบริการที่ท่านจะได้รับ:</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            • <strong>โปรโมชัน 35 ปี:</strong> สั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะทันที (สั่ง 40 แถม 2)
          </p>
          <p className="leading-relaxed text-slate-700">
            • <strong>ฟรีอุปกรณ์ครบชุด:</strong> โต๊ะ เก้าอี้เบาะนุ่มผูกโบว์หรูหรา และทีมบริกรประจำโต๊ะ
          </p>
          <p className="leading-relaxed text-slate-700">
            • <strong>รสชาติภัตตาคาร:</strong> ปรุงสดใหม่หน้างาน 100% วัตถุดิบเกรดพรีเมียม
          </p>
        </div>

        {/* 📞 Contact Channels (Call / LINE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Call Button */}
          <a
            href="tel:0813311646"
            className="py-3 px-3 rounded-2xl bg-[#0a6c4b] hover:bg-[#085a3e] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-amber-300 shrink-0" />
            <span>โทรล็อกคิว 081-331-1646</span>
          </a>

          {/* LINE Button */}
          <a
            href="https://line.me/ti/p/~pang_baichaa"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 shrink-0 fill-current" />
            <span>ทัก LINE: คุณแป้ง</span>
          </a>
        </div>

        {/* 🔴 Large Prominent Red Button (ไปที่ฟอร์มเลือกอาหาร & ออกใบเสนอราคา) */}
        <div className="space-y-2 pt-0.5">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-102 active:scale-98 border border-red-400 cursor-pointer"
          >
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
            <span>ไปที่ฟอร์มเลือกอาหาร & ออกใบเสนอราคา (ฟรี)</span>
          </button>

          {/* ⚪ Dismiss / Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
