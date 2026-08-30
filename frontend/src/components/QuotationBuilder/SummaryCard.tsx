import React from 'react';
import { PackageTier, BeverageSet } from '../../types/quotation.js';
import { BEVERAGE_SETS } from '../../data/beverages.js';
import { formatCurrency, thaiBahtText } from '../../utils/currency.js';
import {
  Sparkles,
  Calculator,
  Gift,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  FileText,
  Clock,
  CupSoda,
  Award,
  Utensils
} from 'lucide-react';

interface SummaryCardProps {
  selectedPackage: PackageTier;
  tableCount: number;
  selectedBeverage: BeverageSet;
  onBeverageSelect?: (beverage: BeverageSet) => void;
  floorServiceEnabled: boolean;
  onGenerateQuotation: () => void;
  isValid: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  selectedPackage,
  tableCount,
  selectedBeverage,
  onBeverageSelect,
  floorServiceEnabled,
  onGenerateQuotation,
  isValid,
}) => {
  // Calculations
  const freeTableCount = Math.floor(tableCount / 20);
  const packageTotal = selectedPackage.price * tableCount;
  const beverageTotal = (selectedBeverage?.pricePerTable || 0) * tableCount;
  const floorServiceTotal = floorServiceEnabled ? 100 * tableCount : 0;
  
  const grandTotal = packageTotal + beverageTotal + floorServiceTotal;

  const depositAmount = Math.round(grandTotal * 0.30); // 30% Deposit
  const finalAmount = grandTotal - depositAmount;       // 70% Final

  return (
    <div className="rounded-3xl bg-white border-2 border-amber-300 shadow-xl overflow-hidden font-sans space-y-5">
      
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-amber-300" />
          <h3 className="text-base sm:text-lg font-black tracking-wide">เงื่อนไขการจองและการบริการ</h3>
        </div>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
          โต๊ะจีนรพีพัฒน์ 35 ปี
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-6 text-slate-800">
        
        {/* ========================================================================= */}
        {/* 1. สิ่งที่รวมในแพ็กเกจแล้ว (Included in Package) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>สิ่งที่รวมในแพ็กเกจแล้ว</span>
          </div>
          <ul className="space-y-2 pl-6 list-disc text-sm sm:text-base text-slate-800 font-bold leading-relaxed">
            <li>โต๊ะ เก้าอี้ ผ้าปูโต๊ะ ผ้าคลุมเก้าอี้ ผูกโบว์</li>
            <li>อุปกรณ์ทานอาหารครบชุด (จาน ชาม ช้อน แก้ว ตะเกียบ)</li>
            <li>บริการพนักงานเสิร์ฟดูแลตลอดงาน</li>
            <li>ฟรีค่าเดินทาง (กทม. / นครปฐม / นนทบุรี / ปริมณฑล)</li>
          </ul>
        </div>

        {/* ========================================================================= */}
        {/* 2. แถมโปรโมชั่นสุดฮอต !!! */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-950">
            <Gift className="w-5 h-5 text-amber-600 shrink-0" />
            <span>แถมโปรโมชั่นสุดฮอต !!!</span>
          </div>
          <ul className="space-y-2 pl-6 list-disc text-sm sm:text-base text-slate-800 font-bold leading-relaxed">
            <li className="font-black text-red-700">สั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะ (ราคาเดียวกัน)</li>
            <li>ฟรี ผ้าปูโต๊ะ ผ้าคลุมเก้าอี้ ผูกโบว์ (ทุกราคา)</li>
            <li>ฟรี แก้วน้ำ ถังน้ำแข็ง (กรณีไม่รับชุดน้ำดื่ม)</li>
            <li>ต่างจังหวัด มีค่าเดินทางตามระยะทาง (ฟรีหากยอดสั่งถึงกำหนด)</li>
          </ul>
        </div>

        {/* ========================================================================= */}
        {/* 3. ชุดเครื่องดื่ม (สั่งเพิ่ม) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-900">
              <CupSoda className="w-5 h-5 text-blue-600 shrink-0" />
              <span>ชุดเครื่องดื่ม (สั่งเพิ่ม)</span>
            </div>
            <span className="text-xs text-slate-500 font-bold">*เลือกได้ตามสะดวก</span>
          </div>

          <div className="space-y-2.5">
            {BEVERAGE_SETS.map((bev) => {
              const isSelected = selectedBeverage?.id === bev.id;
              return (
                <div
                  key={bev.id}
                  onClick={() => onBeverageSelect && onBeverageSelect(bev)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 text-blue-950 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-black flex items-center gap-2">
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => onBeverageSelect && onBeverageSelect(bev)}
                        className="w-4 h-4 text-blue-600 accent-blue-600"
                      />
                      <span>{bev.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 pl-6 font-medium leading-normal">{bev.description}</p>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      {bev.pricePerTable > 0 ? `${bev.pricePerTable} THB` : 'ฟรี'}
                    </span>
                    {bev.pricePerTable > 0 && <span className="text-xs text-slate-500 block font-bold">/โต๊ะ</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-600 italic font-medium">
            *กรณีเจ้าภาพเตรียมน้ำดื่มเอง คิดค่าบริการเสิร์ฟ 50 บาท/โต๊ะ
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 4. เงื่อนไข ชิมฟรี & รายละเอียดโต๊ะ */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-3 border-t-2 border-slate-100">
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-900">
            <Utensils className="w-5 h-5 text-amber-700 shrink-0" />
            <span>เงื่อนไข ชิมฟรี & รายละเอียดโต๊ะ</span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-slate-800 font-bold text-xs sm:text-sm leading-relaxed">
            <li className="font-black text-amber-900">จอง 50 โต๊ะขึ้นไป ชิมอาหารฟรี</li>
            <li>สถานที่จัดงานชั้น 2 ขึ้นไป คิดเพิ่ม 100 บาท/โต๊ะ</li>
            <li>1 โต๊ะ นั่งได้ 10 ท่าน (แนะนำ 8 ท่านเพื่อความสะดวกสบาย)</li>
            <li>พระสงฆ์ 9 รูป ใช้ 2 โต๊ะ</li>
            <li>แถมฟรี ชุดอาหารไหว้พระ / ศาลพระภูมิ</li>
          </ul>
        </div>

        {/* ========================================================================= */}
        {/* 5. สรุปยอดเงินสุทธิ Real-Time */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-50 via-amber-50/70 to-red-50 border-2 border-red-300 space-y-2.5 shadow-2xs">
          <div className="flex justify-between items-baseline">
            <span className="text-sm sm:text-base font-bold text-slate-800">
              ค่าอาหาร ({tableCount} โต๊ะ):
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
              {formatCurrency(packageTotal)}
            </span>
          </div>

          {beverageTotal > 0 && (
            <div className="flex justify-between items-baseline text-slate-700">
              <span className="text-xs sm:text-sm font-bold">เครื่องดื่ม ({selectedBeverage.name}):</span>
              <span className="text-sm font-bold font-mono">+{formatCurrency(beverageTotal)}</span>
            </div>
          )}

          {freeTableCount > 0 && (
            <div className="flex justify-between items-baseline text-emerald-900 font-bold bg-emerald-50/90 p-3 rounded-xl border-2 border-emerald-300">
              <span className="text-xs sm:text-sm flex items-center gap-1.5 font-black">
                <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ของแถมโปร 20 แถม 1 (+{freeTableCount} โต๊ะ):</span>
              </span>
              <span className="text-sm font-black text-emerald-700 font-mono">แถมฟรี (0 บาท)</span>
            </div>
          )}

          <div className="pt-3 border-t-2 border-red-200 flex justify-between items-baseline">
            <div>
              <span className="text-sm sm:text-base font-black text-red-950 block">ยอดสุทธิรวมทั้งสิ้น:</span>
              <span className="text-xs text-slate-600 font-bold">({thaiBahtText(grandTotal)})</span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-red-600 font-mono tracking-tight">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. ปุ่มจองโต๊ะ / ออกใบเสนอราคา A4 */}
        {/* ========================================================================= */}
        <button
          type="button"
          onClick={onGenerateQuotation}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-base sm:text-lg shadow-red-glow flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer border-2 border-amber-300"
        >
          <PhoneCall className="w-5 h-5 text-amber-300" />
          <span>จองโต๊ะราคา {selectedPackage.price.toLocaleString()} บาท / ออกใบเสนอราคา</span>
        </button>

      </div>

    </div>
  );
};
