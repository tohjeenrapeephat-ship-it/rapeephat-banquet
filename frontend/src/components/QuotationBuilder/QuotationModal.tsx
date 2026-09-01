import React, { useRef, useState, useEffect } from 'react';
import { QuotationDoc } from '../../types/quotation.js';
import { formatCurrency, thaiBahtText } from '../../utils/currency.js';
import { formatThaiDate } from '../../utils/thaiDate.js';
import { generateA4Pdf } from '../../services/pdfService.js';
import { uploadPdfToGoogleDrive } from '../../services/gasDriveService.js';
import { QuotationApi } from '../../services/api.js';
import confetti from 'canvas-confetti';
import {
  X,
  Printer,
  Download,
  CloudUpload,
  ExternalLink,
  MessageCircle,
  Phone,
  Sparkles,
  User,
  Calendar,
  BadgeCheck,
  ShieldCheck,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Maximize2,
  Monitor,
  Smartphone
} from 'lucide-react';

interface QuotationModalProps {
  quotation: QuotationDoc;
  onClose: () => void;
  onSaved?: (savedQuote: QuotationDoc) => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ quotation, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isUploadingDrive, setIsUploadingDrive] = useState(false);
  const [driveUrl, setDriveUrl] = useState<string | undefined>(quotation.pdfDriveUrl);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'fit'>('desktop');
  const [scale, setScale] = useState<number>(1);

  const displayQuoteNo = quotation.quoteNo ? quotation.quoteNo.replace(/^QT-/, 'QT') : '';

  // Calculate dynamic scale for fit view on mobile
  useEffect(() => {
    const updateScale = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 820) {
          setScale(Math.max((width - 32) / 794, 0.36));
        } else {
          setScale(1);
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Trigger celebration confetti on open
  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#EA580C', '#10B981', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti effect error:', e);
    }
  }, []);

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const fileName = `ใบเสนอราคา_โต๊ะจีนรพีพัฒน์_${displayQuoteNo}_${quotation.customer.name}.pdf`;
      const result = await generateA4Pdf(printRef.current, fileName);
      setIsGeneratingPdf(false);
      return result;
    } catch (err) {
      console.error('PDF Generation error:', err);
      setIsGeneratingPdf(false);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF กรุณาลองใหม่อีกครั้งหรือกดปุ่มพิมพ์');
    }
  };

  // Handle Google Drive Upload via GAS Webhook
  const handleUploadGoogleDrive = async () => {
    if (!printRef.current) return;
    try {
      setIsUploadingDrive(true);
      const fileName = `ใบเสนอราคา_โต๊ะจีนรพีพัฒน์_${displayQuoteNo}_${quotation.customer.name}.pdf`;
      const { base64 } = await generateA4Pdf(printRef.current, fileName);
      
      const driveResult = await uploadPdfToGoogleDrive(
        displayQuoteNo,
        quotation.customer.name,
        base64
      );

      if (driveResult && driveResult.webViewLink) {
        setDriveUrl(driveResult.webViewLink);
        if (quotation.id) {
          await QuotationApi.updateDriveUrl(quotation.id, displayQuoteNo, driveResult.webViewLink);
        }
      }
      setIsUploadingDrive(false);
    } catch (err) {
      console.error('Drive upload error:', err);
      setIsUploadingDrive(false);
      alert('ไม่สามารถอัปโหลดไปยัง Google Drive ได้ในขณะนี้');
    }
  };

  // Handle LINE Direct Message Summary
  const getLineMessage = () => {
    const dishesList = quotation.selectedDishes
      .map((d, i) => `   ${i + 1}. ${d.dishName}`)
      .join('\n');

    return `สวัสดีครับ/ค่ะ ขอส่งใบเสนอราคา โต๊ะจีน รพีพัฒน์ พรีเมียม\n` +
      `📌 เลขที่เอกสาร: ${displayQuoteNo}\n` +
      `👤 ชื่อลูกค้า: ${quotation.customer.name}\n` +
      `📞 โทร: ${quotation.customer.phone}\n` +
      `📅 วันที่จัดงาน: ${formatThaiDate(quotation.customer.eventDate)} (${quotation.customer.eventTime})\n` +
      `📍 สถานที่: ${quotation.customer.eventLocation}\n` +
      `🍱 แพ็กเกจ: ${quotation.package.name} (${formatCurrency(quotation.package.price)}/โต๊ะ)\n` +
      `🍽️ จำนวน: ${quotation.tableCount} โต๊ะ ${quotation.freeTableCount > 0 ? `(แถมฟรี ${quotation.freeTableCount} โต๊ะ)` : ''}\n` +
      `📋 เมนูอาหารที่เลือก (${quotation.selectedDishes.length} จาน):\n${dishesList}\n` +
      `💰 ยอดสุทธิ: ${formatCurrency(quotation.grandTotal)} บาท\n` +
      `🔒 มัดจำ 30%: ${formatCurrency(quotation.depositAmount)} บาท\n` +
      `🏦 ข้อมูลการโอนเงิน:\n` +
      `   • ชื่อบัญชี: นางสาวทัศวรรณ จันทร์หอม\n` +
      `   • ธนาคารไทยพาณิชย์: 411-239908-0 (สาขาเซ็นทรัล นครปฐม)\n` +
      `   • พร้อมเพย์: 081-331-1646\n` +
      (driveUrl ? `📄 ลิงก์ PDF บน Google Drive: ${driveUrl}\n` : '') +
      `ขอบคุณครับ`;
  };

  const handleShareLine = () => {
    window.open(`https://line.me/ti/p/~pang_baichaa`, '_blank');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getLineMessage());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-1 sm:p-4 md:p-6 lg:py-6 flex justify-center items-start">
      <div className="relative w-full max-w-4xl bg-slate-100 border border-slate-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto sm:my-2">
        
        {/* ========================================================================= */}
        {/* 🎛️ MODAL TOP STICKY TOOLBAR */}
        {/* ========================================================================= */}
        <div className="no-print sticky top-0 z-30 p-3 sm:p-4 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand Info */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center shrink-0">
              <img
                src="/images/brand/logo.png"
                alt="โลโก้ โต๊ะจีน รพีพัฒน์"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>ใบเสนอราคามาตรฐานภัตตาคาร</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  A4 ฉบับจริง
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                เลขที่: <span className="text-amber-400 font-mono font-bold">{displayQuoteNo}</span> • เจ้าภาพ: <strong className="text-white">{quotation.customer.name}</strong>
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* View Mode Toggle (Desktop / Mobile Fit) */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'desktop' ? 'fit' : 'desktop')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-400/40 shadow-xs transition-all"
              title="สลับมุมมองคอมพิวเตอร์ (ขนาดจริง A4) / พอดีจอมือถือ"
            >
              {viewMode === 'desktop' ? (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">ดูแบบพอดีจอมือถือ</span>
                  <span className="sm:hidden">พอดีจอ</span>
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">ดูแบบคอมพิวเตอร์</span>
                  <span className="sm:hidden">แบบคอม</span>
                </>
              )}
            </button>

            {/* Native Browser Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold items-center gap-1.5 border border-slate-700 transition-colors shadow-xs"
              title="สั่งพิมพ์ออกเครื่องพิมพ์โดยตรง (A4 1 หน้า)"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>พิมพ์เอกสาร</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all border border-red-500"
              title="ดาวน์โหลดไฟล์ PDF คุณภาพสูง A4"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}</span>
            </button>

            {/* Upload Google Drive */}
            <button
              type="button"
              onClick={handleUploadGoogleDrive}
              disabled={isUploadingDrive}
              className="hidden sm:flex px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold items-center gap-1.5 transition-colors"
              title="สำรองไฟล์ PDF ขึ้น Google Drive"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isUploadingDrive ? 'กำลังเซฟ...' : 'เซฟลง Drive'}</span>
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

        {/* Mobile View Mode Switcher Banner */}
        <div className="no-print sm:hidden px-3.5 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            {viewMode === 'desktop' ? (
              <>
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>มุมมอง: <strong className="text-amber-300">แบบคอมพิวเตอร์</strong> (A4 เต็มใบ)</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>มุมมอง: <strong className="text-emerald-300">พอดีจอมือถือ</strong></span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'desktop' ? 'fit' : 'desktop')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all border border-amber-300 shrink-0"
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>ดูแบบพอดีจอ</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>ดูแบบคอมพิวเตอร์</span>
              </>
            )}
          </button>
        </div>

        {/* Drive Link Banner if uploaded */}
        {driveUrl && (
          <div className="no-print mx-4 sm:mx-6 mt-3 p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <CloudUpload className="w-4 h-4 text-blue-600" />
              <span className="font-medium">ไฟล์ PDF บันทึกบน Google Drive เรียบร้อย:</span>
            </div>
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>เปิดดูไฟล์บน Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📄 DOCUMENT VIEWPORT CONTAINER (FULL CRISP A4 DOCUMENT VIEW) */}
        {/* ========================================================================= */}
        <div className="p-2 sm:p-4 bg-slate-200/90 flex justify-center items-start overflow-x-auto">
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
            <div
              ref={printRef}
              className="print-a4-page bg-white text-slate-900 shadow-2xl rounded-xl border border-slate-300 font-sans mx-auto flex flex-col justify-between"
              style={{
                width: '794px',
                minWidth: '794px',
                minHeight: '1123px',
                padding: '20px 24px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
              }}
            >
            {/* Top Section Group */}
            <div className="space-y-2">
              
              {/* 1. Header: Clean Letterhead */}
              <div className="flex justify-between items-start pb-1.5 border-b-2 border-red-600 gap-2">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center shrink-0">
                      <img
                        src="/images/brand/logo.png"
                        alt="ตราสัญลักษณ์ โต๊ะจีน รพีพัฒน์"
                        className="h-14 sm:h-16 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-red-700 tracking-tight leading-none">
                        โต๊ะจีน รพีพัฒน์ พรีเมียม
                      </h1>
                      <div className="text-[10px] font-black text-amber-800 uppercase tracking-wider mt-0.5">
                        RAPEEPHAT BANQUET CATERING • ประสบการณ์จัดเลี้ยงภัตตาคาร 35+ ปี
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-700 pt-0.5 font-semibold space-y-0.5" style={{ lineHeight: '1.45', overflow: 'visible' }}>
                    <div>บริการจัดเลี้ยงโต๊ะจีนระดับภัตตาคาร สด สะอาด อร่อย ทั่วราชอาณาจักร</div>
                    <div>
                      <span className="font-bold text-slate-900">โทร:</span> <strong className="text-red-700 font-mono text-[12px] font-black">081-331-1646</strong> (คุณแป้ง) • <span className="font-bold text-slate-900">LINE:</span> <strong>pang_baichaa</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">อีเมล:</span> <strong className="font-mono text-slate-900">info@rapeephat-catering.com, baicha@rapeephat-catering.com</strong>
                    </div>
                  </div>
                </div>

                {/* Quotation ID Card */}
                <div className="text-right bg-slate-50 p-1.5 px-3 rounded-xl border border-slate-200 space-y-0.5 shrink-0 min-w-[175px]">
                  <div className="inline-flex items-center gap-1 text-[11px] font-black text-red-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>ใบเสนอราคา / QUOTATION</span>
                  </div>
                  <div className="text-xs text-slate-800 font-bold" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    เลขที่: <strong className="text-red-700 font-mono font-black text-sm">{displayQuoteNo}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    วันที่ออก: {formatThaiDate(quotation.createdAt || new Date().toISOString())}
                  </div>
                </div>
              </div>

              {/* 2. Customer & Event Venue Info Box (Clean & Minimal) */}
              <div className="grid grid-cols-2 gap-3 p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                
                {/* Customer Column */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-red-700 uppercase tracking-wide pb-0.5 border-b border-slate-200">
                    <User className="w-3.5 h-3.5" />
                    <span>ข้อมูลเจ้าภาพ / ผู้ว่าจ้าง:</span>
                  </div>
                  <div className="text-slate-900 font-medium text-[13px]" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <span className="text-slate-500 font-bold">ชื่อเจ้าภาพ:</span> <strong className="text-slate-950 font-black text-sm ml-1">{quotation.customer.name}</strong>
                  </div>
                  <div className="text-slate-900 font-medium text-[13px]" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <span className="text-slate-500 font-bold">เบอร์โทรศัพท์:</span> <strong className="font-mono text-red-700 font-black text-sm ml-1">{quotation.customer.phone}</strong>
                  </div>
                  <div className="text-slate-900 font-medium text-xs" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <span className="text-slate-500 font-bold">ประเภทงาน:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer.eventType || 'งานจัดเลี้ยง'}</strong>
                  </div>
                </div>

                {/* Event Schedule & Location Column */}
                <div className="space-y-0.5 border-l border-slate-200 pl-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-red-700 uppercase tracking-wide pb-0.5 border-b border-slate-200">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>กำหนดการ & สถานที่จัดงาน:</span>
                  </div>
                  <div className="text-slate-900 font-medium text-[13px]" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <span className="text-slate-500 font-bold">วันที่จัดงาน:</span> <strong className="text-red-700 font-black text-sm ml-1">{formatThaiDate(quotation.customer.eventDate)}</strong>
                  </div>
                  <div className="text-slate-900 font-medium text-xs" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <span className="text-slate-500 font-bold">เวลาเสิร์ฟ:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer.eventTime || 'ช่วงเย็น'}</strong>
                  </div>
                  <div className="text-slate-900 font-medium text-xs" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <span className="text-slate-500 font-bold">สถานที่:</span> <strong className="text-slate-950 font-bold ml-1">{quotation.customer.eventLocation}</strong>
                  </div>
                </div>

              </div>

              {/* 3. ตารางรายการจัดเลี้ยง & คำนวณราคา (Clean Bordered Table) */}
              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-white font-black">
                      <th className="py-2 px-2.5 text-center w-10 text-xs">ลำดับ</th>
                      <th className="py-2 px-2.5 text-xs">รายการจัดเลี้ยง</th>
                      <th className="py-2 px-2.5 text-center w-20 text-xs">จำนวน</th>
                      <th className="py-2 px-2.5 text-right w-24 text-xs">ราคา/หน่วย</th>
                      <th className="py-2 px-2.5 text-right w-32 text-xs whitespace-nowrap">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-950 font-bold text-xs sm:text-[13px]">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-2.5 text-center font-black text-slate-500">1</td>
                      <td className="py-2 px-2.5">
                        <div className="font-black text-slate-950 text-xs sm:text-sm">{quotation.package.name} ({quotation.selectedDishes.length} จาน)</div>
                        <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                          ฟรีอุปกรณ์ครบชุด โต๊ะ เก้าอี้พร้อมผ้าคลุมผูกโบว์ จานชามเมลามีน และทีมบริกร
                        </div>
                      </td>
                      <td className="py-2 px-2.5 text-center font-black text-slate-950">{quotation.tableCount} โต๊ะ</td>
                      <td className="py-2 px-2.5 text-right font-black text-slate-950">{formatCurrency(quotation.package.price)}</td>
                      <td className="py-2 px-2.5 text-right font-black text-slate-950">
                        {formatCurrency(quotation.package.price * quotation.tableCount)}
                      </td>
                    </tr>

                    {quotation.beverage && quotation.beverage.pricePerTable > 0 && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center font-black text-slate-500">2</td>
                        <td className="py-2 px-2.5">
                          <div className="font-black text-slate-950 text-xs">{quotation.beverage.name}</div>
                          <div className="text-[10.5px] text-slate-500 font-medium">น้ำอัดลม น้ำดื่ม 1500ml น้ำแข็งเสิร์ฟตลอดงาน</div>
                        </td>
                        <td className="py-2 px-2.5 text-center font-black text-slate-950">{quotation.tableCount} โต๊ะ</td>
                        <td className="py-2 px-2.5 text-right font-black text-slate-950">{formatCurrency(quotation.beverage.pricePerTable)}</td>
                        <td className="py-2 px-2.5 text-right font-black text-slate-950">
                          {formatCurrency(quotation.beverage.total)}
                        </td>
                      </tr>
                    )}

                    {quotation.floorService?.enabled && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center font-black text-slate-500">3</td>
                        <td className="py-2 px-2.5 font-bold text-slate-950 text-xs">บริการยกขึ้นอาคารชั้น 2 ขึ้นไป (ไม่มีลิฟต์)</td>
                        <td className="py-2 px-2.5 text-center font-black text-slate-950">{quotation.tableCount} โต๊ะ</td>
                        <td className="py-2 px-2.5 text-right font-black text-slate-950">100</td>
                        <td className="py-2 px-2.5 text-right font-black text-slate-950">
                          {formatCurrency(quotation.floorService.total)}
                        </td>
                      </tr>
                    )}

                    {/* Free Table Promotion Row */}
                    {quotation.freeTableCount > 0 && (
                      <tr className="bg-emerald-50/80 text-emerald-950 font-black border-t border-emerald-300">
                        <td className="py-2 px-2.5 text-center text-emerald-700 font-black text-sm">🎁</td>
                        <td className="py-2 px-2.5">
                          <div className="text-emerald-950 font-black text-xs">
                            ของแถมโปรโมชันพิเศษ (สั่งทุกๆ 20 โต๊ะ แถมฟรี 1 โต๊ะ)
                          </div>
                          <div className="text-[10.5px] font-bold text-emerald-800 mt-0.5">
                            • ได้รับโต๊ะจัดเลี้ยงแถมฟรี {quotation.freeTableCount} โต๊ะ (รวมจัดเสิร์ฟทั้งหมด {quotation.tableCount + quotation.freeTableCount} โต๊ะ)
                          </div>
                        </td>
                        <td className="py-2 px-2.5 text-center font-black text-emerald-900">
                          +{quotation.freeTableCount} โต๊ะ
                        </td>
                        <td className="py-2 px-2.5 text-right font-black text-emerald-700 text-xs">
                          ฟรี
                        </td>
                        <td className="py-2 px-2.5 text-right font-black text-emerald-700 text-xs sm:text-sm">
                          ฟรี (0 บาท)
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/90 font-bold border-t border-slate-300">
                      <td colSpan={3} className="p-2 px-3 text-slate-800 font-bold text-xs" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                        <div>
                          จำนวนเงินตัวอักษร: <strong className="text-slate-950 font-black text-xs sm:text-sm">({thaiBahtText(quotation.grandTotal)})</strong>
                        </div>
                        {quotation.freeTableCount > 0 && (
                          <div className="text-[11px] text-emerald-800 font-black mt-0.5">
                            *จัดเสิร์ฟจริงรวม {quotation.tableCount + quotation.freeTableCount} โต๊ะ (สั่ง {quotation.tableCount} โต๊ะ + แถมฟรี {quotation.freeTableCount} โต๊ะ)
                          </div>
                        )}
                      </td>
                      <td className="p-2 text-right text-slate-950 font-black text-xs whitespace-nowrap">ยอดสุทธิรวมทั้งสิ้น:</td>
                      <td className="p-2.5 text-right text-base sm:text-xl text-red-700 font-black tracking-tight whitespace-nowrap">
                        {formatCurrency(quotation.grandTotal)} บาท
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* 4. รายการอาหารที่เลือกในแพ็กเกจ (Clean 2-Column Grid) */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between pb-1 border-b-2 border-red-600">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-red-600" />
                    <span className="font-black text-slate-950 text-sm sm:text-base">
                      รายการอาหารที่เลือกในแพ็กเกจ ({quotation.package.name})
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    ครบ {quotation.selectedDishes.length} จานมาตรฐาน
                  </span>
                </div>

                {/* 2-Column Dish Cards (Clean & Edge-to-Edge) */}
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5">
                  {quotation.selectedDishes.map((dish, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs"
                      style={{ minHeight: '40px', overflow: 'visible' }}
                    >
                      <span className="px-2 py-0.5 rounded-md bg-red-700 text-white font-black text-[11px] whitespace-nowrap flex items-center justify-center shrink-0 shadow-2xs">
                        จานที่ {i + 1}
                      </span>
                      <span 
                        className="font-bold text-slate-950 text-[14px] sm:text-[15px] flex-1 pl-1"
                        style={{ lineHeight: '1.5', overflow: 'visible' }}
                      >
                        {dish.dishName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Section Group (Payment Terms + Bank + Signatures) */}
            <div className="space-y-2 pt-1.5">
              
              {/* 5. Payment Terms & Bank Account Details */}
              <div className="grid grid-cols-12 gap-3 p-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                
                {/* Deposit Split & Terms */}
                <div className="col-span-6 space-y-0.5">
                  <div className="flex items-center gap-1 font-black text-red-700 uppercase tracking-wide text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    <span>เงื่อนไขการชำระเงิน & การจองจัดเลี้ยง:</span>
                  </div>
                  <ul className="space-y-0.5 text-slate-900 font-semibold list-disc list-inside text-[11px] leading-tight" style={{ lineHeight: '1.5', overflow: 'visible' }}>
                    <li>
                      <strong className="text-slate-950">มัดจำล็อกคิว 30%:</strong> <span className="text-red-700 font-black text-xs">{formatCurrency(quotation.depositAmount)} บาท</span> เพื่อยืนยันวันจัดเลี้ยง
                    </li>
                    <li>
                      <strong className="text-slate-950">ยอดคงเหลือ 70%:</strong> <span className="font-black text-slate-950 text-xs">{formatCurrency(quotation.finalAmount)} บาท</span> ชำระในวันจัดงานจริง
                    </li>
                    <li>
                      <strong>บริการรวมฟรี:</strong> โต๊ะ เก้าอี้พร้อมผ้าคลุมผูกโบว์ จานชาม และทีมบริกร
                    </li>
                  </ul>
                </div>

                {/* Bank Account & SCB Thai QR Payment Box */}
                <div className="col-span-6 p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-50/90 via-slate-50 to-purple-50/70 border-2 border-purple-300 flex items-center gap-2.5 shadow-2xs">
                  {/* Official SCB Thai QR Code Frame */}
                  <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-white p-0.5 border border-purple-400 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src="/images/payment/scb-qr.jpg"
                      alt="สแกนจ่าย Thai QR Payment / SCB"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Account Text info */}
                  <div className="text-xs text-slate-950 font-bold leading-tight space-y-0.5 flex-1" style={{ lineHeight: '1.4', overflow: 'visible' }}>
                    <div className="flex items-center gap-1 text-[11px] font-black text-purple-950 uppercase">
                      <QrCode className="w-3.5 h-3.5 text-purple-700" />
                      <span>สแกน QR Code หรือโอนเงิน:</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">ชื่อบัญชี:</span> <strong className="text-purple-950 font-black text-xs ml-0.5">นางสาวทัศวรรณ จันทร์หอม</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 font-medium">ธ.ไทยพาณิชย์:</span>
                      <strong className="font-mono text-purple-950 font-black text-xs bg-white px-1.5 py-0.5 rounded border border-purple-300 shadow-2xs">
                        411-239908-0
                      </strong>
                    </div>
                    <div className="text-[10px] text-purple-800 font-bold">
                      * สแกน QR Code เพื่อชำระมัดจำล็อกคิว 30%
                    </div>
                  </div>
                </div>

              </div>

              {/* 6. Signature Lines: Auspicious Signature & Matching Date */}
              <div className="grid grid-cols-2 gap-6 pt-2 text-center text-xs text-slate-800">
                
                {/* Quotation Provider: Signature + Matched Date */}
                <div className="space-y-1 relative" style={{ overflow: 'visible' }}>
                  <div className="font-bold text-slate-900 text-xs py-0.5" style={{ lineHeight: '1.6', overflow: 'visible' }}>
                    ผู้เสนอราคา (โต๊ะจีน รพีพัฒน์ พรีเมียม)
                  </div>
                  
                  {/* Auspicious Rapeephat P. Signature */}
                  <div className="relative h-12 flex items-center justify-center my-1">
                    <div className="relative z-10 select-none pointer-events-none flex items-center justify-center">
                      <img
                        src="/images/brand/signature-rapeephat-p.png"
                        alt="ลายเซ็น Rapeephat P."
                        className="h-11 sm:h-12 w-auto object-contain mix-blend-multiply filter contrast-250 brightness-65 scale-110 drop-shadow-xs"
                      />
                    </div>

                    {/* Auspicious Red Seal Stamp */}
                    <div className="absolute right-2 sm:right-6 -top-0.5 w-11 h-11 rounded-full border-2 border-red-600/80 border-dashed flex flex-col items-center justify-center text-red-600/85 transform rotate-12 pointer-events-none select-none p-0.5 shadow-2xs">
                      <span className="text-[7.5px] font-black leading-none uppercase tracking-tighter">รพีพัฒน์</span>
                      <span className="text-[8.5px] leading-none my-0.5 font-bold">★ มงคล ★</span>
                      <span className="text-[6.5px] font-black leading-none">35 YEARS</span>
                    </div>
                  </div>

                  <div className="font-black text-slate-900 text-xs pt-0.5" style={{ lineHeight: '1.6', overflow: 'visible' }}>
                    ( นางสาวทัศวรรณ จันทร์หอม )
                  </div>
                  <div className="text-[10.5px] text-slate-700 font-bold" style={{ lineHeight: '1.6', overflow: 'visible' }}>
                    วันที่ {formatThaiDate(quotation.createdAt || new Date().toISOString())}
                  </div>
                </div>

                {/* Customer Signature Card */}
                <div className="space-y-1 flex flex-col justify-between" style={{ overflow: 'visible' }}>
                  <div className="font-bold text-slate-900 text-xs py-0.5" style={{ lineHeight: '1.6', overflow: 'visible' }}>
                    เจ้าภาพ / ผู้ตกลงว่าจ้าง
                  </div>
                  <div className="h-12 flex items-end justify-center pb-1 my-1">
                    <div className="border-b border-slate-400 w-44 mx-auto" />
                  </div>
                  <div className="font-black text-slate-900 text-xs sm:text-sm pt-0.5" style={{ lineHeight: '1.6', overflow: 'visible' }}>
                    ( {quotation.customer.name} )
                  </div>
                  <div className="text-[10.5px] text-slate-700 font-bold" style={{ lineHeight: '1.6', overflow: 'visible' }}>
                    วันที่ {formatThaiDate(quotation.createdAt || new Date().toISOString())}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

        {/* ========================================================================= */}
        {/* 📱 MODAL BOTTOM ACTION BAR (DUAL ACTIONS + LINE) */}
        {/* ========================================================================= */}
        <div className="no-print p-4 sm:p-5 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-medium">ติดต่อสอบถามข้อมูลเพิ่มเติม โทร <strong className="text-white font-bold">081-331-1646</strong> (คุณแป้ง)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copySuccess ? 'คัดลอกเรียบร้อยแล้ว' : 'คัดลอกข้อความสรุป'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareLine}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ส่งต่อทาง LINE</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
