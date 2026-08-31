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
  FileCheck,
  Crown,
  Calendar,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Utensils
} from 'lucide-react';

interface CateringContractModalProps {
  quotation: QuotationDoc;
  isOpen: boolean;
  onClose: () => void;
}

export const CateringContractModal: React.FC<CateringContractModalProps> = ({
  quotation,
  isOpen,
  onClose,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !quotation) return null;

  const displayQuoteNo = quotation.quoteNo || `Q-${Date.now().toString().slice(-6)}`;
  const contractNo = `CTR-${displayQuoteNo.replace(/^Q-/, '')}`;
  const totalTables = (quotation.tableCount || 0) + (quotation.freeTableCount || 0);
  const remainingBalance = (quotation.grandTotal || 0) - (quotation.depositAmount || 0);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const fileName = `สัญญาจ้างจัดเลี้ยง_${contractNo}_${quotation.customer?.name || 'ลูกค้า'}.pdf`;
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
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden my-6">
        
        {/* Top Control Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white border-b-2 border-amber-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-xs">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-300">
                สัญญาจ้างบริการจัดเลี้ยงโต๊ะจีน (A4 Contract)
              </h3>
              <p className="text-[10.5px] text-slate-400 font-mono">
                เลขที่สัญญา: {contractNo} • อ้างอิงใบเสนอราคา: {displayQuoteNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Native Browser Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-xs"
              title="สั่งพิมพ์สัญญาออกเครื่องพิมพ์โดยตรง (A4 1 หน้า)"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>พิมพ์สัญญา (A4)</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all border border-red-500"
              title="ดาวน์โหลดไฟล์ PDF สัญญาจ้าง"
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
              <div className="flex items-start justify-between pb-3 border-b-2 border-red-600 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white p-0.5 border border-amber-300 flex items-center justify-center shrink-0">
                    <img src="/images/brand/logo.png" alt="โต๊ะจีน รพีพัฒน์" className="h-12 w-auto object-contain" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-red-700 tracking-tight leading-tight">
                      โต๊ะจีน รพีพัฒน์ พรีเมียม (นครปฐม)
                    </h1>
                    <p className="text-[10.5px] font-black text-amber-800 uppercase tracking-wide">
                      RAPEEPHAT BANQUET CATERING • สัญญาว่าจ้างบริการจัดเลี้ยงระดับภัตตาคาร
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">
                      โทร: 083-087-2257 (คุณแป้ง) • LINE: pang_baichaa • อีเมล: info@rapeephat-catering.com, baicha@rapeephat-catering.com
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-red-50/80 p-2 px-3.5 rounded-xl border border-red-200">
                  <div className="text-xs font-black text-red-700">สัญญาจ้างจัดเลี้ยง</div>
                  <div className="text-xs text-slate-800 font-mono font-bold">เลขที่: <span className="text-red-700 font-black">{contractNo}</span></div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    วันที่: {formatThaiDate(new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 2. Contract Description & Parties */}
              <div className="text-[11.5px] leading-relaxed text-slate-800 bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <p>
                  สัญญาฉบับนี้ทำขึ้นระหว่าง <strong>โต๊ะจีน รพีพัฒน์ พรีเมียม</strong> (โดย นางสาวทัศวรรณ จันทร์หอม) ซึ่งต่อไปในสัญญานี้เรียกว่า <strong>"ผู้รับจ้าง"</strong> ฝ่ายหนึ่ง กับ
                </p>
                <p>
                  <strong>{quotation.customer?.name || 'ลูกค้าผู้ว่าจ้าง'}</strong> โทรศัพท์: <strong className="font-mono text-red-700">{quotation.customer?.phone || '-'}</strong> ซึ่งต่อไปในสัญญานี้เรียกว่า <strong>"ผู้ว่าจ้าง"</strong> อีกฝ่ายหนึ่ง
                </p>
                <p className="text-slate-600 text-[11px]">
                  ทั้งสองฝ่ายตกลงทำสัญญาว่าจ้างบริการจัดเลี้ยงโต๊ะจีน โดยมีข้อตกลงและรายละเอียดดังต่อไปนี้:
                </p>
              </div>

              {/* 3. Event Details & Scope */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#FFFDF9] p-3 rounded-xl border border-amber-200">
                <div className="space-y-1">
                  <div className="font-black text-red-700 text-[11px] flex items-center gap-1 border-b border-amber-200 pb-0.5">
                    <Calendar className="w-3.5 h-3.5" /> ข้อมูลกำหนดการจัดงาน
                  </div>
                  <div><span className="text-slate-500">วันจัดงาน:</span> <strong>{formatThaiDate(quotation.customer?.eventDate || new Date().toISOString())}</strong></div>
                  <div><span className="text-slate-500">เวลาเริ่มเสิร์ฟ:</span> <strong>{quotation.customer?.eventTime || '11:00 น.'}</strong></div>
                  <div><span className="text-slate-500">ประเภทงาน:</span> <strong>{quotation.customer?.eventType || 'งานจัดเลี้ยงมงคล'}</strong></div>
                  <div className="truncate"><span className="text-slate-500">สถานที่:</span> <strong>{quotation.customer?.eventLocation || 'ตามที่ผู้ว่าจ้างกำหนด'}</strong></div>
                </div>

                <div className="space-y-1 border-l border-amber-200 pl-3">
                  <div className="font-black text-red-700 text-[11px] flex items-center gap-1 border-b border-amber-200 pb-0.5">
                    <Utensils className="w-3.5 h-3.5" /> รายละเอียดแพ็กเกจอาหาร
                  </div>
                  <div><span className="text-slate-500">แพ็กเกจ:</span> <strong className="text-red-700">{quotation.package?.name}</strong></div>
                  <div><span className="text-slate-500">ราคาต่อโต๊ะ:</span> <strong>{formatCurrency(quotation.package?.price || 0)} บาท/โต๊ะ</strong></div>
                  <div>
                    <span className="text-slate-500">จำนวนโต๊ะ:</span> <strong>{quotation.tableCount} โต๊ะ</strong> {quotation.freeTableCount > 0 && <span className="text-emerald-700 font-bold">(แถมฟรี {quotation.freeTableCount} โต๊ะ)</span>}
                  </div>
                  <div><span className="text-slate-500">รวมจำนวนเสิร์ฟ:</span> <strong className="text-red-700 font-black">{totalTables} โต๊ะ</strong></div>
                </div>
              </div>

              {/* 4. Selected Menu Dishes */}
              <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <div className="font-black text-slate-900 text-[11px] flex items-center justify-between border-b border-slate-200 pb-1">
                  <span>รายการอาหารที่ตกลงเสิร์ฟ ({quotation.selectedDishes?.length || 0} รายการ):</span>
                  <span className="text-[10px] text-emerald-700 font-bold">✓ ปรุงสุกสดใหม่หน้างาน 100%</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-800">
                  {quotation.selectedDishes?.map((dish, i) => (
                    <div key={dish.courseId || i} className="flex items-center gap-1.5 truncate">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate">{dish.dishName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Financial Terms Breakdown */}
              <div className="bg-gradient-to-br from-amber-50/80 to-red-50/50 p-3 rounded-xl border border-amber-300 text-xs space-y-1.5">
                <div className="font-black text-red-800 text-[11px] border-b border-amber-300 pb-0.5 flex items-center justify-between">
                  <span>มูลค่าสัญญาและการชำระเงิน</span>
                  <span className="text-[10px] font-mono text-slate-600">ราคารวมภาษีและค่าบริการครบถ้วน</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-bold">ยอดมูลค่างานรวมทั้งสิ้น</div>
                    <div className="text-sm font-black text-slate-900 font-mono">{formatCurrency(quotation.grandTotal || 0)}.-</div>
                  </div>

                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-300 shadow-2xs">
                    <div className="text-[10px] text-emerald-700 font-bold">เงินมัดจำล็อกคิว (30%)</div>
                    <div className="text-sm font-black text-emerald-700 font-mono">{formatCurrency(quotation.depositAmount || 0)}.-</div>
                    <div className="text-[9px] text-emerald-600 font-black">✓ ชำระเรียบร้อยแล้ว</div>
                  </div>

                  <div className="bg-red-50 p-2 rounded-xl border border-red-300 shadow-2xs">
                    <div className="text-[10px] text-red-700 font-bold">คงเหลือชำระวันงาน (70%)</div>
                    <div className="text-sm font-black text-red-700 font-mono">{formatCurrency(remainingBalance)}.-</div>
                    <div className="text-[9px] text-slate-500 font-bold">ชำระหลังเสร็จสิ้นงาน</div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 text-center font-bold pt-0.5">
                  (จำนวนเงินตัวอักษรยอดมัดจำ: <span className="text-slate-900">{thaiBahtText(quotation.depositAmount || 0)}</span>)
                </div>
              </div>

              {/* 6. Terms & Guarantee */}
              <div className="text-[10px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-normal">
                <div className="font-bold text-slate-800">เงื่อนไขและการรับประกันการให้บริการ:</div>
                <p>1. <strong>ผู้รับจ้าง</strong> รับประกันการจัดเตรียมโต๊ะ เก้าอี้ ผ้าคลุม ผูกโบว์ ภาชนะ และพนักงานเสิร์ฟบริการครบครัน</p>
                <p>2. <strong>ผู้รับจ้าง</strong> การันตีวัตถุดิบสดใหม่ ปรุงสุกร้อน ณ สถานที่จัดงานตรงตามเวลาที่กำหนด</p>
                <p>3. <strong>ผู้ว่าจ้าง</strong> ตกลงชำระเงินส่วนที่เหลือ (70%) เป็นเงินสดหรือโอนเงินทันทีหลังเสร็จสิ้นการจัดเลี้ยง</p>
              </div>

              {/* 7. Signatures Section */}
              <div className="grid grid-cols-2 gap-8 pt-3 border-t border-slate-200">
                <div className="text-center space-y-8">
                  <div className="text-xs font-bold text-slate-700">ลงชื่อ ผู้ว่าจ้าง (เจ้าภาพ)</div>
                  <div className="space-y-1">
                    <div className="w-48 mx-auto border-b border-dashed border-slate-400" />
                    <div className="text-xs font-black text-slate-900">({quotation.customer?.name || '...........................................'})</div>
                    <div className="text-[10px] text-slate-500">วันที่: ......./......./...........</div>
                  </div>
                </div>

                <div className="text-center space-y-8">
                  <div className="text-xs font-bold text-slate-700">ลงชื่อ ผู้รับจ้าง (โต๊ะจีน รพีพัฒน์)</div>
                  <div className="space-y-1">
                    <div className="w-48 mx-auto border-b border-dashed border-slate-400" />
                    <div className="text-xs font-black text-red-700">(นางสาวทัศวรรณ จันทร์หอม)</div>
                    <div className="text-[10px] text-slate-500">ผู้จัดการฝ่ายจัดเลี้ยง • โต๊ะจีน รพีพัฒน์ พรีเมียม</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-[9px] text-slate-400 pt-3 border-t border-slate-100 relative z-10">
              เอกสารสัญญาฉบับนี้มีผลผูกพันตามกฎหมาย • โต๊ะจีน รพีพัฒน์ พรีเมียม การันตีประสบการณ์กว่า 35 ปี
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
