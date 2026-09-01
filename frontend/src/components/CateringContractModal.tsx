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
  Utensils,
  Award,
  CheckCircle2
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden my-4">
        
        {/* Top Control Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-300">
                สัญญาจ้างบริการจัดเลี้ยงโต๊ะจีน (A4 Catering Contract)
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
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-xs"
              title="สั่งพิมพ์สัญญาออกเครื่องพิมพ์โดยตรง (A4 เต็มหน้าพอดี 1 แผ่น)"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>พิมพ์สัญญา (A4 เต็มหน้า)</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all border border-red-500"
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
        <div className="max-h-[85vh] overflow-y-auto p-3 sm:p-6 bg-slate-200 flex justify-center">
          
          {/* Exact Full A4 Printable Sheet (210mm x 297mm Standard) */}
          <div
            ref={printRef}
            className="print-a4-page bg-white w-full max-w-[794px] min-h-[1123px] p-6 sm:p-7 text-slate-900 rounded-2xl shadow-xl border-2 border-amber-300 flex flex-col justify-between relative print:m-0 print:p-5 print:border-none print:shadow-none print:min-h-0"
            style={{ fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif" }}
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <img src="/images/brand/logo.png" alt="" className="w-[420px] h-[420px] object-contain" />
            </div>

            <div className="space-y-2.5 relative z-10 flex-1 flex flex-col justify-between">
              
              {/* 1. Header Section with Brand Logo & Royal Title (Aligned to Top) */}
              <div className="flex items-start justify-between pb-2.5 border-b-2 border-red-600 gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Brand Logo */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 -mt-1">
                    <img src="/images/brand/logo.png" alt="ตราสัญลักษณ์ โต๊ะจีน รพีพัฒน์" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-red-700 tracking-tight leading-none whitespace-nowrap">
                        โต๊ะจีน รพีพัฒน์ พรีเมียม
                      </h1>
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full border border-amber-300 shadow-2xs whitespace-nowrap">
                        35 YEARS
                      </span>
                    </div>
                    <p className="text-[10.5px] font-black text-amber-800 uppercase tracking-wide mt-0.5 whitespace-nowrap">
                      RAPEEPHAT BANQUET CATERING • สัญญาว่าจ้างบริการจัดเลี้ยงระดับภัตตาคาร
                    </p>
                    <div className="text-[11px] text-slate-800 pt-1 space-y-0.5 font-medium leading-tight">
                      <div>
                        <strong className="text-slate-950 font-bold">สำนักงานหลัก (ออกเอกสาร):</strong> 50/8 ม.4 ถ.เลียบคลองสาม อ.คลองหลวง จ.ปทุมธานี 12120
                      </div>
                      <div>
                        <strong className="text-slate-950 font-bold">ฐานผลิตโรงครัวกลาง:</strong> 72/7 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม 73000
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 pt-0.5">
                        <span><strong className="text-slate-950 font-bold">โทร:</strong> <strong className="text-red-700 font-black font-mono text-[11.5px]">081-331-1646</strong> (คุณแป้ง)</span>
                        <span><strong className="text-slate-950 font-bold">LINE:</strong> pang_baichaa</span>
                      </div>
                      <div>
                        <strong className="text-slate-950 font-bold">อีเมล:</strong> <strong className="font-mono text-slate-900">info@rapeephat-catering.com, baicha@rapeephat-catering.com</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract No & Date Badge (Moved Up to Top) */}
                <div className="text-right shrink-0 bg-gradient-to-br from-red-50 to-amber-50 p-2 px-3.5 rounded-2xl border-2 border-red-200 shadow-2xs -mt-1">
                  <div className="text-xs font-black text-red-700 flex items-center justify-end gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>สัญญาจ้างจัดเลี้ยง</span>
                  </div>
                  <div className="text-xs text-slate-900 font-mono font-bold mt-0.5">
                    เลขที่: <span className="text-red-700 font-black text-sm">{contractNo}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    วันที่: {formatThaiDate(new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 2. Contract Description & Parties */}
              <div className="text-[11px] leading-relaxed text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <p>
                  สัญญาฉบับนี้ทำขึ้นระหว่าง <strong>โต๊ะจีน รพีพัฒน์ พรีเมียม</strong> (โดย นางสาวทัศวรรณ จันทร์หอม) ซึ่งต่อไปในสัญญานี้เรียกว่า <strong>"ผู้รับจ้าง"</strong> ฝ่ายหนึ่ง กับ
                </p>
                <p>
                  <strong>{quotation.customer?.name || 'ลูกค้าผู้ว่าจ้าง'}</strong> โทรศัพท์: <strong className="font-mono text-red-700 text-xs font-black">{quotation.customer?.phone || '-'}</strong> ซึ่งต่อไปในสัญญานี้เรียกว่า <strong>"ผู้ว่าจ้าง"</strong> อีกฝ่ายหนึ่ง
                </p>
                <p className="text-slate-600 text-[10px]">
                  ทั้งสองฝ่ายตกลงทำสัญญาว่าจ้างบริการจัดเลี้ยงโต๊ะจีน โดยมีข้อตกลงและเงื่อนไขการให้บริการดังต่อไปนี้:
                </p>
              </div>

              {/* 3. Event Details & Package Scope */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#FFFDF9] p-2.5 rounded-xl border-2 border-amber-200">
                <div className="space-y-1">
                  <div className="font-black text-red-700 text-[11px] flex items-center gap-1.5 border-b border-amber-200 pb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-red-600" /> ข้อมูลกำหนดการจัดงาน
                  </div>
                  <div><span className="text-slate-500 font-medium">วันจัดงาน:</span> <strong className="text-slate-950 font-bold">{formatThaiDate(quotation.customer?.eventDate || new Date().toISOString())}</strong></div>
                  <div><span className="text-slate-500 font-medium">เวลาเริ่มเสิร์ฟ:</span> <strong className="text-slate-950 font-bold">{quotation.customer?.eventTime || '11:00 น.'}</strong></div>
                  <div><span className="text-slate-500 font-medium">ประเภทงาน:</span> <strong className="text-slate-950 font-bold">{quotation.customer?.eventType || 'งานจัดเลี้ยงมงคล'}</strong></div>
                  <div className="truncate"><span className="text-slate-500 font-medium">สถานที่:</span> <strong className="text-slate-950 font-bold">{quotation.customer?.eventLocation || 'ตามที่ผู้ว่าจ้างกำหนด'}</strong></div>
                </div>

                <div className="space-y-1 border-l border-amber-200 pl-3">
                  <div className="font-black text-red-700 text-[11px] flex items-center gap-1.5 border-b border-amber-200 pb-0.5">
                    <Utensils className="w-3.5 h-3.5 text-red-600" /> รายละเอียดแพ็กเกจอาหาร
                  </div>
                  <div><span className="text-slate-500 font-medium">แพ็กเกจอาหาร:</span> <strong className="text-red-700 font-black">{quotation.package?.name}</strong></div>
                  <div><span className="text-slate-500 font-medium">ราคาต่อโต๊ะ:</span> <strong className="text-slate-950 font-bold">{formatCurrency(quotation.package?.price || 0)} บาท/โต๊ะ</strong></div>
                  <div>
                    <span className="text-slate-500 font-medium">จำนวนโต๊ะ:</span> <strong className="text-slate-950 font-bold">{quotation.tableCount} โต๊ะ</strong> {quotation.freeTableCount > 0 && <span className="text-emerald-700 font-black ml-1">(แถมฟรี {quotation.freeTableCount} โต๊ะ)</span>}
                  </div>
                  <div><span className="text-slate-500 font-medium">รวมจำนวนโต๊ะจัดเสิร์ฟ:</span> <strong className="text-red-700 font-black text-sm">{totalTables} โต๊ะ</strong></div>
                </div>
              </div>

              {/* 4. Selected Menu Dishes (Full 2-Column Grid) */}
              <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                <div className="font-black text-slate-900 text-[11px] flex items-center justify-between border-b border-slate-200 pb-0.5">
                  <span className="flex items-center gap-1 text-slate-900 font-black">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    รายการอาหารที่ตกลงเสิร์ฟ ({quotation.selectedDishes?.length || 0} จานมาตรฐาน):
                  </span>
                  <span className="text-[9.5px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ ปรุงสุกสดใหม่หน้างาน 100%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5 text-[10.5px] text-slate-800">
                  {quotation.selectedDishes?.map((dish, i) => (
                    <div key={dish.courseId || i} className="flex items-center gap-1.5 truncate p-0.5 px-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white font-bold text-[8.5px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate font-bold text-slate-900">{dish.dishName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Financial Terms Breakdown */}
              <div className="bg-gradient-to-br from-amber-50 via-slate-50 to-red-50 p-2.5 rounded-xl border-2 border-amber-300 text-xs space-y-1.5">
                <div className="font-black text-red-800 text-[11px] border-b border-amber-300 pb-0.5 flex items-center justify-between">
                  <span>มูลค่าสัญญาและการชำระเงิน (Financial Agreement)</span>
                  <span className="text-[9.5px] font-mono text-slate-600">ราคารวมภาษีและค่าบริการครบถ้วน</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[10px] text-slate-500 font-bold">ยอดมูลค่างานรวมทั้งสิ้น</div>
                    <div className="text-sm sm:text-base font-black text-slate-900 font-mono mt-0.5">{formatCurrency(quotation.grandTotal || 0)}.-</div>
                  </div>

                  <div className="bg-emerald-50 p-2 rounded-xl border-2 border-emerald-400 shadow-2xs">
                    <div className="text-[10px] text-emerald-800 font-bold">เงินมัดจำล็อกคิว (30%)</div>
                    <div className="text-sm sm:text-base font-black text-emerald-700 font-mono mt-0.5">{formatCurrency(quotation.depositAmount || 0)}.-</div>
                    <div className="text-[9px] text-emerald-700 font-black mt-0.5">✓ ชำระเรียบร้อยแล้ว</div>
                  </div>

                  <div className="bg-red-50 p-2 rounded-xl border-2 border-red-300 shadow-2xs">
                    <div className="text-[10px] text-red-800 font-bold">คงเหลือชำระวันงาน (70%)</div>
                    <div className="text-sm sm:text-base font-black text-red-700 font-mono mt-0.5">{formatCurrency(remainingBalance)}.-</div>
                    <div className="text-[9px] text-slate-500 font-bold mt-0.5">ชำระหลังเสร็จสิ้นงาน</div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-700 text-center font-bold pt-0.5">
                  (จำนวนเงินตัวอักษรยอดมัดจำ: <span className="text-slate-950 font-black">{thaiBahtText(quotation.depositAmount || 0)}</span>)
                </div>
              </div>

              {/* 6. Terms & Guarantee */}
              <div className="text-[10px] text-slate-700 space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-tight">
                <div className="font-black text-slate-900 flex items-center gap-1 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  เงื่อนไขและการรับประกันการให้บริการ:
                </div>
                <p>1. <strong>ผู้รับจ้าง</strong> รับประกันการจัดเตรียมโต๊ะ เก้าอี้ ผ้าคลุม ผูกโบว์ ภาชนะ และพนักงานเสิร์ฟบริการครบครัน</p>
                <p>2. <strong>ผู้รับจ้าง</strong> การันตีวัตถุดิบสดใหม่ ปรุงสุกร้อน ณ สถานที่จัดงานตรงตามเวลาที่กำหนด</p>
                <p>3. <strong>ผู้ว่าจ้าง</strong> ตกลงชำระเงินส่วนที่เหลือ (70%) เป็นเงินสดหรือโอนเงินทันทีหลังเสร็จสิ้นการจัดเลี้ยง</p>
              </div>

              {/* 7. Signatures Section with Royal Seal Stamp */}
              <div className="grid grid-cols-2 gap-6 pt-2 border-t-2 border-slate-200">
                <div className="text-center space-y-4">
                  <div className="text-xs font-bold text-slate-700">ลงชื่อ ผู้ว่าจ้าง (เจ้าภาพ)</div>
                  <div className="space-y-1">
                    <div className="w-44 mx-auto border-b border-dashed border-slate-400" />
                    <div className="text-xs font-black text-slate-900">({quotation.customer?.name || '...........................................'})</div>
                    <div className="text-[9.5px] text-slate-500 font-medium">วันที่: ......./......./...........</div>
                  </div>
                </div>

                <div className="text-center space-y-2 relative">
                  <div className="text-xs font-bold text-slate-700">ลงชื่อ ผู้รับจ้าง (โต๊ะจีน รพีพัฒน์)</div>
                  
                  {/* Auspicious Signature and Seal */}
                  <div className="relative h-9 flex items-center justify-center">
                    <img
                      src="/images/brand/signature-rapeephat-p.png"
                      alt="ลายเซ็น Rapeephat P."
                      className="h-9 w-auto object-contain mix-blend-multiply filter contrast-200 brightness-75 drop-shadow-xs select-none pointer-events-none"
                    />
                    <div className="absolute right-4 -top-2 w-10 h-10 rounded-full border-2 border-red-600 border-dashed flex flex-col items-center justify-center text-red-600 transform rotate-12 pointer-events-none select-none">
                      <span className="text-[7px] font-black leading-none uppercase">รพีพัฒน์</span>
                      <span className="text-[8px] leading-none my-0.5 font-bold">★ มงคล ★</span>
                      <span className="text-[6px] font-black leading-none">35 YEARS</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-red-700">( นางสาวทัศวรรณ จันทร์หอม )</div>
                    <div className="text-[9.5px] text-slate-500 font-medium">ผู้จัดการฝ่ายจัดเลี้ยง • โต๊ะจีน รพีพัฒน์ พรีเมียม</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Note */}
            <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-100 relative z-10">
              เอกสารสัญญาฉบับนี้มีผลผูกพันตามกฎหมาย • โต๊ะจีน รพีพัฒน์ พรีเมียม การันตีประสบการณ์กว่า 35 ปี
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
