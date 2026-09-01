import React, { useState } from 'react';
import { WatermarkOverlay } from './WatermarkOverlay';
import {
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Maximize2,
  X,
  Award,
  ChevronRight,
  Sun,
  Building2,
  Fuel,
  Flame,
  Check
} from 'lucide-react';

interface FleetShowcaseItem {
  id: string;
  code: string;
  name: string;
  subTitle: string;
  type: string;
  capacity: string;
  idealFor: string;
  licensePlate: string;
  image: string;
  tag: string;
  description: string;
  highlights: string[];
}

const FLEET_LINEUP_VIEWS = [
  {
    id: 'terminal',
    label: '🏛️ หน้าศูนย์กระจายสินค้า & ครัวกลาง',
    title: 'ขบวนรถจัดเลี้ยง "โต๊ะจีนรพีพัฒน์" 3 คันใหญ่ ประจำการพร้อมเดินทาง',
    subtitle: 'ภาพรวมกองทัพรถบรรทุก 6 ล้อใหญ่สีเขียวเพ้นท์ลายวิจิตร ณ ศูนย์กระจายสินค้าและครัวกลาง พร้อมออกเดินทางบริการทั่วราชอาณาจักร',
    image: '/images/fleet/fleet-rapeephat-lineup-terminal.jpg',
    tag: 'ขบวนรถประจำการ 77 จังหวัด 🚚',
  },
  {
    id: 'sky',
    label: '🌤️ ลานเตรียมพร้อมกลางแจ้ง',
    title: 'กองทัพรถ "โต๊ะจีนรพีพัฒน์" จอดเทียบขบวนลานกลางแจ้ง',
    subtitle: 'ทัศนียภาพความสง่างามโอ่อ่าของรถบรรทุก 6 ล้อสีเขียวเอกลักษณ์รพีพัฒน์ ส่องประกายความพร้อมบริการงานจัดเลี้ยงสเกล 50-500 โต๊ะ',
    image: '/images/fleet/fleet-rapeephat-lineup-sky.jpg',
    tag: 'ความพร้อมระดับ 100% 🌟',
  },
];

const FLEET_TRUCKS: FleetShowcaseItem[] = [
  {
    id: 'flagship-center',
    code: 'RAPEEPHAT-TRUCK-01',
    name: 'รถบรรทุก 6 ล้อใหญ่ "โต๊ะจีนรพีพัฒน์" เรือธงคันกลาง',
    subTitle: 'หน้ารถเพ้นท์ลายแอร์บรัชวิจิตร • ทะเบียน 88-5724 นครปฐม',
    type: 'รถบรรทุก 6 ล้อใหญ่ Hino 500 Heavy Duty',
    capacity: 'รองรับ 100 - 300 โต๊ะจีน (1,000 - 3,000 แขก)',
    idealFor: 'งานมหกรรมระดับจังหวัด, คอนเสิร์ต, งานประจำปี & งานแต่งงานสเกลใหญ่',
    licensePlate: 'ทะเบียน 88-5724 นครปฐม (โต๊ะจีนรพีพัฒน์ 01)',
    image: '/images/fleet/fleet-truck-center-flagship.jpg',
    tag: 'คันเรือธงหลัก (Flagship) 👑',
    description: 'รถบรรทุก 6 ล้อใหญ่คันเรือธงหลัก หน้ารถประดับชื่อ "โต๊ะจีนรพีพัฒน์" พร้อมงานเพ้นท์แอร์บรัชลายไทยสีเขียวทองสุดวิจิตร ติดตั้งโครงสร้างเตาแก๊สแรงดันสูง 8-12 หัวเตา และอุปกรณ์โต๊ะจีนครบวงจร',
    highlights: [
      'หน้ารถโดดเด่นด้วยชื่อ "โต๊ะจีนรพีพัฒน์"',
      'เตาแก๊สแรงดันสูงสำหรับครัวสัญจร 8-12 หัวเตา',
      'บรรทุกโต๊ะจีนกลมและเก้าอี้กว่า 1,000+ ที่นั่ง',
      'ระบบไฟส่องสว่างครัวสนามและถังแก๊สมาตรฐาน มอก.',
    ],
  },
  {
    id: 'hino-left',
    code: 'RAPEEPHAT-TRUCK-02',
    name: 'รถบรรทุก 6 ล้อ "โต๊ะจีนรพีพัฒน์" หน่วยเคลื่อนที่เร็วฝั่งซ้าย',
    subTitle: 'หน้ารถเขียวทองทรงพลัง • ทะเบียน 83-9630 นครปฐม',
    type: 'รถบรรทุก 6 ล้อ Hino 500 Rapid Deployment',
    capacity: 'รองรับ 50 - 200 โต๊ะจีน (500 - 2,000 แขก)',
    idealFor: 'งานเลี้ยงในอาคาร, เต็นท์โดม, งานขึ้นบ้านใหม่ & งานบุญพิธี',
    licensePlate: 'ทะเบียน 83-9630 นครปฐม (โต๊ะจีนรพีพัฒน์ 02)',
    image: '/images/fleet/fleet-truck-left-hino.jpg',
    tag: 'หน่วยเคลื่อนที่เร็ว ⚡',
    description: 'รถบรรทุก 6 ล้อสีเขียวมรกต หน้ารถประดับ "โต๊ะจีนรพีพัฒน์" ขนส่งชุดผ้าปูโต๊ะ 5 โทนสีมงคล โบว์เก้าอี้ซาติน ถ้วยชามเซรามิก VIP และเตาย่างเป็ดพะโล้สด',
    highlights: [
      'หน้ารถประดับเอกลักษณ์ "โต๊ะจีนรพีพัฒน์"',
      'ผ้าปูโต๊ะลูกไม้และซาตินครบ 5 โทนสีมงคล',
      'ชุดถ้วยชามเซรามิกและแก้วน้ำสากล 100% สะอาดเอี่ยม',
      'ทีมบริกรและผู้ช่วยเชฟประจำรถ 8-12 ชีวิต',
    ],
  },
  {
    id: 'isuzu-right',
    code: 'RAPEEPHAT-TRUCK-03',
    name: 'รถบรรทุก 6 ล้อ "โต๊ะจีนรพีพัฒน์" หน่วยซัพพอร์ตฝั่งขวา',
    subTitle: 'หน้ารถสปอร์ตกรีนลายมังกร • ทะเบียน 89-6408 นครปฐม',
    type: 'รถบรรทุก 6 ล้อ Isuzu Forward Support',
    capacity: 'รองรับ 50 - 200 โต๊ะจีน (500 - 2,000 แขก)',
    idealFor: 'งานเลี้ยงกลางแจ้ง, สวนสวย, มหกรรมอาหาร & งานบวช/งานแต่ง',
    licensePlate: 'ทะเบียน 89-6408 นครปฐม (โต๊ะจีนรพีพัฒน์ 03)',
    image: '/images/fleet/fleet-truck-right-isuzu.jpg',
    tag: 'หน่วยสนับสนุนวัตถุดิบสด ❄️',
    description: 'รถบรรทุก 6 ล้อโครงสร้างเหล็กกล้าสีเขียว หน้ารถประดับ "โต๊ะจีนรพีพัฒน์" พร้อมผ้าใบคลุมกันน้ำ 100% ขนส่งวัตถุดิบสด กุ้ง ปลา ปู ผักสด และเครื่องปรุงรสภัตตาคาร',
    highlights: [
      'หน้ารถโดดเด่นด้วยตรา "โต๊ะจีนรพีพัฒน์"',
      'ตู้เก็บวัตถุดิบสดควบคุมความเย็น Food Grade',
      'ผ้าใบคลุมกันฝน 3 ชั้น ป้องกันแดดและฝุ่น 100%',
      'ระบบ GPS ติดตามพิกัดรายงานสถานะเรียลไทม์',
    ],
  },
];

// Reusable Watermark Badge for Fleet Photos
const FleetWatermarkBadge: React.FC<{ isLarge?: boolean }> = ({ isLarge = false }) => {
  return (
    <div className={`absolute bottom-3.5 right-3.5 z-10 pointer-events-none flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border-2 border-amber-400/90 shadow-2xl ${
      isLarge ? 'scale-105 sm:scale-115 origin-bottom-right' : 'scale-90 sm:scale-100 origin-bottom-right'
    }`}>
      <div className="w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs border border-amber-300">
        <img
          src="/images/brand/logo.png"
          alt="โลโก้ โต๊ะจีนรพีพัฒน์"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-left leading-none">
        <div className="text-[11px] font-black text-amber-300 tracking-wide uppercase">
          โต๊ะจีนรพีพัฒน์
        </div>
        <div className="text-[8.5px] font-bold text-slate-200 mt-0.5">
          © รถบริการจัดเลี้ยงทั่วไทย • โทร 081-331-1646
        </div>
      </div>
    </div>
  );
};

export const FleetLogistics: React.FC = () => {
  const [selectedLineupView, setSelectedLineupView] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<{ image: string; title: string; desc: string; tag: string } | null>(null);

  const activeLineup = FLEET_LINEUP_VIEWS[selectedLineupView];

  return (
    <section id="fleet-logistics" className="py-20 relative border-t-2 border-amber-300/60 bg-gradient-to-b from-white via-emerald-50/15 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* Modern Section Header */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>NATIONWIDE CATERING FLEET • รถบริการทั่วไทย</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            กองทัพรถบริการจัดเลี้ยง
            <span className="block mt-1 text-gradient-red-gold">
              "โต๊ะจีนรพีพัฒน์" พร้อมบริการ 77 จังหวัดทั่วไทย
            </span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            มาตรฐานกองทัพรถบรรทุก 6 ล้อใหญ่สีเขียวเอกลักษณ์ หน้ารถประดับ <strong>"โต๊ะจีนรพีพัฒน์"</strong> พร้อมเตาแก๊สแรงดันสูง ครัวสัญจรปรุงสดหน้างาน และอุปกรณ์จัดเลี้ยงครบวงจร
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. HERO PANORAMIC LINEUP SHOWCASE (ขบวนรถ 3 คันใหญ่ จอดเทียบหน้ากระดาน) */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl bg-slate-950 border-3 border-amber-300 shadow-2xl overflow-hidden">
          
          {/* Top Switcher Bar */}
          <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-amber-300/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-black tracking-wide">
                ขบวนรถจริง "โต๊ะจีนรพีพัฒน์" (3 คันใหญ่ประจำการ):
              </span>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center gap-2">
              {FLEET_LINEUP_VIEWS.map((view, idx) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setSelectedLineupView(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedLineupView === idx
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span>{view.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Panoramic Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden bg-slate-950 group">
            <img
              key={activeLineup.id}
              src={activeLineup.image}
              alt={activeLineup.title}
              className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 animate-fadeIn"
            />

            {/* Luxury Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/20 to-transparent pointer-events-none" />

            {/* Top Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-xs font-black shadow-md border border-emerald-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeLineup.tag}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-300/40">
                หน้ารถ "โต๊ะจีนรพีพัฒน์"
              </span>
            </div>

            {/* Watermark Badge */}
            <FleetWatermarkBadge isLarge={true} />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-64 text-white space-y-1">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500" />
                <span>กองทัพรถบริการจัดเลี้ยงทั่วไทย</span>
              </div>
              <h3 className="text-base sm:text-xl lg:text-2xl font-black truncate">
                {activeLineup.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 sm:line-clamp-2 max-w-2xl font-medium">
                {activeLineup.subtitle}
              </p>
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={() => setLightboxImage({
                image: activeLineup.image,
                title: activeLineup.title,
                desc: activeLineup.subtitle,
                tag: activeLineup.tag
              })}
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 text-xs font-black border border-white/20 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">ดูภาพขยายใหญ่</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🚛 2. SPOTLIGHT CARDS: 3 DEDICATED RAPEEPHAT FLEET TRUCKS */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                สเปกและอุปกรณ์ประจำรถ "โต๊ะจีนรพีพัฒน์" (3 คันประจำการ):
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">พร้อมออกปฏิบัติการ 24 ชม.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FLEET_TRUCKS.map((truck) => (
              <div
                key={truck.id}
                onClick={() => setLightboxImage({
                  image: truck.image,
                  title: truck.name,
                  desc: truck.description,
                  tag: truck.tag
                })}
                className="group bg-white rounded-3xl border-2 border-amber-200/90 hover:border-emerald-500 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Truck Photo */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={truck.image}
                    alt={truck.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10.5px] font-black border border-amber-300/40 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-red-500" />
                      <span>{truck.code}</span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                      {truck.tag}
                    </span>
                  </div>

                  {/* Watermark on Photo */}
                  <FleetWatermarkBadge isLarge={false} />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="p-3 rounded-full bg-white text-emerald-800 shadow-xl transform scale-75 group-hover:scale-100 transition-transform flex items-center gap-1.5 text-xs font-black">
                      <Maximize2 className="w-4 h-4" />
                      <span>ดูภาพขยาย</span>
                    </div>
                  </div>
                </div>

                {/* Truck Info */}
                <div className="p-5 space-y-3.5 bg-white flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wide flex items-center justify-between">
                      <span>{truck.type}</span>
                      <span className="text-slate-500 font-bold">{truck.licensePlate}</span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {truck.name}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {truck.description}
                    </p>
                  </div>

                  {/* Capacity & Highlights */}
                  <div className="space-y-2 pt-3 border-t border-amber-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">ความจุจัดเลี้ยง:</span>
                      <span className="font-black text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {truck.capacity}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1">
                      {truck.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage({
                          image: truck.image,
                          title: truck.name,
                          desc: truck.description,
                          tag: truck.tag
                        });
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-700 text-emerald-900 hover:text-white font-black text-xs transition-all duration-200 border border-emerald-300 flex items-center justify-center gap-1.5"
                    >
                      <span>ดูรายละเอียดรถคันนี้</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📊 3. 4 PILLARS OF NATIONWIDE LOGISTICS EXCELLENCE */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border-2 border-amber-200/90 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">3 คันใหญ่</div>
              <div className="text-xs text-slate-600 font-bold">ขบวนรถประจำการพร้อมส่ง</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-amber-200/90 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">77 จังหวัด</div>
              <div className="text-xs text-slate-600 font-bold">บริการทั่วราชอาณาจักร</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-amber-200/90 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">100% ตรงเวลา</div>
              <div className="text-xs text-slate-600 font-bold">ถึงหน้างานก่อนเริ่ม 3-4 ชม.</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border-2 border-amber-200/90 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border-2 border-purple-300 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">ครัวสัญจรสด</div>
              <div className="text-xs text-slate-600 font-bold">ปรุงสุกร้อนหน้างาน 100%</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📞 4. NATIONWIDE BOOKING HOTLINE BANNER */}
        {/* ========================================================================= */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 text-white border-2 border-amber-300 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NATIONWIDE RAPID DEPLOYMENT GUARANTEE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                จองโต๊ะจีนวันนี้ ขบวนรถ "โต๊ะจีนรพีพัฒน์" พร้อมเดินทางถึงงานท่านทันที
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                บริการจัดเลี้ยงทั่วไทย นครปฐม, กรุงเทพฯ, นนทบุรี, ปทุมธานี, อยุธยา, สุพรรณบุรี, ราชบุรี, ชลบุรี และทุกจังหวัดทั่วไทย ตรงเวลา อาหารสดอร่อย ร้อนควันฉุย 100%
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href="tel:0813311646"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>สายด่วนรถบริการ: 081-331-1646</span>
              </a>

              <a
                href="#quotation-builder"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-amber-300"
              >
                <span>คำนวณราคาจัดเลี้ยง</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🔍 LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-scaleUp border-2 border-amber-300 max-h-[92vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-30 p-3 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors border border-white/30 cursor-pointer shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative bg-slate-950 aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              <FleetWatermarkBadge isLarge={true} />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md border border-emerald-400">
                  {lightboxImage.tag}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 bg-white space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                หน้ารถ "โต๊ะจีนรพีพัฒน์" • รถบริการจัดเลี้ยงทั่วไทย
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {lightboxImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {lightboxImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
