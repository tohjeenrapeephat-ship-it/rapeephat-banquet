import React from 'react';
import { PackageTier, SelectedDishMap } from '../../types/quotation.js';
import { Utensils, CheckCircle2, Circle, Sparkles, Crown, Check, ChefHat } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 👑 PACKAGE TITLE & HEADER (ตามแบบฟอร์มโต๊ะจีนราคา X บาท) */}
      {/* ========================================================================= */}
      <div className="text-center py-2 space-y-2 border-b-2 border-amber-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{selectedPackage.tag || 'แพ็กเกจโต๊ะจีนยอดนิยม'}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-tight">
          {selectedPackage.name}
        </h2>

        <div className="text-xs sm:text-sm text-slate-600 font-medium">
          <span className="font-bold text-slate-800">รายการอาหารที่เลือกได้ (จานที่ 1 - {selectedPackage.courses.length}):</span>{' '}
          <span>เลือกเมนูที่ใช่สำหรับงานของคุณ (คลิกเพื่อสลับเปลี่ยนเมนูได้ทันที)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🍲 COURSE CARDS GRID (จัดเรียง 2 คอลัมน์ ตัวอักษรใหญ่ คมชัด สบายตาสำหรับทุกวัย) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {selectedPackage.courses.map((course) => {
          const currentDishId = selectedDishes[course.id] || course.defaultDishId || course.options[0]?.id;
          const isSingleOption = course.options.length === 1;

          return (
            <div
              key={course.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-start space-y-3.5 h-full"
            >
              {/* Card Header with Large Index Badge & Clear Title */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-2xs">
                    {course.courseIndex}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {course.title}
                    </div>
                  </div>
                </div>

                {isSingleOption ? (
                  <span className="text-xs sm:text-sm text-emerald-800 font-black px-3 py-1 rounded-full bg-emerald-50 border-2 border-emerald-200 shrink-0 flex items-center gap-1.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> รวมในเซ็ต
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-amber-950 font-black px-3 py-1 rounded-full bg-amber-100/90 border-2 border-amber-300 shrink-0 shadow-2xs">
                    เลือก 1 อย่าง ({course.options.length} เมนู)
                  </span>
                )}
              </div>

              {/* Dish Options Body */}
              {isSingleOption ? (
                /* Single Included Dish */
                <div className="py-3.5 px-4 rounded-2xl bg-slate-50 border-2 border-slate-200/90 text-sm sm:text-base font-black text-slate-900 flex items-center justify-between shadow-2xs">
                  <span>{course.options[0].name}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              ) : (
                /* Multi-Option Selection List */
                <div className="space-y-2 pt-1">
                  {course.options.map((option) => {
                    const isSelected = currentDishId === option.id;

                    return (
                      <div
                        key={option.id}
                        onClick={() => onDishSelect(course.id, option.id)}
                        className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-red-50/90 border-2 border-red-600 text-red-950 font-black shadow-xs scale-[1.01]'
                            : 'bg-white hover:bg-amber-50/60 border-2 border-slate-200/80 text-slate-800 hover:text-slate-950 font-bold'
                        }`}
                      >
                        {/* Radio Dot / Check Icon */}
                        <div className="shrink-0">
                          {isSelected ? (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>

                        {/* Dish Name & Tag */}
                        <div className="flex-1 flex items-center justify-between gap-2 leading-snug">
                          <span className={`text-sm sm:text-base ${isSelected ? 'text-red-950 font-black' : 'text-slate-900 font-bold'}`}>
                            {option.name}
                          </span>
                          {option.tag && (
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 shrink-0 border border-amber-300">
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

    </div>
  );
};
