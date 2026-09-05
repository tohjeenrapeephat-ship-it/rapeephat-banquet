import React, { useRef, useState, useEffect } from 'react';
import { QuotationDoc } from '../types/quotation.js';
import { formatCurrency, thaiBahtText } from '../utils/currency.js';
import { formatThaiDate } from '../utils/thaiDate.js';
import { generateA4Pdf } from '../services/pdfService.js';
import { EventLocationQrBadge } from './QuotationBuilder/EventLocationQrBadge.js';
import {
  Printer,
  Download,
  X,
  Sparkles,
  Receipt,
  CheckCircle2,
  Calendar,
  Phone,
  User,
  CreditCard,
  Building,
  QrCode,
  ShieldCheck,
  Award,
  Smartphone,
  Monitor
} from 'lucide-react';

export type ReceiptType = 'deposit_30' | 'final_70' | 'full_100';

interface CateringReceiptModalProps {
  quotation: QuotationDoc;
  isOpen: boolean;
  onClose: () => void;
  initialType?: ReceiptType;
}

export const CateringReceiptModal: React.FC<CateringReceiptModalProps> = ({
  quotation,
  isOpen,
  onClose,
  initialType = 'deposit_30',
}) => {
  const [receiptType, setReceiptType] = useState<ReceiptType>(initialType);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState<'fit' | 'desktop'>('fit');
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-calculate scale factor for mobile screens
  useEffect(() => {
    const handleResize = () => {
      const padding = window.innerWidth < 640 ? 16 : 32;
      const availableWidth = window.innerWidth - padding;
      const targetWidth = 794;
      if (availableWidth < targetWidth) {
        setScale(availableWidth / targetWidth);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !quotation) return null;

  const rawNo = (quotation.quoteNo || quotation.id || Date.now().toString()).replace(/^(QT|Q)-?/i, '');
  const totalTables = (quotation.tableCount || 0) + (quotation.freeTableCount || 0);
  const grandTotal = quotation.grandTotal || 0;
  const depositAmount = quotation.depositAmount || Math.round(grandTotal * 0.3);
  const remainingBalance = grandTotal - depositAmount;

  // Configuration by receipt type
  let receiptTitle = 'ใบเสร็จรับเงินมัดจำ (30%)';
  let badgeText = 'ใบเสร็จรับเงินมัดจำ';
  let receiptNoPrefix = 'REC-DEP';
  let currentPaidAmount = depositAmount;
  let lineItemTitle = 'ค่ามัดจำล็อกคิวงานจัดเลี้ยงโต๊ะจีน (30%)';
  let stampTag = 'PAID 30%';
  let stampLabel = 'รับมัดจำแล้ว';
  let paymentStatusText = 'ชำระเงินมัดจำ 30% เรียบร้อยแล้ว';
  let statusBadge = '✓ PAID DEPOSIT (30%)';

  if (receiptType === 'final_70') {
    receiptTitle = 'ใบเสร็จรับเงินยอดคงเหลือ (70%)';
    badgeText = 'ใบเสร็จยอดคงเหลือ 70%';
    receiptNoPrefix = 'REC-FIN';
    currentPaidAmount = remainingBalance;
    lineItemTitle = 'ค่าบริการจัดเลี้ยงโต๊ะจีนยอดคงเหลือ (70% หลังเสร็จสิ้นงาน)';
    stampTag = 'PAID 70%';
    stampLabel = 'ปิดยอด 100%';
    paymentStatusText = 'ชำระเงินงวดจบ 70% ครบถ้วนสมบูรณ์แล้ว (ปิดยอด 100%)';
    statusBadge = '✓ PAID IN FULL (70%)';
  } else if (receiptType === 'full_100') {
    receiptTitle = 'ใบเสร็จรับเงินเต็มจำนวน (100%)';
    badgeText = 'ใบเสร็จรับเงิน 100%';
    receiptNoPrefix = 'REC-FULL';
    currentPaidAmount = grandTotal;
    lineItemTitle = 'ค่าบริการจัดเลี้ยงโต๊ะจีนเต็มจำนวน (100%)';
    stampTag = 'PAID 100%';
    stampLabel = 'ชำระครบถ้วน';
    paymentStatusText = 'ชำระเงินเต็มจำนวน 100% ครบถ้วนสมบูรณ์แล้ว';
    statusBadge = '✓ PAID 100% FULL';
  }

  const receiptNo = `${receiptNoPrefix}-${rawNo}`;

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const fileName = `${receiptTitle}_${receiptNo}_${quotation.customer?.name || 'ลูกค้า'}.pdf`;
      await generateA4Pdf(printRef.current, fileName);
      setIsGeneratingPdf(false);
    } catch (err) {
      console.error('PDF Generation error:', err);
      setIsGeneratingPdf(false);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณากดปุ่มพิมพ์เอกสารโดยตรง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-400 overflow-hidden my-2 sm:my-4 flex flex-col">
        
        {/* Top Control Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 px-3.5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5 text-white border-b-2 border-emerald-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5">
                <span>{receiptTitle}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hidden sm:inline">
                  A4 1 หน้า
                </span>
              </h3>
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 font-mono">
                เลขที่: <span className="text-emerald-300 font-bold">{receiptNo}</span> • CTR-{rawNo}
              </p>
            </div>
          </div>

          {/* Tab Switcher for Receipt Types */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setReceiptType('deposit_30')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                receiptType === 'deposit_30'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🟢 มัดจำ 30%
            </button>
            <button
              type="button"
              onClick={() => setReceiptType('final_70')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                receiptType === 'final_70'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🔵 ยอดจบ 70%
            </button>
            <button
              type="button"
              onClick={() => setReceiptType('full_100')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                receiptType === 'full_100'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🟣 เต็มจำนวน
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle (Mobile / Desktop) */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'desktop' ? 'fit' : 'desktop')}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-400/40 shadow-xs transition-all cursor-pointer"
              title="สลับมุมมองพอดีจอมือถือ / ขนาดจริง 100%"
            >
              {viewMode === 'desktop' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">ดูแบบพอดีจอมือถือ</span>
                  <span className="sm:hidden">พอดีจอ</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">ดูแบบคอมพิวเตอร์</span>
                  <span className="sm:hidden">แบบคอม</span>
                </>
              )}
            </button>

            {/* Native Browser Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-xs cursor-pointer"
              title="สั่งพิมพ์ใบเสร็จออกเครื่องพิมพ์โดยตรง (A4 เต็มหน้าพอดี 1 แผ่น)"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="hidden sm:inline">พิมพ์ใบเสร็จ</span>
              <span className="sm:hidden">พิมพ์</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all border border-emerald-500 cursor-pointer"
              title="ดาวน์โหลดไฟล์ PDF ใบเสร็จรับเงิน"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{isGeneratingPdf ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="ปิดหน้าต่าง"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Mode Switcher Info Banner */}
        <div className="print:hidden sm:hidden px-3.5 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5 text-[11px]">
            {viewMode === 'desktop' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>มุมมอง: <strong className="text-amber-300">ขนาดจริง A4</strong></span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>มุมมอง: <strong className="text-emerald-300">พอดีจอมือถือ 📱</strong></span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'desktop' ? 'fit' : 'desktop')}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-[10.5px] flex items-center gap-1 shadow-xs cursor-pointer"
          >
            {viewMode === 'desktop' ? 'ดูแบบพอดีจอ' : 'ดูขนาดจริง 100%'}
          </button>
        </div>

        {/* Scrollable Printable A4 Area with Responsive Fit */}
        <div className="p-2 sm:p-4 bg-slate-200/90 flex justify-center items-start overflow-x-auto max-h-[85vh] overflow-y-auto">
          <div
            style={
              viewMode === 'fit' && scale < 1
                ? {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    marginBottom: `-${(1 - scale) * 1123}px`,
                  }
                : {}
            }
            className="transition-transform duration-200 shrink-0"
          >
            {/* Exact Full A4 Printable Sheet (210mm x 297mm Standard) */}
            <div
              ref={printRef}
              className="print-a4-page bg-white text-slate-900 rounded-2xl shadow-xl border-2 border-emerald-300 flex flex-col justify-between relative print:m-0 print:p-5 print:border-none print:shadow-none print:min-h-0"
              style={{
                width: '794px',
                minWidth: '794px',
                minHeight: '1123px',
                padding: '20px 24px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
              }}
            >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <img src="/images/brand/logo.png" alt="" className="w-[420px] h-[420px] object-contain" />
            </div>

            <div className="space-y-2.5 relative z-10 flex-1 flex flex-col justify-between">
              
              {/* 1. Header Section with Brand Logo & Royal Title (Top Aligned) */}
              <div className="flex items-start justify-between pb-2 border-b-2 border-emerald-600 gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {/* Brand Logo */}
                    <div className="flex items-center justify-center shrink-0">
                      <img src="/images/brand/logo.png" alt="ตราสัญลักษณ์ โต๊ะจีน รพีพัฒน์" className="h-16 sm:h-18 w-auto object-contain" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-[26px] font-black text-emerald-900 tracking-tight leading-none">
                        โต๊ะจีน รพีพัฒน์ พรีเมียม
                      </h1>
                      <div className="text-[11px] sm:text-xs font-black text-amber-800 uppercase tracking-wide mt-0.5">
                        RAPEEPHAT BANQUET CATERING
                      </div>
                      <div className="text-[10.5px] sm:text-[11px] font-bold text-amber-900 mt-0.5">
                        • ประสบการณ์จัดเลี้ยงภัตตาคาร 35+ ปี
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-[11px] text-slate-800 pt-0.5 space-y-0.5 font-medium leading-snug">
                    <div>
                      <strong className="text-slate-950 font-bold">สำนักงานใหญ่:</strong> 50/8 ม. 4 ต. คลองสาม อ.คลองหลวง จ.ปทุมธานี 12120
                    </div>
                    <div>
                      <strong className="text-slate-950 font-bold">ฐานผลิตโรงครัวกลาง:</strong> 72/7 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม 73000
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 pt-0.5">
                      <span><strong className="text-slate-950 font-bold">โทร:</strong> <strong className="text-emerald-800 font-black font-mono text-[12px]">081-331-1646</strong> (คุณแป้ง)</span>
                      <span><strong className="text-slate-950 font-bold">LINE:</strong> pang_baichaa</span>
                    </div>
                    <div>
                      <strong className="text-slate-950 font-bold">อีเมล:</strong>{' '}
                      <span className="font-sans font-semibold text-slate-900 tracking-normal">
                        info<span className="font-sans text-[13px] font-bold text-emerald-800 px-0.5">@</span>rapeephat-catering.com
                      </span>
                      <span className="text-slate-400 mx-2 font-light">|</span>
                      <span className="font-sans font-semibold text-slate-900 tracking-normal">
                        baicha<span className="font-sans text-[13px] font-bold text-emerald-800 px-0.5">@</span>rapeephat-catering.com
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-gradient-to-br from-emerald-50 to-teal-50 p-2 px-3.5 rounded-2xl border-2 border-emerald-200 shadow-2xs -mt-1">
                  <div className="text-xs font-black text-emerald-800 flex items-center justify-end gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{badgeText}</span>
                  </div>
                  <div className="text-xs text-slate-900 font-mono font-bold mt-0.5">
                    เลขที่: <span className="text-emerald-700 font-black text-sm">{receiptNo}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    วันที่: {formatThaiDate(new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 2. Customer, Event Details & Google Maps QR Code */}
              <div className="grid grid-cols-12 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs items-stretch">
                <div className="col-span-5 space-y-1.5">
                  <div className="font-black text-emerald-900 text-[11.5px] border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-700" /> ได้รับเงินจาก (ผู้ว่าจ้าง / ลูกค้า):
                  </div>
                  <div><span className="text-slate-500 font-medium">ชื่อลูกค้า:</span> <strong className="text-slate-950 font-bold text-sm ml-1">{quotation.customer?.name || 'ลูกค้าผู้มีเกียรติ'}</strong></div>
                  <div><span className="text-slate-500 font-medium">เบอร์โทรศัพท์:</span> <strong className="font-mono text-emerald-800 text-xs font-black ml-1">{quotation.customer?.phone || '-'}</strong></div>
                  <div><span className="text-slate-500 font-medium">ประเภทงาน:</span> <strong className="text-slate-900 font-bold ml-1">{quotation.customer?.eventType || 'งานจัดเลี้ยงมงคล'}</strong></div>
                </div>

                <div className="col-span-4 space-y-1.5 border-l border-slate-200 pl-2.5">
                  <div className="font-black text-emerald-900 text-[11.5px] border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" /> ข้อมูลงานจัดเลี้ยง:
                  </div>
                  <div><span className="text-slate-500 font-medium">วันจัดงาน:</span> <strong className="text-slate-950 font-bold ml-1">{formatThaiDate(quotation.customer?.eventDate || new Date().toISOString())}</strong></div>
                  <div><span className="text-slate-500 font-medium">เวลาเริ่มงาน:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer?.eventTime || '11:00 น.'}</strong></div>
                  <div><span className="text-slate-500 font-medium">สถานที่:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer?.eventLocation || 'ตามที่ลูกค้ากำหนด'}</strong></div>
                </div>

                <div className="col-span-3 border-l border-slate-200 pl-2.5 flex items-stretch">
                  <EventLocationQrBadge
                    location={quotation.customer?.eventLocation || ''}
                    size={70}
                    variant="vertical"
                    theme="emerald"
                    className="w-full"
                  />
                </div>
              </div>

              {/* 3. Receipt Line Items Table */}
              <div className="rounded-xl border-2 border-slate-200 overflow-hidden text-xs shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-[11.5px] font-bold">
                    <tr>
                      <th className="p-3 text-center w-12">ลำดับ</th>
                      <th className="p-3">รายการรับชำระ</th>
                      <th className="p-3 text-center w-28">จำนวนโต๊ะ</th>
                      <th className="p-3 text-right w-40">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="p-3.5 text-center text-slate-400 font-bold text-sm">1</td>
                      <td className="p-3.5">
                        <div className="font-black text-slate-950 text-sm">
                          {lineItemTitle}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          • แพ็กเกจอาหาร: <strong className="text-emerald-900">{quotation.package?.name}</strong> (@{formatCurrency(quotation.package?.price || 0)}.-/โต๊ะ)<br />
                          {quotation.travelFee && quotation.travelFee.amount > 0 ? (
                            <>• รวมค่าเดินทางขนส่ง: <strong className="font-mono text-slate-800">{formatCurrency(quotation.travelFee.amount)}.-</strong> (สั่งไม่ถึง 20 โต๊ะ)<br /></>
                          ) : quotation.tableCount >= 20 ? (
                            <>• สิทธิประโยชน์: <strong className="text-emerald-700">ฟรีค่าเดินทางขนส่ง 100%</strong> (สั่งครบ 20 โต๊ะขึ้นไป)<br /></>
                          ) : null}
                          {receiptType === 'final_70' && (
                            <>
                              • หักยอดเงินมัดจำล็อกคิว 30% ที่ชำระแล้ว: <strong className="font-mono text-slate-700">{formatCurrency(depositAmount)}.-</strong><br />
                              • ยอดคงเหลือชำระในงวดนี้ (70%): <strong className="font-mono text-emerald-800 font-bold">{formatCurrency(remainingBalance)}.-</strong> (ปิดยอดครบถ้วน)
                            </>
                          )}
                          {receiptType === 'deposit_30' && (
                            <>
                              • อ้างอิงสัญญาเลขที่: <span className="font-mono text-emerald-800 font-bold">CTR-{rawNo}</span><br />
                              • ยอดคงเหลือชำระวันงาน (70%): <span className="font-mono text-slate-700">{formatCurrency(remainingBalance)}.-</span>
                            </>
                          )}
                          {receiptType === 'full_100' && (
                            <>
                              • ชำระค่าบริการจัดเลี้ยงเต็มจำนวน 100% รวมทั้งสิ้น: <strong className="font-mono text-emerald-800">{formatCurrency(grandTotal)}.-</strong>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-900 text-sm">
                        {quotation.tableCount} โต๊ะ {quotation.freeTableCount > 0 && <span className="text-emerald-700 font-black text-xs block">(+แถมฟรี {quotation.freeTableCount})</span>}
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-800 font-mono text-base">
                        {formatCurrency(currentPaidAmount)}.-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. Financial Summary Card with Baht Text */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50 p-4 rounded-xl border-2 border-emerald-300 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between text-xs">
                      <span>มูลค่างานจัดเลี้ยงรวมทั้งสิ้น:</span>
                      <strong className="font-mono text-slate-950">{formatCurrency(grandTotal)} บาท</strong>
                    </div>

                    {receiptType === 'deposit_30' && (
                      <>
                        <div className="flex justify-between text-emerald-900 font-bold text-xs">
                          <span>ยอดเงินมัดจำที่ชำระในงวดนี้ (30%):</span>
                          <strong className="font-mono text-emerald-800 text-sm font-black">{formatCurrency(depositAmount)} บาท</strong>
                        </div>
                        <div className="flex justify-between text-red-700 text-xs">
                          <span>ยอดคงเหลือชำระวันงาน (70%):</span>
                          <strong className="font-mono font-bold">{formatCurrency(remainingBalance)} บาท</strong>
                        </div>
                      </>
                    )}

                    {receiptType === 'final_70' && (
                      <>
                        <div className="flex justify-between text-slate-600 text-xs">
                          <span>ยอดเงินมัดจำที่ชำระแล้วก่อนหน้า (30%):</span>
                          <strong className="font-mono">{formatCurrency(depositAmount)} บาท</strong>
                        </div>
                        <div className="flex justify-between text-emerald-900 font-bold text-xs">
                          <span>ยอดเงินที่ได้รับชำระในงวดนี้ (70%):</span>
                          <strong className="font-mono text-emerald-800 text-sm font-black">{formatCurrency(remainingBalance)} บาท</strong>
                        </div>
                        <div className="flex justify-between text-emerald-700 text-xs font-bold">
                          <span>ยอดคงเหลือสุทธิหลังชำระ:</span>
                          <strong className="font-mono text-emerald-800">0.00 บาท (ชำระครบถ้วน 100%)</strong>
                        </div>
                      </>
                    )}

                    {receiptType === 'full_100' && (
                      <>
                        <div className="flex justify-between text-emerald-900 font-bold text-xs">
                          <span>ยอดเงินที่ได้รับชำระทั้งสิ้น (100%):</span>
                          <strong className="font-mono text-emerald-800 text-sm font-black">{formatCurrency(grandTotal)} บาท</strong>
                        </div>
                        <div className="flex justify-between text-emerald-700 text-xs font-bold">
                          <span>ยอดคงเหลือสุทธิ:</span>
                          <strong className="font-mono text-emerald-800">0.00 บาท (ชำระครบถ้วน 100%)</strong>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border-2 border-emerald-300 flex flex-col justify-center text-center shadow-2xs">
                    <div className="text-[11px] font-bold text-emerald-900">
                      {receiptType === 'deposit_30' && 'จำนวนเงินมัดจำที่ได้รับชำระแล้ว'}
                      {receiptType === 'final_70' && 'จำนวนเงินงวดคงเหลือ 70% ที่ได้รับชำระแล้ว'}
                      {receiptType === 'full_100' && 'จำนวนเงินที่ได้รับชำระทั้งสิ้น'}
                    </div>
                    <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">{formatCurrency(currentPaidAmount)} บาท</div>
                    <div className="text-[10.5px] text-slate-800 font-black mt-1 bg-emerald-50 py-0.5 px-2 rounded-lg inline-block mx-auto border border-emerald-200">
                      ({thaiBahtText(currentPaidAmount)})
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Payment Channel & Thai QR Code Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 sm:w-16 sm:h-18 rounded-lg bg-white p-0.5 border border-purple-300 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="/images/payment/scb-qr.jpg" alt="Thai QR Payment SCB" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>สถานะการชำระเงิน: <strong className="text-emerald-800">{paymentStatusText}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      โอนผ่านบัญชี <strong>ธ.ไทยพาณิชย์ (SCB) 411-239908-0</strong> หรือชำระเงินสด ณ สถานที่จัดงาน
                    </p>
                    <p className="text-[10.5px] text-slate-500">
                      ชื่อบัญชี: <strong>นางสาวทัศวรรณ จันทร์หอม</strong> (ฝ่ายบัญชีและการผลิตหลัก โรงครัวกลาง)
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black shrink-0 border border-emerald-300 shadow-2xs">
                  {statusBadge}
                </div>
              </div>

              {/* 6. Signature Section with Seal */}
              <div className="grid grid-cols-2 gap-8 pt-3 border-t-2 border-slate-200">
                <div className="text-center space-y-6">
                  <div className="text-xs font-bold text-slate-700">ผู้ชำระเงิน / ผู้ว่าจ้าง</div>
                  <div className="space-y-1">
                    <div className="w-48 mx-auto border-b border-dashed border-slate-400" />
                    <div className="text-xs font-black text-slate-900">({quotation.customer?.name || '...........................................'})</div>
                    <div className="text-[10px] text-slate-500 font-medium">วันที่ชำระ: ......./......./...........</div>
                  </div>
                </div>

                <div className="text-center space-y-2 relative">
                  <div className="flex items-end justify-center text-xs font-bold text-slate-700 gap-1 pb-1">
                    <span>ลงชื่อ</span>
                    <div className="relative inline-flex items-end justify-center min-w-[170px] border-b border-dotted border-slate-500 pb-0.5 px-2">
                      <img
                        src="/images/brand/signature-rapeephat-p.png"
                        alt="ลายเซ็น Rapeephat P."
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 h-10 w-auto object-contain mix-blend-multiply filter contrast-200 brightness-75 drop-shadow-xs select-none pointer-events-none z-10"
                      />
                      <span className="invisible text-[10px]">...........................................</span>
                    </div>
                    <span>ผู้รับเงิน (โต๊ะจีนรพีพัฒน์)</span>
                  </div>
                  
                  {/* Subtle Modern Official Shop Logo Watermark */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 opacity-25 pointer-events-none select-none flex items-center justify-center">
                    <img
                      src="/images/brand/logo.png"
                      alt="ตราสัญลักษณ์ โต๊ะจีน รพีพัฒน์"
                      className="w-full h-full object-contain filter contrast-125"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-slate-900">( นางสาวใบชา สุขอยู่ )</div>
                    <div className="text-[10px] text-slate-700 font-bold">ผู้ประกอบการ / เจ้าของแบรนด์ โต๊ะจีนรพีพัฒน์ พรีเมียม</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-[9.5px] text-slate-400 pt-3 border-t border-slate-100 relative z-10">
              {receiptTitle}ฉบับนี้ออกโดย โต๊ะจีน รพีพัฒน์ พรีเมียม • ขอบพระคุณที่ไว้วางใจให้เราดูแลวันสำคัญของคุณ
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
