import React, { useState } from 'react';
import { BANQUET_PACKAGES } from '../data/packages.js';
import { PackageTier } from '../types/quotation.js';
import { Sparkles, Check, ChevronDown, ChevronUp, Crown, Flame, ArrowRight, Printer, FileText, Download } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import { MenuCatalogModal } from './MenuCatalogModal.js';

interface PackageSectionProps {
  onSelectPackage: (pkg: PackageTier) => void;
}

export const PackageSection: React.FC<PackageSectionProps> = ({ onSelectPackage }) => {
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>('pkg-1700');
  const [catalogModalOpen, setCatalogModalOpen] = useState<boolean>(false);
  const [catalogPkgId, setCatalogPkgId] = useState<string>('pkg-2500');

  const toggleExpand = (id: string) => {
    setExpandedPkgId(expandedPkgId === id ? null : id);
  };

  const handleOpenCatalog = (pkgId?: string) => {
    if (pkgId) setCatalogPkgId(pkgId);
    setCatalogModalOpen(true);
  };

  return (
    <section id="packages" className="py-20 relative bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>แพ็กเกจโต๊ะจีนมาตรฐานภัตตาคาร</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            เลือกแพ็กเกจราคาโต๊ะจีน
            <span className="block mt-1 text-gradient-red-gold">
              สด สะอาด อร่อย คุ้มค่าทุกระดับ
            </span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            ทุกแพ็กเกจ <strong className="text-red-700 font-black">ฟรี!</strong> อุปกรณ์โต๊ะ เก้าอี้ ผ้าคลุมผูกโบว์ ชุดจานชาม และบริกรครบเซ็ต • <span className="text-amber-800 font-bold">สั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะทันที</span>
          </p>

          {/* Prominent Global Print Menu Catalogue CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleOpenCatalog('pkg-2500')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-slate-900 hover:text-red-700 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-102 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-red-600" />
              <span>🖨️ ดู & พิมพ์ใบรายการอาหารทุกราคา (PDF Brochure)</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {BANQUET_PACKAGES.map((pkg) => {
            const isPopular = pkg.isPopular;
            const isExpanded = expandedPkgId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isPopular
                    ? 'bg-white border-2 border-red-500 shadow-xl shadow-red-900/10 scale-[1.02] z-10 ring-4 ring-amber-300/40'
                    : 'bg-white border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-xl shadow-md shadow-amber-900/5'
                }`}
              >
                {/* Popular / Best Seller Badge */}
                {isPopular && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1 border-x border-b border-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>👑 ขายดีอันดับ 1 ยอดนิยม</span>
                  </div>
                )}

                {/* Package Header */}
                <div className={`p-6 sm:p-7 border-b ${isPopular ? 'pt-9 border-red-100 bg-gradient-to-b from-red-50/60 to-white' : 'border-amber-100 bg-gradient-to-b from-amber-50/40 to-white'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {pkg.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10.5px] font-black shrink-0">
                      {pkg.courses.length} จาน
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-1.5 line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-red-700 tracking-tight font-sans">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">บาท / โต๊ะ</span>
                  </div>
                </div>

                {/* Course List */}
                <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      <span>รายการอาหารในเซ็ต ({pkg.courses.length} จาน):</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-800">
                      {(isExpanded ? pkg.courses : pkg.courses.slice(0, 4)).map((course, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 leading-tight truncate">
                            {course.options[0]?.name || course.title}
                          </span>
                        </div>
                      ))}

                      {pkg.courses.length > 4 && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(pkg.id)}
                          className="text-[11.5px] font-black text-red-700 hover:text-red-800 flex items-center gap-1 pt-1"
                        >
                          <span>{isExpanded ? 'ย่อรายการ' : `ดูอีก ${pkg.courses.length - 4} จานที่เหลือ...`}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action CTA Buttons (Select for Quotation & Print PDF) */}
                  <div className="pt-4 border-t border-amber-100 space-y-2">
                    
                    {/* Primary Builder Button */}
                    <button
                      type="button"
                      onClick={() => onSelectPackage(pkg)}
                      className={`w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-95 shadow-sm ${
                        isPopular
                          ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-red-glow border border-amber-300'
                          : 'bg-slate-900 hover:bg-black text-amber-300 border border-amber-500/40 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>เลือกแพ็กเกจนี้ & ออกใบเสนอราคา</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Print / Download PDF Button for This Specific Package */}
                    <button
                      type="button"
                      onClick={() => handleOpenCatalog(pkg.id)}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-slate-800 hover:text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-300 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-600" />
                      <span>พิมพ์รายการอาหารนี้ (PDF A4)</span>
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Menu Catalog & Printable A4 PDF Modal */}
      <MenuCatalogModal
        isOpen={catalogModalOpen}
        onClose={() => setCatalogModalOpen(false)}
        initialPackageId={catalogPkgId}
        onSelectForQuotation={(pkg) => onSelectPackage(pkg)}
      />

    </section>
  );
};
