import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2, Phone, Mail, MapPin, Scale } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border-2 border-amber-300/80 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-red-700 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                นโยบายความเป็นส่วนตัว & เงื่อนไขการบริการ
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Privacy Policy & Terms of Service • โต๊ะจีน รพีพัฒน์ พรีเมียม
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-normal">
          
          {/* Trust Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950">
              <strong>โต๊ะจีน รพีพัฒน์ พรีเมียม (RAPEEPHAT BANQUET CATERING)</strong> ให้ความสำคัญสูงสุดต่อสิทธิความเป็นส่วนตัว ความปลอดภัยของข้อมูลลูกค้า และความโปร่งใสในทุกขั้นตอนการให้บริการจัดเลี้ยงตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            </div>
          </div>

          {/* Section 1: Privacy Policy */}
          <div className="space-y-2.5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 text-red-700">
              <Lock className="w-4 h-4 text-red-600" />
              1. นโยบายคุ้มครองข้อมูลส่วนบุคคล (Privacy Policy - PDPA)
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-600">
              <li><strong>ข้อมูลที่จัดเก็บ:</strong> ชื่อ-นามสกุล, เบอร์โทรศัพท์, LINE ID, ที่อยู่อีเมล, วันที่และสถานที่จัดงาน เพื่อใช้ออกใบเสนอราคา จัดทำสัญญาจ้าง และประสานงานทีมจัดเลี้ยงหน้างานเท่านั้น</li>
              <li><strong>การรักษาความลับ:</strong> ข้อมูลของท่านจะถูกเก็บรักษาเป็นความลับสูงสุด ไม่มีการจำหน่าย หรือเปิดเผยต่อบุคคลภายนอกโดยเด็ดขาด</li>
              <li><strong>ความปลอดภัยทางธุรกรรม:</strong> ระบบจัดเก็บข้อมูลใบเสนอราคาและสัญญาจ้างถูกเข้ารหัสความปลอดภัยตามมาตรฐานสากล (SSL/HTTPS Encryption)</li>
            </ul>
          </div>

          {/* Section 2: Terms of Service */}
          <div className="space-y-2.5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 text-red-700">
              <FileText className="w-4 h-4 text-red-600" />
              2. เงื่อนไขและข้อกำหนดการให้บริการจัดเลี้ยง (Terms of Service)
            </h3>
            <div className="space-y-2 text-slate-600">
              <p>
                <strong>การจองคิวงานและชำระเงินมัดจำ:</strong> เจ้าภาพชำระเงินมัดจำ 30% ของยอดรวม เพื่อยืนยันการล็อกคิววันจัดเลี้ยงและสั่งจัดเตรียมวัตถุดิบคัดเกรดสดใหม่ ส่วนยอดคงเหลือ 70% ชำระในวันจัดงานจริงหลังเสร็จสิ้นงานเลี้ยง
              </p>
              <p>
                <strong>อุปกรณ์และทีมงานบริการ:</strong> ทุกแพ็กเกจฟรีอุปกรณ์ครบเซ็ต โต๊ะ เก้าอี้พร้อมผ้าคลุมผูกโบว์หรูหรา จานชาม ช้อนส้อม แก้วน้ำ พร้อมทีมงานบริกรบริการประจำโต๊ะตลอดงาน
              </p>
              <p>
                <strong>โปรโมชั่นพิเศษ:</strong> สั่งจองโต๊ะจีนตั้งแต่ 20 โต๊ะขึ้นไปในแพ็กเกจเดียวกัน รับโต๊ะจัดเลี้ยงแถมฟรี 1 โต๊ะทันที (สั่ง 40 โต๊ะ แถมฟรี 2 โต๊ะ) ระบบจะคำนวณส่วนลดอัตโนมัติ
              </p>
            </div>
          </div>

          {/* Section 3: Cancellation and Reschedule Policy */}
          <div className="space-y-2.5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 text-red-700">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              3. นโยบายการเลื่อนวันและยกเลิก (Rescheduling & Cancellation)
            </h3>
            <div className="space-y-2 text-slate-600">
              <p>
                <strong>การเลื่อนวันจัดงาน:</strong> กรณีเจ้าภาพต้องการเลื่อนวันจัดงาน สามารถแจ้งฝ่ายประสานงานล่วงหน้าอย่างน้อย 14 วันก่อนวันงานจริง โดยไม่คิดค่าธรรมเนียมใดๆ เพิ่มเติม
              </p>
              <p>
                <strong>กรณีเหตุสุดวิสัย:</strong> โต๊ะจีนรพีพัฒน์ยินดีประสานงานและดูแลเจ้าภาพอย่างดีที่สุดเพื่อให้งานสำคัญของท่านสำเร็จลุล่วงด้วยความประทับใจ
              </p>
            </div>
          </div>

          {/* Section 4: Food Safety & Hygiene */}
          <div className="space-y-2.5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 text-red-700">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              4. มาตรฐานสุขอนามัยและคุณภาพอาหาร (Hygiene & Quality)
            </h3>
            <p className="text-slate-600">
              วัตถุดิบคัดสรรเกรดพรีเมียมจากแหล่งต้นตำรับนครปฐม ขนส่งด้วยรถควบคุมอุณหภูมิ และปรุงสุกร้อน 100% หน้างานโดยทีมเชฟผู้มีประสบการณ์กว่า 35 ปี ภาชนะทุกชิ้นผ่านการล้างและอบฆ่าเชื้อตามมาตรฐานสุขอนามัยสากล
            </p>
          </div>

          {/* Section 5: Official Contact & Company Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
            <div className="font-bold text-slate-900">🏢 ข้อมูลผู้ประกอบการและช่องทางติดต่อทางการ:</div>
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>ที่ตั้งสำนักงานใหญ่:</strong> 50/8 ม. 4 ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี 12120</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-red-600 shrink-0" />
              <span><strong>สายด่วนรับงาน (คุณแป้ง):</strong> <a href="tel:0813311646" className="text-red-700 font-bold hover:underline font-mono">081-331-1646</a></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <span><strong>อีเมลติดต่อ:</strong> info@rapeephat-catering.com / baicha@rapeephat-catering.com</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            อัปเดตล่าสุด: {new Date().getFullYear()} • โต๊ะจีน รพีพัฒน์ พรีเมียม
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            รับทราบและปิด
          </button>
        </div>

      </div>
    </div>
  );
};
