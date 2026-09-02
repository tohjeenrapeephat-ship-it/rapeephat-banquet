import React, { useState, useRef, useEffect } from 'react';
import { BANQUET_PACKAGES } from '../data/packages.js';
import { PackageTier } from '../types/quotation.js';
import { generateA4Pdf } from '../services/pdfService.js';
import { formatCurrency } from '../utils/currency.js';
import {
  Printer,
  Download,
  X,
  Sparkles,
  Crown,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
  ChevronDown,
  ArrowRight,
  Flame,
  UtensilsCrossed,
  ShieldCheck,
  Award,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Monitor,
  Smartphone
} from 'lucide-react';

interface MenuCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageId?: string;
  onSelectForQuotation?: (pkg: PackageTier) => void;
}

export const MenuCatalogModal: React.FC<MenuCatalogModalProps> = ({
  isOpen,
  onClose,
  initialPackageId,
  onSelectForQuotation,
}) => {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(initialPackageId || 'pkg-2500');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isFitScreen, setIsFitScreen] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const printRef = useRef<HTMLDivElement>(null);

  // Synchronize initial package ID
  useEffect(() => {
    if (initialPackageId) {
      setSelectedPkgId(initialPackageId);
    }
  }, [initialPackageId]);

  // Compute scale to fit screen perfectly
  const getFitScale = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width < 850) {
      return Math.max((width - 32) / 794, 0.35);
    }
    const height = window.innerHeight;
    const heightScale = (height - 180) / 1123;
    const widthScale = (width - 64) / 794;
    return Math.min(widthScale, Math.max(heightScale, 0.75), 1.15);
  };

  // Responsive zoom scale calculation
  useEffect(() => {
    const handleResize = () => {
      if (isFitScreen) {
        setScale(getFitScale());
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFitScreen]);

  // Handle Fit to Screen toggle
  const handleToggleFitScreen = () => {
    if (isFitScreen) {
      setIsFitScreen(false);
      setScale(1);
    } else {
      setIsFitScreen(true);
      setScale(getFitScale());
    }
  };

  const handleZoomIn = () => {
    setIsFitScreen(false);
    setScale((prev) => Math.min(prev + 0.1, 1.6));
  };

  const handleZoomOut = () => {
    setIsFitScreen(false);
    setScale((prev) => Math.max(prev - 0.1, 0.35));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPkg = BANQUET_PACKAGES.find((p) => p.id === selectedPkgId) || BANQUET_PACKAGES[0];

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const safeName = currentPkg.name.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
      const fileName = `รายการอาหาร_${safeName}_โต๊ะจีนรพีพัฒน์.pdf`;
      await generateA4Pdf(printRef.current, fileName);
      setIsGeneratingPdf(false);
    } catch (err) {
      console.error('Menu PDF Generation error:', err);
      setIsGeneratingPdf(false);
      alert('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF กรุณากดปุ่ม พิมพ์ หรือสั่งบันทึก PDF ผ่านเบราว์เซอร์นะคะ');
    }
  };

  // Handle Direct Browser Print
  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-fadeIn selection:bg-red-500 selection:text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* ========================================================================= */}
      {/* 🧭 TOP CONTROLS & PACKAGE SELECTOR TOOLBAR */}
      {/* ========================================================================= */}
      <div className="w-full max-w-5xl bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-3 sm:p-4 mb-4 flex flex-col lg:flex-row items-center justify-between gap-3 shrink-0 z-10 sticky top-2">
        
        {/* Package Selector Dropdown */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
              เลือกดูรายการอาหารตามแพ็กเกจราคา:
            </label>
            <select
              value={selectedPkgId}
              onChange={(e) => setSelectedPkgId(e.target.value)}
              aria-label="เลือกแพ็กเกจราคาโต๊ะจีน"
              className="w-full bg-amber-50/80 border-2 border-amber-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              {BANQUET_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({formatCurrency(pkg.price)} บ./โต๊ะ - {pkg.courses.length} จาน)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zoom & Fit Screen Toolbar Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-300">
          
          {/* Fit to Screen Button (ปุ่มพอดีกับหน้าจอ) */}
          <button
            type="button"
            onClick={handleToggleFitScreen}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isFitScreen
                ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
            title="ปรับขนาดการแสดงผลให้พอดีกับหน้าจออัตโนมัติ"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>พอดีกับหน้าจอ</span>
          </button>

          {/* 100% Size Button */}
          <button
            type="button"
            onClick={() => {
              setIsFitScreen(false);
              setScale(1);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              !isFitScreen && Math.abs(scale - 1) < 0.05
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
            title="แสดงผลขนาดจริง 100% (A4)"
          >
            <span>100%</span>
          </button>

          {/* Zoom In & Out */}
          <div className="flex items-center gap-0.5 border-l border-slate-300 pl-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
              title="ย่อขนาด (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-700 px-1 min-w-[38px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
              title="ขยายขนาด (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Action Buttons (Print / Download PDF / Select for Quotation) */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
          
          {/* Direct Print Button */}
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102 cursor-pointer"
            title="พิมพ์ออกเครื่องพิมพ์ (Print)"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>พิมพ์ (Print)</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all transform hover:scale-102 cursor-pointer disabled:opacity-50"
            title="ดาวน์โหลดเป็นไฟล์ PDF คุณภาพสูง"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>{isGeneratingPdf ? 'กำลังประมวลผล PDF...' : 'ดาวน์โหลด PDF'}</span>
          </button>

          {/* Select for Quotation Builder */}
          {onSelectForQuotation && (
            <button
              type="button"
              onClick={() => {
                onSelectForQuotation(currentPkg);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer"
              title="นำเมนูนี้ไปเปิดในระบบคำนวณราคา & ออกใบเสนอราคา"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>ออกใบเสนอราคา</span>
            </button>
          )}

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer ml-1"
            title="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 📄 A4 PRINTABLE MENU SHEET PREVIEW (ROYAL THAI-CHINESE LUXURY) */}
      {/* ========================================================================= */}
      <div
        className="w-full flex justify-center py-2 pb-16 overflow-x-auto"
        style={{ minHeight: `${1123 * scale}px` }}
      >
        <div
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <div
            ref={printRef}
            className="print-a4-page w-[794px] min-h-[1123px] bg-white text-slate-900 p-8 sm:p-10 shadow-2xl border-4 border-double border-amber-400/90 rounded-2xl relative flex flex-col justify-between overflow-hidden"
            style={{
              fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Elegant Corner Ornaments (Luxury Gold & Red) */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500 pointer-events-none" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500 pointer-events-none" />

            {/* Top Content */}
            <div className="space-y-4">
              
              {/* 👑 HEADER: BRAND LOGO + DBD REGISTERED + CULINARY HERITAGE */}
              <div className="flex items-center justify-between pb-3.5 border-b-2 border-amber-300 gap-4">
                
                {/* Brand Logo & Title */}
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-amber-300 p-1 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src="/images/brand/logo.png"
                      alt="โต๊ะจีน รพีพัฒน์"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
                        โต๊ะจีน<span className="text-red-700">รพีพัฒน์</span>
                      </h1>
                      <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-black uppercase rounded-full shadow-2xs">
                        PREMIUM
                      </span>
                    </div>
                    <div className="text-xs font-bold text-amber-950 flex items-center gap-1 mt-1">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span>สืบทอดตำนานความอร่อย ต้นตำรับนครปฐม ยาวนานกว่า 35+ ปี</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      บริการจัดเลี้ยงโต๊ะจีนภัตตาคารทั่วประเทศไทย • ปรุงสุกสดใหม่ร้อนๆ หน้างาน 100%
                    </div>
                  </div>
                </div>

                {/* Trust Badges Stamp (DBD Registered & Quality Certified) */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="px-2.5 py-1 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-950 text-[10px] font-black flex items-center gap-1 shadow-2xs">
                      <span>🏛️ DBD Registered</span>
                      <span className="text-emerald-700 font-bold">✓ ตรวจสอบได้</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-[10px] font-black flex items-center gap-1 shadow-2xs">
                      <span>🌿 สดใหม่ 100%</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">
                    โทร: 081-331-1646 • LINE: pang_baichaa
                  </div>
                </div>

              </div>

              {/* 🏷️ PACKAGE TITLE BANNER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-800 via-red-700 to-amber-800 text-white shadow-md flex items-center justify-between gap-4 border border-amber-300/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10.5px] font-black uppercase rounded-md">
                      ใบรายการอาหารโต๊ะจีน
                    </span>
                    <span className="text-amber-200 text-xs font-bold">
                      {currentPkg.tag || 'เมนูมาตรฐานภัตตาคาร'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {currentPkg.name}
                  </h2>
                  <p className="text-xs text-amber-100 font-medium">
                    {currentPkg.description}
                  </p>
                </div>

                <div className="text-right shrink-0 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20">
                  <div className="text-[11px] font-bold text-amber-200 uppercase">ราคาต่อโต๊ะ</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-sans leading-none">
                    {formatCurrency(currentPkg.price)}.-
                  </div>
                  <div className="text-[10px] text-white/80 font-bold mt-0.5">
                    ({currentPkg.courses.length} รายการอาหาร)
                  </div>
                </div>
              </div>

              {/* 📋 COURSE LIST GRID (2-COLUMN BALANCED ELEGANT LAYOUT) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>รายการอาหารคัดเกรดพรีเมียม ทั้งหมด {currentPkg.courses.length} จาน (สามารถเลือกปรับเปลี่ยนเมนูได้):</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ✨ จานโต๊ะจีนมงคล 10 ท่าน/โต๊ะ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentPkg.courses.map((course, idx) => (
                    <div
                      key={course.id || idx}
                      className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/90 space-y-1.5 shadow-2xs break-inside-avoid"
                    >
                      {/* Course Number & Title */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-red-700 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-black text-slate-950">
                            {course.title.replace(/^จานที่\s*\d+:?\s*/i, '')}
                          </h4>
                        </div>
                        {course.options.length > 1 && (
                          <span className="text-[9.5px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200 shrink-0">
                            เลือก 1 อย่าง
                          </span>
                        )}
                      </div>

                      {/* Dish Options List */}
                      <div className="space-y-1 pl-7 text-xs">
                        {course.options.map((opt, optIdx) => (
                          <div
                            key={opt.id || optIdx}
                            className={`flex items-start gap-1.5 ${
                              optIdx === 0 ? 'font-black text-slate-900' : 'font-medium text-slate-700'
                            }`}
                          >
                            <span className="text-slate-400 font-mono text-[11px] mt-0.5 shrink-0">
                              [ ]
                            </span>
                            <span className="leading-snug">
                              {opt.name}
                              {opt.tag && (
                                <span className="ml-1.5 text-[9.5px] font-bold text-amber-800 bg-amber-100/70 px-1 py-0.2 rounded">
                                  {opt.tag}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>

              {/* 🎁 COMPLIMENTARY PRIVILEGES & INCLUSIONS */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-emerald-50/40 to-amber-50 border-2 border-amber-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>สิทธิพิเศษ & อุปกรณ์ฟรีที่ท่านจะได้รับทุกแพ็กเกจ (ไม่มีค่าใช้จ่ายแฝง):</span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-700 text-white text-[10px] font-black rounded-md">
                    PROMOTION 35 ปี
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-800 font-medium">
                  <div className="p-2 bg-white rounded-xl border border-amber-200 flex items-start gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-black">สั่ง 20 แถม 1 โต๊ะ</strong>
                      <span className="text-[10px] text-slate-600">สั่ง 40 โต๊ะ แถมฟรี 2 โต๊ะ</span>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-amber-200 flex items-start gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-black">ฟรี โต๊ะ & เก้าอี้</strong>
                      <span className="text-[10px] text-slate-600">เบาะนุ่มผูกโบว์หรูหรา</span>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-amber-200 flex items-start gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-black">ฟรี จานชามครบชุด</strong>
                      <span className="text-[10px] text-slate-600">ช้อน ส้อม แก้วน้ำ ทิชชู่</span>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-amber-200 flex items-start gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-black">ฟรี ทีมบริกรเสิร์ฟ</strong>
                      <span className="text-[10px] text-slate-600">ดูแลตลอดงานจัดเลี้ยง</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* 📞 OFFICIAL FOOTER: CONTACT & AUTHENTIC GUARANTEE */}
            <div className="pt-3 border-t-2 border-amber-300 mt-3 flex items-center justify-between text-xs text-slate-700">
              
              <div className="space-y-0.5">
                <div className="font-black text-slate-950 text-xs flex items-center gap-1.5">
                  <span>👑 โต๊ะจีนรพีพัฒน์ พรีเมียม (RAPEEPHAT BANQUET CATERING)</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  มีสัญญาจ้างจัดเลี้ยง • ออกใบเสร็จรับเงินมัดจำ 30% และใบเสร็จรับเงินคงเหลือ 70% ครบถ้วนถูกต้อง
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-black text-red-700 text-sm flex items-center justify-end gap-1">
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>081-331-1646 (คุณแป้ง)</span>
                </div>
                <div className="text-[10.5px] font-bold text-emerald-800">
                  LINE: pang_baichaa • www.rapeephat-catering.com
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
