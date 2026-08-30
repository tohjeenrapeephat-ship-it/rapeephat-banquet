import React from 'react';
import { Truck, Users, Sparkles, Armchair, ShieldCheck, CheckCircle2, Crown } from 'lucide-react';

export const CateringFeatures: React.FC = () => {
  const features = [
    {
      icon: Armchair,
      title: 'ฟรี! อุปกรณ์จัดเลี้ยงครบวงจร',
      description: 'โต๊ะกลมมาตรฐาน เก้าอี้เบาะนุ่มพร้อมผ้าคลุมผูกโบว์สีแดงหรูหรา ผ้าปูโต๊ะ 2 ชั้น ชุดจานชามเมลามีน ช้อน ส้อม แก้วน้ำ ตะเกียบ ครบทุกที่นั่ง ไม่ต้องเช่าเพิ่ม',
    },
    {
      icon: Truck,
      title: 'ครัวสัญจร ปรุงสุกสดหน้างาน 100%',
      description: 'ทีมเชฟพร้อมรถครัวเคลื่อนที่ เดินทางไปตั้งเตาปรุงสดๆ ที่สถานที่จัดงาน เพื่อให้ทุกจานส่งกลิ่นหอม ควันฉุย และคงความสดอร่อยตามมาตรฐานภัตตาคาร',
    },
    {
      icon: Users,
      title: 'ทีมบริกรมืออาชีพ ดูแลทั่วถึง',
      description: 'พนักงานเสิร์ฟแต่งกายสุภาพ เรียบร้อย ผ่านการอบรมมารยาทการบริการ คอยดูแลเติมน้ำ เก็บจาน และอำนวยความสะดวกให้แขกผู้มีเกียรติตลอดทั้งงาน',
    },
    {
      icon: Crown,
      title: 'การันตีประสบการณ์ภัตตาคาร 35+ ปี',
      description: 'ผ่านการจัดเลี้ยงงานแต่งงาน งานบวช งานขึ้นบ้านใหม่ งานทำบุญบริษัท และงานระดับจังหวัดมาแล้วกว่า 6,500 งาน มั่นใจในความตรงต่อเวลาและความสะอาด',
    },
  ];

  return (
    <section id="features" className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>บริการจัดเลี้ยงมาตรฐานภัตตาคาร</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ทำไมเจ้าภาพกว่า 6,500+ งาน
            <span className="block mt-1 text-gradient-red-gold">
              จึงไว้วางใจ โต๊ะจีน รพีพัฒน์
            </span>
          </h2>
          <p className="text-slate-700 text-sm font-medium">
            หมดกังวลเรื่องการเตรียมงาน เราดูแลให้อย่างครบถ้วนระดับมืออาชีพ เจ้าภาพสบายใจ แขกประทับใจ
          </p>
        </div>

        {/* Features 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white/95 p-7 rounded-3xl border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex items-start gap-5 group shadow-md shadow-amber-900/5"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-2 border-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-6 h-6 text-amber-300" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Equipment Feature List Banner (Imperial Red & Gold Luxury Card) */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white shadow-xl border-2 border-amber-400">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 space-y-1 text-center lg:text-left">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>ALL-INCLUSIVE PREMIUM SERVICE</span>
              </span>
              <h3 className="text-2xl font-black text-white">อุปกรณ์ที่รวมฟรีในทุกแพ็กเกจ</h3>
              <p className="text-xs text-amber-100 font-medium">ไม่มีค่าใช้จ่ายแอบแฝง พร้อมใช้งานในวันงานทันที</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-white">
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-amber-300/40 font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>โต๊ะกลมขนาด 10 ที่นั่ง</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-amber-300/40 font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>เก้าอี้เบาะ + ผ้าคลุมผูกโบว์</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-amber-300/40 font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>ผ้าปูโต๊ะ 2 ชั้นผูกมุมสวยงาม</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-amber-300/40 font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>ชุดจานชามเมลามีนเกรดเอ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-amber-300/40 font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>แก้วน้ำ เหยือกน้ำ ตะเกียบ ช้อน</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-amber-300/40 font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>ทีมงานบริกรประจำโซน</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
