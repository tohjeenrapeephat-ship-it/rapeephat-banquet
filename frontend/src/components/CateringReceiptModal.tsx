import React, { useRef, useState } from 'react';
import { QuotationDoc } from '../types/quotation.js';
import { formatCurrency, thaiBahtText } from '../utils/currency.js';
import { formatThaiDate } from '../utils/thaiDate.js';
import { generateA4Pdf } from '../services/pdfService.js';
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
  Award
} from 'lucide-react';

interface CateringReceiptModalProps {
  quotation: QuotationDoc;
  isOpen: boolean;
  onClose: () => void;
}

export const CateringReceiptModal: React.FC<CateringReceiptModalProps> = ({
  quotation,
  isOpen,
  onClose,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !quotation) return null;

  const displayQuoteNo = quotation.quoteNo || `Q-${Date.now().toString().slice(-6)}`;
  const receiptNo = `REC-${displayQuoteNo.replace(/^Q-/, '')}`;
  const totalTables = (quotation.tableCount || 0) + (quotation.freeTableCount || 0);
  const depositAmount = quotation.depositAmount || Math.round((quotation.grandTotal || 0) * 0.3);
  const remainingBalance = (quotation.grandTotal || 0) - depositAmount;

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const fileName = `ใบเสร็จรับเงินมัดจำ_${receiptNo}_${quotation.customer?.name || 'ลูกค้า'}.pdf`;
      await generateA4Pdf(printRef.current, fileName);
      setIsGeneratingPdf(false);
    } catch (err) {
      console.error('PDF Generation error:', err);
      setIsGeneratingPdf(false);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณากดปุ่มพิมพ์เอกสารโดยตรง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-400 overflow-hidden my-4">
        
        {/* Top Control Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white border-b-2 border-emerald-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-300">
                ใบเสร็จรับเงิน / ใบรับเงินมัดจำ (A4 Official Receipt)
              </h3>
              <p className="text-[10.5px] text-slate-400 font-mono">
                เลขที่ใบเสร็จ: {receiptNo} • อ้างอิงใบเสนอราคา: {displayQuoteNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Native Browser Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-xs"
              title="สั่งพิมพ์ใบเสร็จออกเครื่องพิมพ์โดยตรง (A4 เต็มหน้าพอดี 1 แผ่น)"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>พิมพ์ใบเสร็จ (A4 เต็มหน้า)</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all border border-emerald-500"
              title="ดาวน์โหลดไฟล์ PDF ใบเสร็จรับเงิน"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Area */}
        <div className="max-h-[85vh] overflow-y-auto p-3 sm:p-6 bg-slate-200 flex justify-center">
          
          {/* Exact Full A4 Printable Sheet (210mm x 297mm Standard) */}
          <div
            ref={printRef}
            className="print-a4-page bg-white w-full max-w-[794px] min-h-[1123px] p-6 sm:p-7 text-slate-900 rounded-2xl shadow-xl border-2 border-emerald-300 flex flex-col justify-between relative print:m-0 print:p-5 print:border-none print:shadow-none print:min-h-0"
            style={{ fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif" }}
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
                      <div className="text-[11px] sm:text-xs font-black text-amber-800 uppercase tracking-wide mt-1">
                        RAPEEPHAT BANQUET CATERING • ประสบการณ์จัดเลี้ยงภัตตาคาร 35+ ปี
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-[11px] text-slate-800 pt-0.5 space-y-0.5 font-medium leading-snug">
                    <div>
                      <strong className="text-slate-950 font-bold">สำนักงานหลัก (ออกเอกสาร):</strong> 50/8 ม.4 ถ.เลียบคลองสาม อ.คลองหลวง จ.ปทุมธานี 12120
                    </div>
                    <div>
                      <strong className="text-slate-950 font-bold">ฐานผลิตโรงครัวกลาง:</strong> 72/7 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม 73000
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 pt-0.5">
                      <span><strong className="text-slate-950 font-bold">โทร:</strong> <strong className="text-emerald-800 font-black font-mono text-[12px]">081-331-1646</strong> (คุณแป้ง)</span>
                      <span><strong className="text-slate-950 font-bold">LINE:</strong> pang_baichaa</span>
                    </div>
                    <div>
                      <strong className="text-slate-950 font-bold">อีเมล:</strong> <strong className="font-mono text-slate-900">info@rapeephat-catering.com, baicha@rapeephat-catering.com</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-gradient-to-br from-emerald-50 to-teal-50 p-2 px-3.5 rounded-2xl border-2 border-emerald-200 shadow-2xs -mt-1">
                  <div className="text-xs font-black text-emerald-800 flex items-center justify-end gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ใบเสร็จรับเงินมัดจำ</span>
                  </div>
                  <div className="text-xs text-slate-900 font-mono font-bold mt-0.5">
                    เลขที่: <span className="text-emerald-700 font-black text-sm">{receiptNo}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    วันที่: {formatThaiDate(new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 2. Customer & Event Details */}
              <div className="grid grid-cols-2 gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="space-y-1.5">
                  <div className="font-black text-emerald-900 text-[11.5px] border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-700" /> ได้รับเงินจาก (ผู้ว่าจ้าง / ลูกค้า):
                  </div>
                  <div><span className="text-slate-500 font-medium">ชื่อลูกค้า / หน่วยงาน:</span> <strong className="text-slate-950 font-bold text-sm ml-1">{quotation.customer?.name || 'ลูกค้าผู้มีเกียรติ'}</strong></div>
                  <div><span className="text-slate-500 font-medium">เบอร์โทรศัพท์:</span> <strong className="font-mono text-emerald-800 text-xs font-black ml-1">{quotation.customer?.phone || '-'}</strong></div>
                  <div><span className="text-slate-500 font-medium">ประเภทงานจัดเลี้ยง:</span> <strong className="text-slate-900 font-bold ml-1">{quotation.customer?.eventType || 'งานจัดเลี้ยงมงคล'}</strong></div>
                </div>

                <div className="space-y-1.5 border-l border-slate-200 pl-3.5">
                  <div className="font-black text-emerald-900 text-[11.5px] border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" /> ข้อมูลงานจัดเลี้ยง:
                  </div>
                  <div><span className="text-slate-500 font-medium">วันจัดงาน:</span> <strong className="text-slate-950 font-bold">{formatThaiDate(quotation.customer?.eventDate || new Date().toISOString())}</strong></div>
                  <div><span className="text-slate-500 font-medium">เวลาเริ่มงาน:</span> <strong className="text-slate-950 font-bold">{quotation.customer?.eventTime || '11:00 น.'}</strong></div>
                  <div className="truncate"><span className="text-slate-500 font-medium">สถานที่:</span> <strong className="text-slate-950 font-bold">{quotation.customer?.eventLocation || 'ตามที่ลูกค้ากำหนด'}</strong></div>
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
                          ค่ามัดจำล็อกคิวงานจัดเลี้ยงโต๊ะจีน (30%)
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          • แพ็กเกจอาหาร: <strong className="text-emerald-900">{quotation.package?.name}</strong> (@{formatCurrency(quotation.package?.price || 0)}.-/โต๊ะ)<br />
                          • อ้างอิงใบเสนอราคาเลขที่: <span className="font-mono text-emerald-800 font-bold">{displayQuoteNo}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-900 text-sm">
                        {quotation.tableCount} โต๊ะ {quotation.freeTableCount > 0 && <span className="text-emerald-700 font-black text-xs block">(+แถมฟรี {quotation.freeTableCount})</span>}
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-800 font-mono text-base">
                        {formatCurrency(depositAmount)}.-
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
                      <strong className="font-mono text-slate-950">{formatCurrency(quotation.grandTotal || 0)} บาท</strong>
                    </div>
                    <div className="flex justify-between text-emerald-900 font-bold text-xs">
                      <span>ยอดเงินมัดจำที่ชำระแล้ว (30%):</span>
                      <strong className="font-mono text-emerald-800 text-sm font-black">{formatCurrency(depositAmount)} บาท</strong>
                    </div>
                    <div className="flex justify-between text-red-700 text-xs">
                      <span>ยอดคงเหลือชำระวันงาน (70%):</span>
                      <strong className="font-mono font-bold">{formatCurrency(remainingBalance)} บาท</strong>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border-2 border-emerald-300 flex flex-col justify-center text-center shadow-2xs">
                    <div className="text-[11px] font-bold text-emerald-900">จำนวนเงินที่ได้รับชำระแล้วทั้งสิ้น</div>
                    <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">{formatCurrency(depositAmount)} บาท</div>
                    <div className="text-[10.5px] text-slate-800 font-black mt-1 bg-emerald-50 py-0.5 px-2 rounded-lg inline-block mx-auto border border-emerald-200">
                      ({thaiBahtText(depositAmount)})
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
                      <span>ช่องทางการชำระเงิน: <strong className="text-emerald-800">ชำระเงินมัดจำเรียบร้อยแล้ว</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      โอนผ่านบัญชี <strong>ธ.ไทยพาณิชย์ (SCB) 411-239908-0</strong> หรือสแกน Thai QR Payment
                    </p>
                    <p className="text-[10.5px] text-slate-500">
                      ชื่อบัญชี: <strong>นางสาวทัศวรรณ จันทร์หอม</strong>
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black shrink-0 border border-emerald-300 shadow-2xs">
                  ✓ PAID DEPOSIT
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

                <div className="text-center space-y-3 relative">
                  <div className="text-xs font-bold text-slate-700">ผู้รับเงิน / โต๊ะจีน รพีพัฒน์</div>
                  
                  {/* Signature and Seal */}
                  <div className="relative h-10 flex items-center justify-center">
                    <img
                      src="/images/brand/signature-rapeephat-p.png"
                      alt="ลายเซ็น Rapeephat P."
                      className="h-10 w-auto object-contain mix-blend-multiply filter contrast-200 brightness-75 drop-shadow-xs select-none pointer-events-none"
                    />
                    <div className="absolute right-4 -top-2 w-11 h-11 rounded-full border-2 border-emerald-600 border-dashed flex flex-col items-center justify-center text-emerald-700 transform rotate-12 pointer-events-none select-none">
                      <span className="text-[7.5px] font-black leading-none uppercase">รับเงินแล้ว</span>
                      <span className="text-[8.5px] leading-none my-0.5 font-bold">★ สำเร็จ ★</span>
                      <span className="text-[6.5px] font-black leading-none">PAID 30%</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-emerald-900">( นางสาวทัศวรรณ จันทร์หอม )</div>
                    <div className="text-[10px] text-slate-500 font-medium">ผู้รับเงินและเจ้าของกิจการ</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-[9.5px] text-slate-400 pt-3 border-t border-slate-100 relative z-10">
              ใบเสร็จรับเงินมัดจำฉบับนี้ออกโดย โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม) • ขอบพระคุณที่ไว้วางใจให้เราดูแลวันสำคัญของคุณ
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
