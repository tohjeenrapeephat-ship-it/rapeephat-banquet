import React, { useState, useEffect } from 'react';
import { QuotationDoc } from '../../types/quotation.js';
import { formatCurrency, thaiBahtText } from '../../utils/currency.js';
import { formatThaiDate } from '../../utils/thaiDate.js';
import { sendOrderToLine } from '../../utils/lineOrderHelper.js';
import confetti from 'canvas-confetti';
import {
  X,
  MessageCircle,
  Phone,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Crown,
  Calendar,
  Users,
  Utensils,
  ArrowRight
} from 'lucide-react';

interface BookingStepsModalProps {
  quotation: QuotationDoc;
  isOpen: boolean;
  onClose: () => void;
  onViewQuotation: () => void;
}

export const BookingStepsModal: React.FC<BookingStepsModalProps> = ({
  quotation,
  isOpen,
  onClose,
  onViewQuotation,
}) => {
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);

  // Trigger celebration confetti upon opening
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DC2626', '#EA580C', '#10B981', '#F59E0B', '#FFFFFF'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen || !quotation) return null;

  const depositAmount = quotation.depositAmount || Math.round(quotation.grandTotal * 0.3);
  const finalAmount = quotation.grandTotal - depositAmount;
  const displayQuoteNo = quotation.quoteNo ? quotation.quoteNo.replace(/^QT-/, 'QT') : '';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('4112399080');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(depositAmount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 3000);
  };

  const handleSendToLine = () => {
    sendOrderToLine(quotation);
  };

  const handleCall = () => {
    window.location.href = 'tel:0813311646';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 flex justify-center items-center">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden my-auto animate-fadeIn flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-800 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-300 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  ขั้นตอนการสั่งจอง & ล็อกคิวงานจัดเลี้ยง
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-[10px] font-bold">
                  3 ขั้นตอนง่ายๆ
                </span>
              </div>
              <p className="text-xs text-amber-200 font-bold">
                โต๊ะจีน รพีพัฒน์ พรีเมียม (ประสบการณ์ 35+ ปี)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          
          {/* Order Summary Mini Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-red-50/40 border-2 border-amber-300 shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-700 text-white font-black text-xs">
                  {displayQuoteNo}
                </span>
                <span className="font-black text-slate-900 text-sm sm:text-base">
                  เจ้าภาพ: {quotation.customer.name}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <span>วันจัดงาน: <strong className="text-red-700 font-black">{formatThaiDate(quotation.customer.eventDate)}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold block">แพ็กเกจ</span>
                <strong className="text-slate-900 font-black text-xs sm:text-sm truncate block">
                  {quotation.package.name}
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold block">จำนวนโต๊ะ</span>
                <strong className="text-slate-900 font-black text-xs sm:text-sm block">
                  {quotation.tableCount} โต๊ะ {quotation.freeTableCount > 0 && <span className="text-emerald-700 text-xs">(แถม {quotation.freeTableCount})</span>}
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold block">ยอดรวมทั้งสิ้น</span>
                <strong className="text-slate-900 font-mono font-black text-xs sm:text-sm block">
                  {formatCurrency(quotation.grandTotal)}.-
                </strong>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-2 rounded-xl shadow-xs border border-amber-300">
                <span className="text-[11px] text-amber-200 font-black block">มัดจำล็อกคิว 30%</span>
                <strong className="text-white font-mono font-black text-xs sm:text-base block">
                  {formatCurrency(depositAmount)}.-
                </strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: Add LINE แจ้งคุณแป้ง */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-green-400 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#06C755] text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#06C755]" />
                    <span>ขั้นตอนที่ 1: Add LINE แจ้งรายการออร์เดอร์คุณแป้ง</span>
                  </h4>
                  <span className="text-[10.5px] px-2 py-0.2 rounded-full bg-green-100 text-green-900 font-black border border-green-300">
                    สะดวก & รวดเร็ว
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  กดปุ่มด้านล่างเพื่อส่งข้อมูลออร์เดอร์นี้เข้า LINE คุณแป้งโดยตรง (LINE ID: <strong className="text-slate-900 font-black font-mono">pang_baichaa</strong>) หรือโทร <strong className="text-red-700 font-mono font-black">081-331-1646</strong>
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleSendToLine}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#06C755] to-emerald-600 hover:from-[#05b34c] hover:to-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all border border-green-300 cursor-pointer transform hover:scale-[1.02] active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>📲 กดส่งออร์เดอร์นี้เข้า LINE คุณแป้งทันที</span>
              </button>

              <button
                type="button"
                onClick={handleCall}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors border border-amber-500/40 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>โทร 081-331-1646</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 2: โอนเงินมัดจำ 30% เพื่อล็อกคิวงาน */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/90 via-white to-purple-50/70 border-2 border-purple-300 shadow-sm space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm sm:text-base font-black text-purple-950 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-purple-700" />
                    <span>ขั้นตอนที่ 2: โอนเงินมัดจำล็อกคิวงาน 30% ({formatCurrency(depositAmount)} บาท)</span>
                  </h4>
                  <span className="text-[10.5px] px-2 py-0.2 rounded-full bg-purple-100 text-purple-900 font-black border border-purple-300">
                    ธ.ไทยพาณิชย์
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  ชำระมัดจำ 30% เพื่อยืนยันล็อกคิวเชฟและอุปกรณ์จัดเลี้ยง (ยอดคงเหลือ 70% ชำระในวันงานจริงหลังเสร็จสิ้น)
                </p>
              </div>
            </div>

            {/* Bank Card Details */}
            <div className="grid sm:grid-cols-12 gap-3.5 bg-white p-3.5 rounded-2xl border border-purple-200 shadow-2xs items-center">
              {/* Official SCB QR Code */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 rounded-xl bg-purple-50/60 border border-purple-200">
                <div className="w-24 h-28 rounded-lg bg-white p-1 border border-purple-300 shadow-xs flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/payment/scb-qr.jpg"
                    alt="สแกนจ่าย Thai QR Payment / SCB"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-1 flex items-center gap-1">
                  <QrCode className="w-3 h-3" /> สแกนผ่านแอปธนาคาร
                </span>
              </div>

              {/* Bank Account Info */}
              <div className="sm:col-span-8 space-y-2">
                <div>
                  <span className="text-slate-500 font-bold text-xs block">ธนาคาร:</span>
                  <strong className="text-slate-950 font-black text-sm">
                    ธนาคารไทยพาณิชย์ (SCB)
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 font-bold text-xs block">ชื่อบัญชี:</span>
                  <strong className="text-purple-950 font-black text-sm sm:text-base">
                    นางสาวทัศวรรณ จันทร์หอม
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 font-bold text-xs block">เลขที่บัญชี:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <strong className="font-mono text-lg sm:text-xl font-black text-purple-950 bg-purple-50 px-3 py-1 rounded-xl border border-purple-300 tracking-wider">
                      411-239908-0
                    </strong>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'คัดลอกแล้ว' : 'คัดลอกเลขบัญชี'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <span className="text-slate-600 font-bold text-xs">ยอดมัดจำที่ต้องโอน:</span>
                  <strong className="text-red-700 font-mono font-black text-base">
                    {formatCurrency(depositAmount)} บาท
                  </strong>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="text-xs text-purple-700 hover:text-purple-900 underline font-bold cursor-pointer"
                  >
                    {copiedAmount ? '✓ คัดลอกแล้ว' : 'คัดลอกยอดเงิน'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 3: แนบสลิปทาง LINE เพื่อรับใบเสร็จ & สัญญาจ้าง */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>ขั้นตอนที่ 3: แนบสลิปโอนเงินทาง LINE เพื่อรับใบเสร็จ & สัญญาจ้างงาน</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  เมื่อโอนเงินเรียบร้อยแล้ว กรุณาส่งสลิปหลักฐานทาง LINE คุณแป้ง เจ้าหน้าที่จะบันทึกล็อกคิวงานในระบบ 100% พร้อมออกใบเสร็จรับเงินมัดจำ (30%) และสัญญาว่าจ้างบริการจัดเลี้ยงให้ท่านทันทีค่ะ
                </p>
              </div>
            </div>
          </div>

          {/* Policy Notice Box (Non-Refundable Deposit on Cancellation) */}
          <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-950 text-xs space-y-1 font-medium">
            <div className="flex items-center gap-1.5 font-black text-red-800 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>เงื่อนไขการล็อกคิว & การยกเลิกงาน:</span>
            </div>
            <p className="leading-relaxed">
              • เมื่อชำระเงินมัดจำและยืนยันล็อกคิวงานแล้ว <strong className="text-red-700 font-black">ทางร้านขอสงวนสิทธิ์ไม่คืนเงินมัดจำทุกกรณี หากมีการยกเลิกงาน</strong> เพื่อชดเชยการปฏิเสธลูกค้ารายอื่นและการสำรองคิวจัดเลี้ยงล่วงหน้า
            </p>
            <p className="text-[11px] text-slate-600">
              • ยอดคงเหลืออีก 70% ({formatCurrency(finalAmount)} บาท) ชำระในวันจัดงานจริงหลังเสร็จสิ้นพิธีเลี้ยง
            </p>
          </div>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>โทรสายตรงคุณแป้ง: <a href="tel:0813311646" className="text-amber-300 font-black underline font-mono text-sm">081-331-1646</a></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onViewQuotation}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>ดูใบเสนอราคา A4</span>
            </button>

            <button
              type="button"
              onClick={handleSendToLine}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06C755] to-emerald-600 hover:from-[#05b34c] hover:to-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all border border-green-300 cursor-pointer transform hover:scale-102"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>📲 เปิดแชท LINE ส่งออร์เดอร์</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
