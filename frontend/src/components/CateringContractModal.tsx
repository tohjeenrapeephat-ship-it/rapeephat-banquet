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
  FileCheck,
  Crown,
  Calendar,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Utensils,
  Award,
  CheckCircle2,
  Smartphone,
  Monitor
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
  const contractNo = `CTR-${rawNo}`;
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4">
      
      {/* Container Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden my-2 sm:my-4 flex flex-col">
        
        {/* Top Control Action Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 px-3.5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5 text-white border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-md shrink-0">
              <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                <span>สัญญาจ้างบริการจัดเลี้ยง</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hidden sm:inline">
                  A4 1 หน้า
                </span>
              </h3>
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 font-mono">
                เลขที่: <span className="text-amber-300 font-bold">{contractNo}</span>
              </p>
            </div>
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
              title="สั่งพิมพ์สัญญาออกเครื่องพิมพ์โดยตรง (A4 เต็มหน้าพอดี 1 แผ่น)"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="hidden sm:inline">พิมพ์สัญญา</span>
              <span className="sm:hidden">พิมพ์</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all border border-red-500 cursor-pointer"
              title="ดาวน์โหลดไฟล์ PDF สัญญาจ้าง"
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
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-[10.5px] flex items-center gap-1 shadow-xs cursor-pointer"
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
              className="print-a4-page bg-white text-slate-900 rounded-2xl shadow-xl border-2 border-amber-300 flex flex-col justify-between relative print:m-0 print:p-5 print:border-none print:shadow-none print:min-h-0"
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
              
              {/* 1. Header Section with Brand Logo & Royal Title (Aligned to Top) */}
              <div className="flex items-start justify-between pb-2 border-b-2 border-red-600 gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {/* Brand Logo */}
                    <div className="flex items-center justify-center shrink-0">
                      <img src="/images/brand/logo.png" alt="ตราสัญลักษณ์ โต๊ะจีน รพีพัฒน์" className="h-16 sm:h-18 w-auto object-contain" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-[26px] font-black text-red-700 tracking-tight leading-none">
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
                      <span><strong className="text-slate-950 font-bold">โทร:</strong> <strong className="text-red-700 font-black font-mono text-[12px]">081-331-1646</strong> (คุณแป้ง)</span>
                      <span><strong className="text-slate-950 font-bold">LINE:</strong> pang_baichaa</span>
                    </div>
                    <div>
                      <strong className="text-slate-950 font-bold">อีเมล:</strong>{' '}
                      <span className="font-sans font-semibold text-slate-900 tracking-normal">
                        info<span className="font-sans text-[13px] font-bold text-red-700 px-0.5">@</span>rapeephat-catering.com
                      </span>
                      <span className="text-slate-400 mx-2 font-light">|</span>
                      <span className="font-sans font-semibold text-slate-900 tracking-normal">
                        baicha<span className="font-sans text-[13px] font-bold text-red-700 px-0.5">@</span>rapeephat-catering.com
                      </span>
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
                  สัญญาฉบับนี้ทำขึ้นระหว่าง <strong>โต๊ะจีน รพีพัฒน์ พรีเมียม</strong> (โดย นางสาวใบชา สุขอยู่) ซึ่งต่อไปในสัญญานี้เรียกว่า <strong>"ผู้รับจ้าง"</strong> ฝ่ายหนึ่ง กับ
                </p>
                <p>
                  <strong>{quotation.customer?.name || 'ลูกค้าผู้ว่าจ้าง'}</strong> โทรศัพท์: <strong className="font-mono text-red-700 text-xs font-black">{quotation.customer?.phone || '-'}</strong> ซึ่งต่อไปในสัญญานี้เรียกว่า <strong>"ผู้ว่าจ้าง"</strong> อีกฝ่ายหนึ่ง
                </p>
                <p className="text-slate-600 text-[10px]">
                  ทั้งสองฝ่ายตกลงทำสัญญาว่าจ้างบริการจัดเลี้ยงโต๊ะจีน โดยมีข้อตกลงและเงื่อนไขการให้บริการดังต่อไปนี้:
                </p>
              </div>

              {/* 3. Event Details, Package Scope & Google Maps QR Code */}
              <div className="grid grid-cols-12 gap-2.5 text-xs bg-[#FFFDF9] p-2.5 rounded-xl border-2 border-amber-200 items-stretch">
                <div className="col-span-5 space-y-1">
                  <div className="font-black text-red-700 text-[11px] flex items-center gap-1.5 border-b border-amber-200 pb-0.5">
                    <Calendar className="w-3.5 h-3.5 text-red-600" /> ข้อมูลกำหนดการจัดงาน
                  </div>
                  <div><span className="text-slate-500 font-medium">วันจัดงาน:</span> <strong className="text-slate-950 font-bold ml-1">{formatThaiDate(quotation.customer?.eventDate || new Date().toISOString())}</strong></div>
                  <div><span className="text-slate-500 font-medium">เวลาเริ่มเสิร์ฟ:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer?.eventTime || '11:00 น.'}</strong></div>
                  <div><span className="text-slate-500 font-medium">ประเภทงาน:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer?.eventType || 'งานจัดเลี้ยงมงคล'}</strong></div>
                  <div><span className="text-slate-500 font-medium">สถานที่:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer?.eventLocation || 'ตามที่ผู้ว่าจ้างกำหนด'}</strong></div>
                </div>

                <div className="col-span-4 space-y-1 border-l border-amber-200 pl-2.5">
                  <div className="font-black text-red-700 text-[11px] flex items-center gap-1.5 border-b border-amber-200 pb-0.5">
                    <Utensils className="w-3.5 h-3.5 text-red-600" /> รายละเอียดแพ็กเกจอาหาร
                  </div>
                  <div><span className="text-slate-500 font-medium">แพ็กเกจอาหาร:</span> <strong className="text-red-700 font-black ml-1">{quotation.package?.name}</strong></div>
                  <div><span className="text-slate-500 font-medium">ราคาต่อโต๊ะ:</span> <strong className="text-slate-950 font-bold ml-1">{formatCurrency(quotation.package?.price || 0)} บาท</strong></div>
                  <div>
                    <span className="text-slate-500 font-medium">จำนวนโต๊ะ:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.tableCount} โต๊ะ</strong> {quotation.freeTableCount > 0 && <span className="text-emerald-700 font-black ml-1">(+แถม {quotation.freeTableCount})</span>}
                  </div>
                  <div><span className="text-slate-500 font-medium">รวมจัดเสิร์ฟ:</span> <strong className="text-red-700 font-black text-sm ml-1">{totalTables} โต๊ะ</strong></div>
                </div>

                <div className="col-span-3 border-l border-amber-200 pl-2.5 flex items-stretch">
                  <EventLocationQrBadge
                    location={quotation.customer?.eventLocation || ''}
                    size={70}
                    variant="vertical"
                    theme="gold"
                    className="w-full"
                  />
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
                <div className="border-b border-amber-300 pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="font-black text-red-800 text-[11px]">มูลค่าสัญญาและการชำระเงิน</span>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-800">
                    ชำระโดยการโอนเข้าบัญชีฝ่ายบัญชี และการผลิตหลัก(โรงครัวกลาง) ชื่อบัญชี นางสาวทัศวรรณ จันทร์หอม
                  </span>
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
                <p className="text-red-700 font-bold">4. <strong>เงื่อนไขการยกเลิก:</strong> หากมีการยืนยันล็อกคิวงานแล้ว ทางร้านขอสงวนสิทธิ์ไม่คืนเงินมัดจำทุกกรณี หากมีการยกเลิกงาน</p>
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
                    <span>ผู้รับจ้าง (โต๊ะจีนรพีพัฒน์)</span>
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
            <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-100 relative z-10">
              เอกสารสัญญาฉบับนี้มีผลผูกพันตามกฎหมาย • โต๊ะจีน รพีพัฒน์ พรีเมียม การันตีประสบการณ์กว่า 35 ปี
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
