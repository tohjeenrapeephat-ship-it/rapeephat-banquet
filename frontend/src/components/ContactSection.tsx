import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Crown,
  Sparkles,
  ShieldCheck,
  History,
  TrendingUp,
  FileCheck2,
  Users,
  Flame,
  Award,
  ArrowRight,
  Mail
} from 'lucide-react';
import { WatermarkOverlay } from './WatermarkOverlay';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ========================================================================= */}
        {/* 🌟 1. 35-YEAR HERITAGE & COMMERCIAL REGISTRATION TRUST BANNER */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white p-7 sm:p-10 lg:p-12 border-2 border-amber-400/90 shadow-2xl overflow-hidden">
          {/* Subtle Decorative Background Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>35+ YEARS OF CULINARY LEGACY • ตำนานความอร่อย 35 ปี</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-xs sm:text-sm font-bold">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>จดทะเบียนพาณิชย์ถูกต้องตามกฎหมาย 100%</span>
              </div>
            </div>

            {/* Main Headline (Exact User-Requested Heading) */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300 tracking-tight leading-snug">
                &ldquo;จากตำนานความอร่อยกว่า 35 ปี สู่มาตรฐานการบริการระดับพรีเมี่ยม&rdquo;
              </h2>

              {/* Exact User-Requested Paragraphs */}
              <div className="space-y-4 text-slate-200 text-sm sm:text-base lg:text-[16.5px] leading-relaxed font-normal">
                <p className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
                  ตลอดระยะเวลากว่า 35 ปีที่ผ่านมา ครัวโต๊ะจีนของเราได้รับความไว้วางใจจากเจ้าภาพรุ่นสู่รุ่นในการดูแลมื้ออาหารในวันสำคัญ และในวันนี้เพื่อเป็นการยกระดับแบรนด์ <strong className="text-amber-300 font-bold">&ldquo;โต๊ะจีนรพีพัฒน์ พรีเมี่ยม&rdquo;</strong> ให้เข้าสู่มาตรฐานสากลและเพิ่มความมั่นใจสูงสุดให้กับลูกค้าทุกท่านในการดีลงานผ่านช่องทางออนไลน์
                </p>
                <p className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
                  ทางเราได้ดำเนินการจดทะเบียนพาณิชย์และระบบบริหารจัดการงานเลี้ยงนอกสถานที่อย่างถูกต้องตามกฎหมาย เจ้าภาพทุกท่านจึงมั่นใจได้ 100% ว่าจะได้รับทั้งรสชาติต้นตำรับดั้งเดิม ควบคู่ไปกับระบบการทำงานที่เป็นมืออาชีพ โปร่งใส และปลอดภัยในทุกขั้นตอนค่ะ
                </p>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* 🔄 2. SIDE-BY-SIDE PHOTO COMPARISON: 35 YEARS AGO VS. PRESENT DAY */}
            {/* ===================================================================== */}
            <div className="pt-4">
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-amber-400">
                  <History className="w-4 h-4" />
                  <span>EVOLUTION & ELEVATION • เปรียบเทียบบรรยากาศโต๊ะจีน</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  บรรยากาศโต๊ะจีน เมื่อ 35 ปีที่ผ่านมา VS โต๊ะจีน รพีพัฒน์ ในปัจจุบัน
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* ⏳ ERA 1: เมื่อ 35 ปีที่ผ่านมา (Classic Heritage 1989) */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/15 space-y-4 hover:border-amber-400/50 transition-all flex flex-col justify-between overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm">
                          <History className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-amber-200">บรรยากาศเมื่อ 35 ปีที่ผ่านมา</h4>
                          <div className="text-xs text-slate-400 font-medium">จุดเริ่มต้นตำนานครัวโต๊ะจีนนครปฐม</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-bold text-slate-300">
                        พ.ศ. 2532
                      </span>
                    </div>

                    {/* Image 1: Master Chef Wok Hei */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/15">
                      <img
                        src="/images/heritage/nakhonpathom-master-chef-wok.jpg"
                        alt="บรรยากาศครัวโต๊ะจีนเมื่อ 35 ปีก่อน"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <WatermarkOverlay size="sm" opacity={0.4} />
                      <div className="absolute bottom-2 left-2 right-2 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs border border-amber-400/40 text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>ครัวเตาถ่านไฟแรง ผัดกระทะเหล็กสูตรโบราณ</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span><strong>บรรยากาศ:</strong> กางเต็นท์ผ้าใบลานบ้าน ลานวัด งานบุญชุมชนที่อบอุ่นเป็นกันเอง</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span><strong>ครัวปรุงสด:</strong> เตาถ่านไฟแรง ผัดกระทะเหล็กโบราณ กลิ่นหอมกระทะอันเป็นเอกลักษณ์</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span><strong>อุปกรณ์:</strong> โต๊ะไม้ปูผ้าลวดลายคลาสสิก เก้าอี้พับ จานชามกังไสดั้งเดิม</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <span><strong>การติดต่อ:</strong> บอกต่อปากต่อปาก เจ้าภาพเดินทางมานัดหมายและจดคิวลงสมุด</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 👑 ERA 2: ปัจจุบัน (Modern Premium 2024+) */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950/70 to-amber-950/40 border-2 border-amber-400 space-y-4 shadow-xl flex flex-col justify-between overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-amber-400/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-black text-sm shadow-md">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-amber-300">โต๊ะจีนรพีพัฒน์ ในปัจจุบัน</h4>
                          <div className="text-xs text-amber-200/80 font-medium">ยกระดับสู่มาตรฐานสากล พรีเมียมครบวงจร</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-[11px] font-black text-amber-300 border border-amber-400/40">
                        ยุคดิจิทัลสากล
                      </span>
                    </div>

                    {/* Image 2: Modern 750 Tables Drone Aerial */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/80">
                      <img
                        src="/images/portfolio/work-mega-750tables-drone-grand-flagship.jpg"
                        alt="ศักยภาพจัดเลี้ยง 750 โต๊ะต่อวัน โต๊ะจีนรพีพัฒน์"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <WatermarkOverlay size="sm" opacity={0.42} />
                      <div className="absolute bottom-2 left-2 right-2 px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-xs border border-amber-400/60 text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>จัดเลี้ยงสเกลใหญ่ถึง 750 โต๊ะ/วัน (ภาพโดรน 4K)</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-100">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span><strong>ศักยภาพสูงสุด:</strong> รองรับได้ถึง <strong className="text-amber-300">750 โต๊ะ/วัน</strong> ทั้งโรงแรม คอนเวนชันฮอลล์ และลานกลางแจ้ง</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span><strong>โลจิสติกส์มาตรฐาน:</strong> กองทัพรถบรรทุก 6 ล้อตู้ทึบควบคุมอุณหภูมิ ครัวเคลื่อนที่ทั่วไทย 77 จังหวัด</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span><strong>ดีไซน์หรูหรา:</strong> ผ้าคลุมผูกโบว์หลากสี (ทอง, ม่วง, ชมพู, ฟ้า, เขียว) จานชามกังไสขอบทองหรูหรา</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span><strong>ความมั่นใจ 100%:</strong> <strong className="text-amber-300">จดทะเบียนพาณิชย์ถูกต้อง</strong> มีใบเสนอราคา สัญญาจ้างชัดเจน ตรวจสอบได้</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📞 3. CONTACT INFO CHANNELS & DIRECT INQUIRY FORM */}
        {/* ========================================================================= */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>ช่องทางติดต่อสอบถาม & ปรึกษาจัดเลี้ยง</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ติดต่อทีมงาน โต๊ะจีน รพีพัฒน์ พรีเมียม
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm font-medium">
              ยินดีให้คำปรึกษา ออกแบบเมนูอาหาร และประเมินงบประมาณฟรีตลอด 24 ชั่วโมง
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Direct Contact Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Phone Card */}
              <a
                href="tel:0830872257"
                className="p-5 rounded-3xl bg-white border-2 border-amber-300 hover:border-amber-500 flex items-center gap-4 transition-all group shadow-md shadow-amber-900/5 transform hover:-translate-y-0.5"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-md border border-amber-300">
                  <Phone className="w-6 h-6 animate-bounce text-amber-300" />
                </div>
                <div>
                  <div className="text-xs text-amber-900 font-black">โทรศัพท์สายด่วน</div>
                  <div className="text-xl font-black text-slate-900 group-hover:text-red-700 transition-colors font-mono">
                    083-087-2257
                  </div>
                  <div className="text-[11.5px] text-red-700 font-black">ติดต่อคุณแป้ง (รับสายตลอดเวลา)</div>
                </div>
              </a>

              {/* LINE Official Card */}
              <a
                href="https://line.me/ti/p/~pang_baichaa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-3xl bg-white border-2 border-amber-300 hover:border-green-500 flex items-center gap-4 transition-all group shadow-md shadow-amber-900/5 transform hover:-translate-y-0.5"
              >
                <div className="w-13 h-13 rounded-2xl bg-[#06C755] text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold">LINE ติดต่อสอบถาม</div>
                  <div className="text-lg font-black text-slate-900 group-hover:text-green-600 transition-colors">
                    pang_baichaa
                  </div>
                  <div className="text-[11.5px] text-green-600 font-bold">แอดไลน์ ส่งรูปสถานที่ หรือคุยรายละเอียด</div>
                </div>
              </a>

              {/* Email Official Card */}
              <a
                href="mailto:tohjeen.rapeephat@gmail.com"
                className="p-5 rounded-3xl bg-white border-2 border-amber-300 hover:border-red-500 flex items-center gap-4 transition-all group shadow-md shadow-amber-900/5 transform hover:-translate-y-0.5"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold">อีเมลสำหรับติดต่อขอใบเสนอราคา</div>
                  <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-700 transition-colors font-mono">
                    tohjeen.rapeephat@gmail.com
                  </div>
                  <div className="text-[11.5px] text-red-700 font-bold">ส่งรายละเอียดและเอกสารจัดเลี้ยง</div>
                </div>
              </a>

              {/* Service Area Card */}
              <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 flex items-center gap-4 shadow-2xs">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-amber-900 font-black">พื้นที่ให้บริการ</div>
                  <div className="text-sm font-black text-slate-900">
                    ทั่วประเทศไทย 77 จังหวัด
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">กรุงเทพฯ ปริมณฑล ภาคกลาง อีสาน เหนือ ใต้</div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 flex items-center gap-4 shadow-2xs">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-amber-900 font-black">เวลาทำการ & การจองคิว</div>
                  <div className="text-sm font-black text-slate-900">
                    เปิดบริการทุกวัน (07:00 - 22:00 น.)
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">โทรสอบถามและจองคิวได้ตลอด 24 ชม.</div>
                </div>
              </div>

            </div>

            {/* Right Column: Direct Message Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border-2 border-amber-300 shadow-xl relative overflow-hidden">
              <div className="space-y-2 mb-6">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>ONLINE INQUIRY FORM</span>
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  ส่งข้อความสอบถามทีมงาน
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  กรอกข้อมูลเบื้องต้นเพื่อให้เจ้าหน้าที่ติดต่อกลับพร้อมข้อเสนอพิเศษ
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-black text-emerald-950">ส่งข้อความเรียบร้อยแล้ว</h4>
                  <p className="text-xs text-emerald-800">
                    ทีมงานจะติดต่อกลับไปยังหมายเลข <strong>{formData.phone}</strong> โดยเร็วที่สุดครับ
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      ชื่อเจ้าภาพ / ผู้ติดต่อ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น คุณสมชาย เจริญสุข"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 border-2 border-amber-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      เบอร์โทรศัพท์ติดต่อ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="เช่น 081-234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 border-2 border-amber-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      รายละเอียดงานจัดเลี้ยง (จำนวนโต๊ะ / สถานที่ / วันที่จัดงาน)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="เช่น จัดงานแต่งงาน 30 โต๊ะ ที่ อ.เมือง จ.นครปฐม วันที่ 25 ธ.ค."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 border-2 border-amber-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-sm shadow-red-glow border border-amber-300 transition-all flex items-center justify-center gap-2 transform hover:scale-102 active:scale-95"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>ส่งข้อมูลให้เจ้าหน้าที่ติดต่อกลับ</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
