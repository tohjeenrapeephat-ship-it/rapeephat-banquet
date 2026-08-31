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
  Building
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-300 overflow-hidden my-6">
        
        {/* Top Control Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white border-b-2 border-emerald-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xs">
              <Receipt className="w-4 h-4 text-white" />
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
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-xs"
              title="สั่งพิมพ์ใบเสร็จออกเครื่องพิมพ์โดยตรง (A4 1 หน้า)"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>พิมพ์ใบเสร็จ (A4)</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all border border-emerald-500"
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
        <div className="max-h-[85vh] overflow-y-auto p-4 sm:p-6 bg-slate-100 flex justify-center">
          
          {/* Exact A4 Printable Sheet */}
          <div
            ref={printRef}
            className="print-a4-page bg-white w-full max-w-[794px] min-h-[1123px] p-6 sm:p-8 text-slate-900 rounded-2xl shadow-md border border-slate-200 flex flex-col justify-between relative print:m-0 print:p-6 print:border-none print:shadow-none"
            style={{ fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif" }}
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <img src="/images/brand/logo.png" alt="" className="w-96 h-96 object-contain" />
            </div>

            <div className="space-y-4 relative z-10">
              
              {/* 1. Header Section with Brand Logo */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-emerald-600 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white p-0.5 border border-emerald-300 flex items-center justify-center shrink-0">
                    <img src="/images/brand/logo.png" alt="โต๊ะจีน รพีพัฒน์" className="h-12 w-auto object-contain" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-emerald-800 tracking-tight leading-tight">
                      โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม)
                    </h1>
                    <p className="text-[10.5px] font-black text-amber-800 uppercase tracking-wide">
                      RAPEEPHAT BANQUET CATERING • ใบเสร็จรับเงิน / ใบรับเงินมัดจำ
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">
                      โทร: 083-087-2257 (คุณแป้ง) • LINE: pang_baichaa • อีเมล: info@rapeephat-catering.com, baicha@rapeephat-catering.com
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-emerald-50/80 p-2 px-3.5 rounded-xl border border-emerald-200">
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">ใบเสร็จรับเงิน</div>
                  <div className="text-xs text-slate-800 font-mono font-bold">เลขที่: <span className="text-emerald-700 font-black">{receiptNo}</span></div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    วันที่: {formatThaiDate(new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 2. Customer & Event Info */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="font-black text-emerald-800 text-[11px] border-b border-slate-200 pb-0.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> ได้รับเงินจาก (ผู้ชำระเงิน):
                  </div>
                  <div><span className="text-slate-500">ชื่อลูกค้า:</span> <strong className="text-slate-950 font-bold">{quotation.customer?.name || 'ลูกค้าผู้มีเกียรติ'}</strong></div>
                  <div><span className="text-slate-500">เบอร์โทรศัพท์:</span> <strong className="font-mono text-emerald-700 font-black">{quotation.customer?.phone || '-'}</strong></div>
                  <div><span className="text-slate-500">ประเภทงาน:</span> <strong className="text-slate-900 font-medium">{quotation.customer?.eventType || 'งานจัดเลี้ยง'}</strong></div>
                </div>

                <div className="space-y-1 border-l border-slate-200 pl-3">
                  <div className="font-black text-emerald-800 text-[11px] border-b border-slate-200 pb-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> รายละเอียดงานจัดเลี้ยง:
                  </div>
                  <div><span className="text-slate-500">วันจัดงาน:</span> <strong>{formatThaiDate(quotation.customer?.eventDate || new Date().toISOString())}</strong></div>
                  <div><span className="text-slate-500">เวลาเริ่มงาน:</span> <strong>{quotation.customer?.eventTime || '11:00 น.'}</strong></div>
                  <div className="truncate"><span className="text-slate-500">สถานที่:</span> <strong>{quotation.customer?.eventLocation || 'ตามที่ลูกค้ากำหนด'}</strong></div>
                </div>
              </div>

              {/* 3. Receipt Line Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-emerald-800 text-white text-[11px] font-bold">
                    <tr>
                      <th className="p-2.5 text-center w-12">ลำดับ</th>
                      <th className="p-2.5">รายการรับชำระ</th>
                      <th className="p-2.5 text-center w-28">จำนวนโต๊ะ</th>
                      <th className="p-2.5 text-right w-36">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr>
                      <td className="p-3 text-center text-slate-400 font-bold">1</td>
                      <td className="p-3">
                        <div className="font-black text-slate-900">
                          ค่ามัดจำล็อกคิวงานจัดเลี้ยงโต๊ะจีน (30%)
                        </div>
                        <div className="text-[10.5px] text-slate-500 mt-0.5">
                          • แพ็กเกจ: <strong>{quotation.package?.name}</strong> (@{formatCurrency(quotation.package?.price || 0)}.-/โต๊ะ)<br />
                          • อ้างอิงใบเสนอราคาเลขที่: <span className="font-mono text-emerald-700 font-bold">{displayQuoteNo}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800">
                        {quotation.tableCount} โต๊ะ {quotation.freeTableCount > 0 && <span className="text-emerald-600 text-[10px]">(+แถม {quotation.freeTableCount})</span>}
                      </td>
                      <td className="p-3 text-right font-black text-emerald-700 font-mono text-sm">
                        {formatCurrency(depositAmount)}.-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. Financial Summary Card */}
              <div className="bg-[#F4FBF7] p-3.5 rounded-xl border border-emerald-300 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>มูลค่างานจัดเลี้ยงรวมทั้งสิ้น:</span>
                      <strong className="font-mono text-slate-900">{formatCurrency(quotation.grandTotal || 0)}.-</strong>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>ยอดเงินมัดจำที่ชำระ (30%):</span>
                      <strong className="font-mono text-emerald-700 text-sm font-black">{formatCurrency(depositAmount)}.-</strong>
                    </div>
                    <div className="flex justify-between text-red-700">
                      <span>ยอดคงเหลือชำระวันงาน (70%):</span>
                      <strong className="font-mono font-bold">{formatCurrency(remainingBalance)}.-</strong>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex flex-col justify-center text-center shadow-2xs">
                    <div className="text-[10.5px] font-bold text-emerald-900">จำนวนเงินที่ได้รับชำระแล้วทั้งสิ้น</div>
                    <div className="text-lg font-black text-emerald-700 font-mono">{formatCurrency(depositAmount)} บาท</div>
                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">
                      ({thaiBahtText(depositAmount)})
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Payment Method & Confirmation */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>สถานะการชำระเงิน: <strong className="text-emerald-700">ชำระเงินมัดจำเรียบร้อยแล้ว</strong></span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 pl-5">
                    โอนผ่านบัญชี ธ.กสิกรไทย 028-8-82559-0 นางสาวทัศวรรณ จันทร์หอม
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0 border border-emerald-300">
                  PAID DEPOSIT
                </div>
              </div>

              {/* 6. Signature Section */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200">
                <div className="text-center space-y-6">
                  <div className="text-xs font-bold text-slate-700">ผู้ชำระเงิน / ผู้ว่าจ้าง</div>
                  <div className="space-y-1">
                    <div className="w-44 mx-auto border-b border-dashed border-slate-400" />
                    <div className="text-xs font-black text-slate-900">({quotation.customer?.name || '...........................................'})</div>
                    <div className="text-[10px] text-slate-500">วันที่ชำระ: ......./......./...........</div>
                  </div>
                </div>

                <div className="text-center space-y-6">
                  <div className="text-xs font-bold text-slate-700">ผู้รับเงิน / โต๊ะจีน รพีพัฒน์</div>
                  <div className="space-y-1">
                    <div className="w-44 mx-auto border-b border-dashed border-slate-400" />
                    <div className="text-xs font-black text-emerald-800">(นางสาวทัศวรรณ จันทร์หอม)</div>
                    <div className="text-[10px] text-slate-500">ผู้รับเงินและเจ้าของกิจการ</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-[9px] text-slate-400 pt-3 border-t border-slate-100 relative z-10">
              ใบเสร็จรับเงินมัดจำฉบับนี้ออกโดย โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม) • ขอบพระคุณที่ไว้วางใจให้เราดูแลวันสำคัญของคุณ
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
