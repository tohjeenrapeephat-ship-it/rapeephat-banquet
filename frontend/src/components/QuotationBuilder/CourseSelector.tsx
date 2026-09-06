import React, { useState } from 'react';
import { PackageTier, SelectedDishMap } from '../../types/quotation.js';
import { Utensils, CheckCircle2, Circle, Sparkles, Crown, Check, ChefHat, Printer, FileText, ZoomIn, X, Eye } from 'lucide-react';
import { MenuCatalogModal } from '../MenuCatalogModal.js';
import { getDishImage } from '../../utils/dishImageHelper.js';
import { WatermarkOverlay } from '../WatermarkOverlay.js';
import { SmartDishImage } from '../SmartDishImage.js';

interface CourseSelectorProps {
  selectedPackage: PackageTier;
  selectedDishes: SelectedDishMap;
  onDishSelect: (courseId: string, dishId: string) => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  selectedPackage,
  selectedDishes,
  onDishSelect,
}) => {
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [previewDish, setPreviewDish] = useState<{ name: string; image: string; tag?: string } | null>(null);

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 👑 PACKAGE TITLE & HEADER (ตามแบบฟอร์มโต๊ะจีนราคา X บาท) */}
      {/* ========================================================================= */}
      <div className="text-center py-2 space-y-2.5 border-b-2 border-amber-200 pb-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{selectedPackage.tag || 'แพ็กเกจโต๊ะจีนยอดนิยม'}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-amber-50 border-2 border-amber-300 text-slate-800 hover:text-red-700 text-xs font-black shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-red-600" />
            <span>พิมพ์รายการอาหารนี้ (PDF A4)</span>
          </button>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-tight">
          {selectedPackage.name}
        </h2>

        <div className="text-xs sm:text-sm text-slate-600 font-medium">
          <span className="font-bold text-slate-800">รายการอาหารที่เลือกได้ (จานที่ 1 - {selectedPackage.courses.length}):</span>{' '}
          <span>เลือกเมนูที่ใช่สำหรับงานของคุณ (คลิกดูภาพอาหารจริงและเปลี่ยนเมนูได้ทันที)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🍲 COURSE CARDS GRID (จัดเรียง 2 คอลัมน์ พร้อมรูปภาพอาหารจริงทุกจาน) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {selectedPackage.courses.map((course) => {
          const currentDishId = selectedDishes[course.id] || course.defaultDishId || course.options[0]?.id;
          const isSingleOption = course.options.length === 1;

          return (
            <div
              key={course.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-start space-y-3 h-full"
            >
              {/* Card Header with Large Index Badge & Clear Title */}
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b-2 border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {course.courseIndex}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      {course.title}
                    </div>
                  </div>
                </div>

                {isSingleOption ? (
                  <span className="text-[11px] sm:text-xs text-emerald-800 font-black px-2.5 py-0.5 rounded-full bg-emerald-50 border-2 border-emerald-200 shrink-0 flex items-center gap-1 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" /> รวมในเซ็ต
                  </span>
                ) : (
                  <span className="text-[11px] sm:text-xs text-amber-950 font-black px-2.5 py-0.5 rounded-full bg-amber-100/90 border-2 border-amber-300 shrink-0 shadow-2xs">
                    เลือก 1 อย่าง ({course.options.length} เมนู)
                  </span>
                )}
              </div>

              {/* Dish Options Body */}
              {isSingleOption ? (
                /* Single Included Dish with Real Photo Thumbnail */
                (() => {
                  const firstOpt = course.options[0];
                  const dishName = firstOpt.name;
                  const dishImg = firstOpt.imageUrl || getDishImage(dishName, course.title);
                  return (
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border-2 border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          onClick={() => setPreviewDish({ name: dishName, image: dishImg, tag: firstOpt.tag })}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-emerald-300 shrink-0 bg-white shadow-2xs relative group/img cursor-pointer"
                        >
                          <SmartDishImage
                            src={dishImg}
                            alt={dishName}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <ZoomIn className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                            {dishName}
                          </div>
                          {firstOpt.tag && (
                            <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                              {firstOpt.tag}
                            </div>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
                    </div>
                  );
                })()
              ) : (
                /* Multi-Option Selection List with Dish Thumbnails */
                <div className="space-y-2 pt-0.5">
                  {course.options.map((option) => {
                    const isSelected = currentDishId === option.id;
                    const dishImg = option.imageUrl || getDishImage(option.name, course.title);

                    return (
                      <div
                        key={option.id}
                        onClick={() => onDishSelect(course.id, option.id)}
                        className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-red-50/90 border-2 border-red-600 text-red-950 font-black shadow-xs scale-[1.01]'
                            : 'bg-white hover:bg-amber-50/60 border-2 border-slate-200/80 text-slate-800 hover:text-slate-950 font-bold'
                        }`}
                      >
                        {/* Radio Dot / Check Icon */}
                        <div className="shrink-0 pl-1">
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>

                        {/* Dish Photo Thumbnail */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewDish({ name: option.name, image: dishImg, tag: option.tag });
                          }}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-100 shadow-2xs relative group/thumb ${
                            isSelected ? 'border-red-500 ring-2 ring-red-200' : 'border-slate-200'
                          }`}
                        >
                          <SmartDishImage
                            src={dishImg}
                            alt={option.name}
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Dish Name & Tag */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 leading-snug min-w-0">
                          <span className={`text-xs sm:text-sm truncate ${isSelected ? 'text-red-950 font-black' : 'text-slate-900 font-bold'}`}>
                            {option.name}
                          </span>
                          {option.tag && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 self-start sm:self-auto ${
                                isSelected
                                  ? 'bg-red-200/80 text-red-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {option.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🖼️ Dish Photo High-Resolution Zoom Lightbox Modal */}
      {previewDish && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewDish(null)}
        >
          <div
            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 max-w-md w-full animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewDish(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/30 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
              <SmartDishImage
                src={previewDish.image}
                alt={previewDish.name}
                className="w-full h-full object-cover object-center scale-[1.03] select-none pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
              />
              <WatermarkOverlay size="md" opacity={0.4} />
            </div>

            <div className="p-4 bg-gradient-to-b from-white to-amber-50/30 space-y-1 text-center">
              {previewDish.tag && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-xs font-black border border-amber-300 inline-block">
                  {previewDish.tag}
                </span>
              )}
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {previewDish.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                เสิร์ฟร้อน ปรุงสดใหม่ 100% หน้างานมาตรฐานโต๊ะจีนนครปฐม 35 ปี
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Catalog & Printable A4 PDF Modal */}
      <MenuCatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        initialPackageId={selectedPackage.id}
      />

    </div>
  );
};
