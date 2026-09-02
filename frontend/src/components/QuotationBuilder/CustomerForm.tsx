import React from 'react';
import { CustomerInfo } from '../../types/quotation.js';
import { User, Phone, Mail, Calendar, Clock, MapPin, Sparkles, FileText, Truck, Building2, Navigation, CheckCircle2 } from 'lucide-react';

interface CustomerFormProps {
  formData: CustomerInfo;
  onChange: (data: Partial<CustomerInfo>) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ formData, onChange }) => {
  const currentZone = formData.locationZone || 'bkk_metro';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
        <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 text-red-700 flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          ข้อมูลผู้ติดต่อ & รายละเอียดสถานที่จัดงาน
        </h3>
      </div>

      {/* Strict Bottom-Aligned Form Grid with Equalized Senior-Friendly Inputs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Customer Name */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex flex-wrap items-center gap-1.5 leading-tight">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-red-600 shrink-0" />
              <span>ชื่อเจ้าภาพ / ผู้ติดต่อ</span>
              <span className="text-red-600 font-black">*</span>
            </div>
            <span className="text-xs sm:text-[12.5px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 shadow-2xs">
              (ชื่อในการออกใบเสร็จ/สัญญาจ้างงาน)
            </span>
          </label>
          <input
            type="text"
            required
            placeholder="เช่น คุณสมชาย ใจดี หรือ บริษัท เอ บี ซี จำกัด"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 font-bold shadow-2xs transition-all"
          />
        </div>

        {/* Customer Phone */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-600 shrink-0" />
            <span>เบอร์โทรศัพท์ติดต่อ <span className="text-red-600">*</span></span>
          </label>
          <input
            type="tel"
            required
            placeholder="เช่น 081-234-5678"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 font-bold shadow-2xs transition-all"
          />
        </div>

        {/* Customer Email */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-600 shrink-0" />
            <span>อีเมล (สำหรับรับเอกสาร / ถ้ามี)</span>
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={formData.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 font-bold shadow-2xs transition-all"
          />
        </div>

        {/* Event Date */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600 shrink-0" />
            <span>วันที่จัดงาน <span className="text-red-600">*</span></span>
          </label>
          <input
            type="date"
            required
            value={formData.eventDate}
            onChange={(e) => onChange({ eventDate: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 font-bold shadow-2xs transition-all cursor-pointer"
          />
        </div>

        {/* Event Time */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600 shrink-0" />
            <span>เวลาเสิร์ฟอาหาร (บริการ 4 ชม.)</span>
          </label>
          <select
            value={formData.eventTime}
            onChange={(e) => onChange({ eventTime: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-sm sm:text-base text-slate-900 font-bold shadow-2xs transition-all cursor-pointer"
          >
            <option value="ช่วงเช้า (07:00 - 11:00 น. รวม 4 ชม.)">ช่วงเช้า (07:00 - 11:00 น.) - เลี้ยงพระ/พิธีเช้า (4 ชม.)</option>
            <option value="ช่วงเพล (11:00 - 15:00 น. รวม 4 ชม.)">ช่วงเพล (11:00 - 15:00 น.) - เลี้ยงเพล/กลางวัน (4 ชม.)</option>
            <option value="ช่วงบ่าย (14:00 - 18:00 น. รวม 4 ชม.)">ช่วงบ่าย (14:00 - 18:00 น.) - งานบ่าย (4 ชม.)</option>
            <option value="ช่วงเย็น (17:00 - 21:00 น. รวม 4 ชม.)">ช่วงเย็น (17:00 - 21:00 น.) - งานแต่ง/สังสรรค์ค่ำ (4 ชม.)</option>
            <option value="ช่วงค่ำ (18:00 - 22:00 น. รวม 4 ชม.)">ช่วงค่ำ (18:00 - 22:00 น.) - งานสังสรรค์ค่ำ (4 ชม.)</option>
          </select>
        </div>

        {/* Event Type */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <span>ประเภทงานจัดเลี้ยง</span>
          </label>
          <select
            value={formData.eventType}
            onChange={(e) => onChange({ eventType: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 font-bold shadow-2xs transition-all cursor-pointer"
          >
            <option value="งานมงคลสมรส (งานแต่งงาน)">งานมงคลสมรส (งานแต่งงาน)</option>
            <option value="งานอุปสมบท (งานบวช)">งานอุปสมบท (งานบวช)</option>
            <option value="งานทำบุญขึ้นบ้านใหม่">งานทำบุญขึ้นบ้านใหม่</option>
            <option value="งานเลี้ยงสังสรรค์องค์กร / เลี้ยงปีใหม่">งานเลี้ยงสังสรรค์องค์กร / เลี้ยงปีใหม่</option>
            <option value="งานวันเกิด / เลี้ยงฉลองครบรอบ">งานวันเกิด / เลี้ยงฉลองครบรอบ</option>
            <option value="งานฌาปนกิจ / พระราชทานเพลิง">งานฌาปนกิจ / พระราชทานเพลิง</option>
            <option value="งานจัดเลี้ยงทั่วไป">งานจัดเลี้ยงทั่วไป</option>
          </select>
        </div>

      </div>

      {/* Modern Transportation & Region Zone Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-amber-50/70 border-2 border-amber-300 space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="text-sm sm:text-base font-black text-slate-950">
              พื้นที่จัดงาน & นโยบายค่าเดินทางขนส่ง
            </span>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-300">
            ระบบคำนวณอัตโนมัติ
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3.5">
          {/* Option 1: BKK & Greater Bangkok */}
          <div
            onClick={() => onChange({ locationZone: 'bkk_metro' })}
            className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
              currentZone === 'bkk_metro'
                ? 'bg-amber-100/90 border-amber-500 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <input
              type="radio"
              checked={currentZone === 'bkk_metro'}
              onChange={() => onChange({ locationZone: 'bkk_metro' })}
              className="mt-1 w-4 h-4 text-amber-600 accent-amber-600"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-800" />
                <strong className="text-sm sm:text-base text-slate-950 font-black">
                  กรุงเทพฯ และ ปริมณฑล
                </strong>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                ครอบคลุม กทม., นครปฐม, นนทบุรี, ปทุมธานี, สมุทรปราการ, สมุทรสาคร
              </p>
              <div className="pt-1 text-xs font-bold text-amber-950">
                • สั่งไม่ถึง 20 โต๊ะ: <span className="text-red-700 font-black">ค่าเดินทาง 1,500.-</span><br />
                • สั่ง 20 โต๊ะขึ้นไป: <span className="text-emerald-700 font-black">ฟรีค่าเดินทาง 100%!</span>
              </div>
            </div>
          </div>

          {/* Option 2: Upcountry */}
          <div
            onClick={() => onChange({ locationZone: 'upcountry' })}
            className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2.5 ${
              currentZone === 'upcountry'
                ? 'bg-amber-100/90 border-amber-500 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                checked={currentZone === 'upcountry'}
                onChange={() => onChange({ locationZone: 'upcountry' })}
                className="mt-1 w-4 h-4 text-amber-600 accent-amber-600"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-amber-800" />
                  <strong className="text-sm sm:text-base text-slate-950 font-black">
                    ต่างจังหวัด (นอกเขตปริมณฑล)
                  </strong>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  จัดเลี้ยงทั่วประเทศ คำนวณตามระยะทางจริง (ตกลงประสานงานคุณแป้ง 081-331-1646)
                </p>
              </div>
            </div>

            {/* Direct Custom Travel Fee Input Box for Customer */}
            {currentZone === 'upcountry' && (
              <div className="pt-2 border-t border-amber-300/80 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                <label className="text-xs font-black text-slate-900 flex items-center justify-between">
                  <span>ระบุค่าเดินทางต่างจังหวัดตามที่ตกลง (บาท):</span>
                  <span className="text-[11px] text-red-700 font-bold">*คำนวณในใบเสนอราคาทันที</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="เช่น 2,000 หรือใส่ 0 หากตามตกลง"
                    value={formData.customTravelFee !== undefined ? formData.customTravelFee : ''}
                    onChange={(e) => onChange({ customTravelFee: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="w-full h-11 bg-white border-2 border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl px-3.5 pr-12 text-sm sm:text-base font-mono font-bold text-slate-950 shadow-inner"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600">
                    บาท
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location & Special Notes (Full Width Grid with strict equalized heights) */}
      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Event Location */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
            <span>สถานที่จัดงาน (จังหวัด / อำเภอ / ชื่อวัดหรือโรงแรม) <span className="text-red-600">*</span></span>
          </label>
          <input
            type="text"
            required
            placeholder="เช่น หอประชุมเทศบาลเมืองนครปฐม หรือ บ้านเลขที่ 88/9 อ.เมือง จ.นครปฐม"
            value={formData.eventLocation}
            onChange={(e) => onChange({ eventLocation: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 font-bold shadow-2xs transition-all"
          />
        </div>

        {/* Special Notes */}
        <div className="flex flex-col justify-end h-full space-y-2">
          <label className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-600 shrink-0" />
            <span>หมายเหตุเพิ่มเติม / ข้อกำหนดพิเศษ (ถ้ามี)</span>
          </label>
          <input
            type="text"
            placeholder="เช่น ต้องการผูกโบว์เก้าอี้สีแดง, สถานที่เข้าซอยแคบ"
            value={formData.notes || ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="w-full h-13 bg-white border-2 border-slate-300 hover:border-amber-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-2xl px-4 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 font-bold shadow-2xs transition-all"
          />
        </div>

      </div>
    </div>
  );
};
