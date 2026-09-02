import React from 'react';
import { BeverageSet } from '../../types/quotation.js';
import { BEVERAGE_SETS } from '../../data/beverages.js';
import { Users, Wine, Building2, Gift, Plus, Minus, Check, Crown, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';

interface TableCalculatorProps {
  tableCount: number;
  onTableCountChange: (count: number) => void;
  selectedBeverage: BeverageSet;
  onBeverageSelect: (bev: BeverageSet) => void;
  floorServiceEnabled: boolean;
  onFloorServiceChange: (enabled: boolean) => void;
  packagePrice: number;
}

export const TableCalculator: React.FC<TableCalculatorProps> = ({
  tableCount,
  onTableCountChange,
  selectedBeverage,
  onBeverageSelect,
  floorServiceEnabled,
  onFloorServiceChange,
  packagePrice,
}) => {
  const freeTableCount = Math.floor(tableCount / 20);
  const tablesUntilNextFree = 20 - (tableCount % 20);

  const increment = () => onTableCountChange(tableCount + 1);
  const decrement = () => onTableCountChange(Math.max(10, tableCount - 1));

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. TABLE COUNT SELECTOR & PROMOTION BANNER */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-amber-300 shadow-xl shadow-amber-900/5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs shrink-0">
              <Users className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                จำนวนโต๊ะจัดเลี้ยง (ขั้นต่ำ 10 โต๊ะ)
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-bold">
                โต๊ะละ 10 ท่าน (รวมประมาณ {tableCount * 10} ท่าน)
              </p>
            </div>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-amber-100/90 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-black self-start sm:self-auto shadow-2xs">
            1 โต๊ะ = 10 ที่นั่ง
          </div>
        </div>

        <div className="grid sm:grid-cols-12 gap-5 items-center">
          {/* Stepper Input */}
          <div className="sm:col-span-6 space-y-2">
            <label className="text-sm sm:text-base font-black text-slate-900">
              ระบุจำนวนโต๊ะที่ต้องการ (เริ่มต้น 10 โต๊ะ):
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={decrement}
                disabled={tableCount <= 10}
                className="w-14 h-14 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-slate-900 flex items-center justify-center font-black text-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="ลดจำนวนโต๊ะ"
              >
                <Minus className="w-6 h-6 text-red-700 stroke-[3]" />
              </button>

              <div className="relative flex-1">
                <input
                  type="number"
                  min="10"
                  max="750"
                  value={tableCount}
                  onChange={(e) => onTableCountChange(Math.max(10, parseInt(e.target.value, 10) || 10))}
                  className="w-full h-14 bg-white border-2 border-amber-300 rounded-2xl text-center text-3xl font-black text-slate-900 focus:outline-hidden focus:border-red-500 shadow-inner font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm sm:text-base text-amber-950 font-black">
                  โต๊ะ
                </span>
              </div>

              <button
                type="button"
                onClick={increment}
                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-700 text-white flex items-center justify-center font-black text-2xl shadow-red-glow transition-all active:scale-95 border-2 border-amber-300 cursor-pointer"
                title="เพิ่มจำนวนโต๊ะ"
              >
                <Plus className="w-6 h-6 text-amber-300 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Promotion Notification Banner */}
          <div className="sm:col-span-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-50 via-amber-50/70 to-red-50 border-2 border-amber-300 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-red-700 font-black text-sm sm:text-base">
              <Gift className="w-5 h-5 text-amber-600 animate-bounce shrink-0" />
              <span>โปรโมชันฉลอง 35 ปี: สั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะ!</span>
            </div>

            {freeTableCount > 0 ? (
              <div className="space-y-1 text-sm text-slate-800">
                <div className="text-sm sm:text-base font-black text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>ได้รับโต๊ะแถมฟรี {freeTableCount} โต๊ะ! (ประหยัด {(freeTableCount * packagePrice).toLocaleString()} บาท)</span>
                </div>
                <div className="text-xs sm:text-sm text-emerald-900 font-bold flex items-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>ฟรีค่าเดินทางขนส่งในกทม./ปริมณฑล 100%!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-xs sm:text-sm text-slate-800 font-bold">
                <div>
                  สั่งเพิ่มอีก <strong className="text-red-700 font-black">{tablesUntilNextFree} โต๊ะ</strong> จะได้รับโต๊ะแถมฟรี 1 โต๊ะ + ฟรีค่าเดินทางทันที!
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>สั่งไม่ถึง 20 โต๊ะ มีค่าเดินทาง 1,500.- (กทม./ปริมณฑล)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 🍷 BEVERAGE PACKAGE SELECTION (แนวนอน กว้างขวาง อ่านง่าย ไม่ตัดคำ) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-amber-300 shadow-xl shadow-amber-900/5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs shrink-0">
              <Wine className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                ชุดเครื่องดื่มประจำโต๊ะ (ตัวเลือกเสริม)
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-bold">
                คำนวณต่อโต๊ะตลอดงาน เสิร์ฟพร้อมน้ำแข็งและบริกรดูแล
              </p>
            </div>
          </div>

          <span className="text-xs sm:text-sm font-black px-4 py-1 rounded-full bg-amber-100/90 border-2 border-amber-300 text-amber-950 self-start sm:self-auto shadow-2xs">
            4 ตัวเลือกเครื่องดื่ม
          </span>
        </div>

        {/* Horizontal Card Layout */}
        <div className="grid sm:grid-cols-2 gap-4">
          {BEVERAGE_SETS.map((bev) => {
            const isSelected = selectedBeverage.id === bev.id;

            return (
              <div
                key={bev.id}
                onClick={() => onBeverageSelect(bev)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-br from-red-50 via-amber-50/70 to-red-50 border-2 border-red-500 shadow-md ring-2 ring-amber-300/50'
                    : 'bg-white border-2 border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/40 shadow-xs'
                }`}
              >
                {/* Header: Name + Price + Radio Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-base sm:text-lg font-black leading-snug ${
                        isSelected ? 'text-red-950' : 'text-slate-900'
                      }`}>
                        {bev.name}
                      </h4>
                    </div>

                    <div className="text-lg sm:text-xl font-black text-red-700 font-mono">
                      {bev.pricePerTable === 0 ? 'ฟรี (เตรียมเครื่องดื่มเอง)' : `+${bev.pricePerTable.toLocaleString()} บาท / โต๊ะ`}
                    </div>
                  </div>

                  {/* Radio Selection Pill */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-red-600 text-white shadow-xs' : 'border-2 border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                  {bev.description}
                </p>

                {/* Item Badges List */}
                <div className="pt-2.5 border-t border-amber-100 flex flex-wrap gap-2">
                  {bev.items.map((it, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-black text-slate-800 shadow-2xs"
                    >
                      ✓ {it}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ADDITIONAL SURCHARGE OPTIONS (Floor Service) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl shadow-amber-900/5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b-2 border-amber-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              เงื่อนไขสถานที่ & บริการพิเศษ
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              กรณีสถานที่จัดงานมีเงื่อนไขการขนย้ายเพิ่มเติม
            </p>
          </div>
        </div>

        <label className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/40 border-2 border-amber-200 hover:border-amber-400 cursor-pointer transition-all shadow-2xs">
          <input
            type="checkbox"
            checked={floorServiceEnabled}
            onChange={(e) => onFloorServiceChange(e.target.checked)}
            className="mt-1 w-5 h-5 text-red-600 bg-white border-2 border-amber-300 rounded-md focus:ring-red-500 cursor-pointer accent-red-600"
          />
          <div className="space-y-1">
            <div className="text-sm font-black text-slate-900 flex flex-wrap items-center gap-2">
              <span>จัดเลี้ยงบนอาคารชั้น 2 ขึ้นไป (สถานที่ไม่มีลิฟต์ขนของ)</span>
              <span className="text-xs font-black text-white bg-red-600 px-2.5 py-0.5 rounded-full shadow-xs">
                +100 บาท / โต๊ะ
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              สำหรับเป็นค่าแรงพิเศษทีมงานขนย้ายโต๊ะ เก้าอี้ จานชาม และอุปกรณ์ครัวสัญจรขึ้นบันได
            </p>
          </div>
        </label>
      </div>

    </div>
  );
};
