import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Crown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'สั่งจัดเลี้ยงโต๊ะจีนขั้นต่ำกี่โต๊ะ และครอบคลุมพื้นที่ใดบ้าง?',
      a: 'โต๊ะจีน รพีพัฒน์ พรีเมียม รับจัดเลี้ยงเริ่มต้นตั้งแต่ 10 โต๊ะขึ้นไป ให้บริการจัดส่งและจัดเลี้ยงทั่วประเทศไทย ทั้งกรุงเทพฯ ปริมณฑล ภาคกลาง ภาคตะวันออก ภาคอีสาน ภาคเหนือ และภาคใต้ โดยมีทีมรถครัวสัญจรพร้อมเดินทางไปบริการถึงหน้างานครับ',
    },
    {
      q: 'โปรโมชันสั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะ มีเงื่อนไขอย่างไร?',
      a: 'โปรโมชันฉลอง 35 ปี เมื่อสั่งจองโต๊ะจีนตั้งแต่ 20 โต๊ะขึ้นไปในแพ็กเกจเดียวกัน ท่านจะได้รับโต๊ะแถมฟรีทันที 1 โต๊ะ (สั่ง 40 โต๊ะ แถมฟรี 2 โต๊ะ, 60 โต๊ะ แถมฟรี 3 โต๊ะ) โดยระบบ Smart Quotation Builder จะคำนวณส่วนลดโต๊ะแถมฟรีให้โดยอัตโนมัติครับ',
    },
    {
      q: 'สามารถสลับเปลี่ยนรายการอาหารในแต่ละจานได้หรือไม่?',
      a: 'สามารถสลับเปลี่ยนรายการอาหารในแต่ละหมวดหมู่ได้ฟรีตามรายการที่ระบุในระบบ Smart Quotation Builder หากต้องการเมนูพิเศษนอกเหนือจากรายการ สามารถแจ้งทีมงานเพื่อประเมินและจัดหาวัตถุดิบพิเศษให้ได้ครับ',
    },
    {
      q: 'เงื่อนไขการชำระเงินและเงินมัดจำอย่างไร?',
      a: 'ชำระเงินมัดจำ 30% ของยอดรวม เพื่อยืนยันล็อกคิววันจัดเลี้ยงและจัดเตรียมวัตถุดิบสด ส่วนยอดคงเหลือ 70% ชำระในวันจัดงานจริงหลังเสร็จสิ้นงานเลี้ยง โดยสามารถโอนผ่านบัญชีธนาคารไทยพาณิชย์ หรือสแกน Thai QR Payment ได้อย่างสะดวกครับ',
    },
    {
      q: 'ในแพ็กเกจรวมอุปกรณ์และบริกรแล้วหรือยัง มีค่าใช้จ่ายแอบแฝงไหม?',
      a: 'ทุกแพ็กเกจรวมอุปกรณ์ครบวงจรฟรี 100% ได้แก่ โต๊ะกลมมาตรฐาน 10 ที่นั่ง, เก้าอี้เบาะนุ่มพร้อมผ้าคลุมผูกโบว์หรูหรา, ผ้าปูโต๊ะ 2 ชั้น, ชุดจานชามเมลามีน, ช้อน ส้อม แก้วน้ำ ตะเกียบ และทีมงานบริกรประจำโต๊ะ ไม่มีค่าเช่าอุปกรณ์เพิ่มเติม ยกเว้นกรณีสถานที่จัดเลี้ยงบนอาคารชั้น 2 ขึ้นไปที่ไม่มีลิฟต์ จะมีค่าบริการยกของขึ้นบันได +100 บาท/โต๊ะ เท่านั้นครับ',
    },
  ];

  return (
    <section className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>คำถามที่พบบ่อย (FAQ)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ข้อสงสัยเกี่ยวกับการจัดเลี้ยง
            <span className="block mt-1 text-gradient-red-gold">
              โต๊ะจีน รพีพัฒน์ พรีเมียม
            </span>
          </h2>
          <p className="text-slate-700 text-sm font-medium">
            คำตอบสำหรับข้อซักถามยอดนิยม เพื่อให้ท่านวางแผนจัดงานได้อย่างราบรื่นที่สุด
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-2 border-amber-400 shadow-md shadow-amber-900/5'
                    : 'bg-white border-2 border-amber-200/80 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm sm:text-base text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0 border border-amber-300">
                      Q
                    </span>
                    <span className={isOpen ? 'text-red-700 font-black' : 'text-slate-900'}>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium border-t border-amber-100 bg-gradient-to-b from-amber-50/30 to-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
