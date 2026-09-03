import React, { useState } from 'react';
import {
  Building2,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Car,
  HeartHandshake,
  Grid,
  Play,
  Pause,
  ChevronRight,
  Utensils,
  Flame,
  Crown,
  FileCheck2,
  BadgeCheck,
  Shield
} from 'lucide-react';

interface ClientLogo {
  id: string;
  name: string;
  category: 'edu' | 'corp' | 'bank' | 'auto' | 'pharma';
  categoryLabel: string;
  image: string;
}

const CLIENT_LOGOS: ClientLogo[] = [
  // Universities / Academic
  { id: 'ku', name: 'มหาวิทยาลัยเกษตรศาสตร์', category: 'edu', categoryLabel: 'สถาบันการศึกษา', image: '/images/clients/logos/ku.jpg' },
  { id: 'cu', name: 'จุฬาลงกรณ์มหาวิทยาลัย', category: 'edu', categoryLabel: 'สถาบันการศึกษา', image: '/images/clients/logos/cu.jpg' },
  { id: 'thammasat', name: 'มหาวิทยาลัยธรรมศาสตร์', category: 'edu', categoryLabel: 'สถาบันการศึกษา', image: '/images/clients/logos/thammasat.jpg' },
  { id: 'swu', name: 'มหาวิทยาลัยศรีนครินทรวิโรฒ (มศว)', category: 'edu', categoryLabel: 'สถาบันการศึกษา', image: '/images/clients/logos/swu.jpg' },

  // Real Estate & Leading Corporates
  { id: 'sansiri', name: 'แสนสิริ (SANSIRI)', category: 'corp', categoryLabel: 'อสังหาริมทรัพย์', image: '/images/clients/logos/sansiri.jpg' },
  { id: 'sc-asset', name: 'SC ASSET', category: 'corp', categoryLabel: 'อสังหาริมทรัพย์', image: '/images/clients/logos/sc-asset.jpg' },
  { id: 'frasers', name: 'Frasers Property', category: 'corp', categoryLabel: 'อสังหาริมทรัพย์', image: '/images/clients/logos/frasers-property.jpg' },
  { id: 'mali', name: 'นมตรามะลิ (Mali)', category: 'corp', categoryLabel: 'สินค้าอุปโภคบริโภค', image: '/images/clients/logos/mali.jpg' },
  { id: 'colgate', name: 'Colgate', category: 'corp', categoryLabel: 'สินค้าอุปโภคบริโภค', image: '/images/clients/logos/colgate.jpg' },
  { id: 'fn', name: 'F&N', category: 'corp', categoryLabel: 'สินค้าอุปโภคบริโภค', image: '/images/clients/logos/fn.jpg' },

  // Banks & Financial Institutions
  { id: 'scb', name: 'ธนาคารไทยพาณิชย์ (SCB)', category: 'bank', categoryLabel: 'สถาบันการเงิน', image: '/images/clients/logos/scb.svg' },
  { id: 'krungthai', name: 'ธนาคารกรุงไทย', category: 'bank', categoryLabel: 'สถาบันการเงิน', image: '/images/clients/logos/krungthai.jpg' },
  { id: 'krungsri', name: 'ธนาคารกรุงศรีอยุธยา', category: 'bank', categoryLabel: 'สถาบันการเงิน', image: '/images/clients/logos/krungsri.jpg' },
  { id: 'ttb', name: 'ทีเอ็มบีธนชาต (ttb)', category: 'bank', categoryLabel: 'สถาบันการเงิน', image: '/images/clients/logos/ttb.jpg' },
  { id: 'bualuang', name: 'หลักทรัพย์บัวหลวง (Bualuang)', category: 'bank', categoryLabel: 'สถาบันการเงิน', image: '/images/clients/logos/bualuang.jpg' },
  { id: 'fwd', name: 'FWD Insurance', category: 'bank', categoryLabel: 'ประกันภัย', image: '/images/clients/logos/fwd-insurance.jpg' },
  { id: 'viriyah', name: 'วิริยะประกันภัย', category: 'bank', categoryLabel: 'ประกันภัย', image: '/images/clients/logos/viriyah.jpg' },

  // Automotive & Global Tech
  { id: 'mercedes', name: 'Mercedes-Benz', category: 'auto', categoryLabel: 'ยานยนต์ระดับโลก', image: '/images/clients/logos/mercedes-benz.jpg' },
  { id: 'toyota', name: 'Toyota', category: 'auto', categoryLabel: 'ยานยนต์ระดับโลก', image: '/images/clients/logos/toyota.jpg' },
  { id: 'honda', name: 'Honda', category: 'auto', categoryLabel: 'ยานยนต์ระดับโลก', image: '/images/clients/logos/honda.jpg' },
  { id: 'canon', name: 'Canon', category: 'auto', categoryLabel: 'เทคโนโลยี & อุตสาหกรรม', image: '/images/clients/logos/canon.jpg' },
  { id: 'abb', name: 'ABB', category: 'auto', categoryLabel: 'เทคโนโลยี & อุตสาหกรรม', image: '/images/clients/logos/abb.jpg' },
  { id: 'jd', name: 'JD Central', category: 'auto', categoryLabel: 'อีคอมเมิร์ซ', image: '/images/clients/logos/jd.jpg' },

  // Pharma, Healthcare & Industry
  { id: 'zuellig', name: 'Zuellig Pharma', category: 'pharma', categoryLabel: 'เวชภัณฑ์ & สุขภาพ', image: '/images/clients/logos/zuellig-pharma.jpg' },
  { id: 'zimmer', name: 'Zimmer Biomet', category: 'pharma', categoryLabel: 'เวชภัณฑ์ & สุขภาพ', image: '/images/clients/logos/zimmer-biomet.jpg' },
  { id: 'boehringer', name: 'Boehringer Ingelheim', category: 'pharma', categoryLabel: 'เวชภัณฑ์ & สุขภาพ', image: '/images/clients/logos/boehringer.jpg' },
  { id: 'dermalink', name: 'Dermalink', category: 'pharma', categoryLabel: 'ความงาม & เวชภัณฑ์', image: '/images/clients/logos/dermalink.jpg' },
  { id: 'calvatis', name: 'Calvatis Calgonit', category: 'pharma', categoryLabel: 'เคมีภัณฑ์อุตสาหกรรม', image: '/images/clients/logos/calvatis.jpg' },
  { id: 'channel-one', name: 'ข่าวรอบวัน / ช่องวัน', category: 'corp', categoryLabel: 'สื่อและมีเดีย', image: '/images/clients/logos/channel-one.jpg' },
  { id: 'inetms', name: 'INETMS', category: 'auto', categoryLabel: 'ไอที & คลาวด์', image: '/images/clients/logos/inetms.jpg' },
  { id: 'mol', name: 'MOL Money Online', category: 'corp', categoryLabel: 'ฟินเทค', image: '/images/clients/logos/mol.jpg' },
  { id: 'pinpung', name: 'Pinpung', category: 'corp', categoryLabel: 'ธุรกิจองค์กร', image: '/images/clients/logos/pinpung.jpg' },
  { id: 'sl', name: 'SL Group', category: 'corp', categoryLabel: 'ธุรกิจองค์กร', image: '/images/clients/logos/sl.jpg' },
  { id: 'vbix', name: 'V Bix', category: 'corp', categoryLabel: 'ธุรกิจองค์กร', image: '/images/clients/logos/vbix.jpg' },
  { id: 'aes', name: 'AES', category: 'auto', categoryLabel: 'วิศวกรรม', image: '/images/clients/logos/aes.jpg' },
  { id: 'kkk', name: 'KK&K Intertech', category: 'auto', categoryLabel: 'อุตสาหกรรม', image: '/images/clients/logos/kkk.jpg' },
];

// Split into 2 rows for smooth multi-lane infinite slider
const ROW_1 = CLIENT_LOGOS.slice(0, 18);
const ROW_2 = CLIENT_LOGOS.slice(18);

export const OurClients: React.FC = () => {
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'ทั้งหมด (36 องค์กร)' },
    { id: 'edu', label: 'มหาวิทยาลัย & สถาบัน' },
    { id: 'corp', label: 'บริษัทมหาชน' },
    { id: 'bank', label: 'ธนาคาร & ประกันภัย' },
    { id: 'auto', label: 'ยานยนต์ & เทคโนโลยี' },
    { id: 'pharma', label: 'เวชภัณฑ์ & สุขภาพ' },
  ];

  const filteredGridLogos = selectedCategory === 'all'
    ? CLIENT_LOGOS
    : CLIENT_LOGOS.filter((c) => c.category === selectedCategory);

  return (
    <section id="clients" className="py-20 relative border-t border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>TRUSTED BY LEADING ORGANIZATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ลูกค้าองค์กร & พันธมิตร
            <span className="block mt-1 text-gradient-red-gold">
              ที่ไว้วางใจ โต๊ะจีน รพีพัฒน์
            </span>
          </h2>
          <p className="text-slate-700 text-sm font-medium">
            ได้รับความไว้วางใจจากสถาบันการศึกษาชั้นนำ บริษัทมหาชน สถาบันการเงิน และองค์กรระดับโลกในการจัดเลี้ยงกว่า 6,500+ งาน
          </p>

          {/* Controls: Toggle between Infinite Slider and Grid View */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="inline-flex p-1 bg-amber-50/80 rounded-2xl border-2 border-amber-200">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'slider'
                    ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md border border-amber-300'
                    : 'text-slate-700 hover:text-red-700'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>ภาพสไลด์อัตโนมัติ (ซ้ายไปขวา)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md border border-amber-300'
                    : 'text-slate-700 hover:text-red-700'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>ดูโลโก้ทั้งหมด (36 องค์กร)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🎞️ MODE 1: MODERN SLIDER FROM LEFT TO RIGHT (ตัดเป็นรูปๆ แยกเดี่ยว สไลด์นุ่มนวล) */}
        {/* ========================================================================= */}
        {viewMode === 'slider' ? (
          <div className="space-y-5 my-8">
            
            {/* Row 1: Sliding Left-to-Right */}
            <div className="relative w-full overflow-hidden mask-gradient-x py-2">
              <div className="animate-marquee-ltr flex items-center gap-4">
                {/* Repeat list twice for seamless infinite loop */}
                {[...ROW_1, ...ROW_1].map((client, idx) => (
                  <div
                    key={`${client.id}-r1-${idx}`}
                    className="group shrink-0 w-36 sm:w-44 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-red-400 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover:bg-red-50/40 transition-colors">
                      <img
                        src={client.image}
                        alt={client.name}
                        className="w-full h-full object-contain rounded-lg transform group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full px-1">
                      <div className="text-[11px] font-black text-slate-800 truncate group-hover:text-red-600 transition-colors">
                        {client.name}
                      </div>
                      <div className="text-[9.5px] font-bold text-slate-400 truncate">
                        {client.categoryLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Sliding smoothly */}
            <div className="relative w-full overflow-hidden mask-gradient-x py-2">
              <div className="animate-marquee-ltr flex items-center gap-4" style={{ animationDuration: '50s' }}>
                {/* Repeat list twice for seamless infinite loop */}
                {[...ROW_2, ...ROW_2].map((client, idx) => (
                  <div
                    key={`${client.id}-r2-${idx}`}
                    className="group shrink-0 w-36 sm:w-44 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-red-400 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100 group-hover:bg-red-50/40 transition-colors">
                      <img
                        src={client.image}
                        alt={client.name}
                        className="w-full h-full object-contain rounded-lg transform group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full px-1">
                      <div className="text-[11px] font-black text-slate-800 truncate group-hover:text-red-600 transition-colors">
                        {client.name}
                      </div>
                      <div className="text-[9.5px] font-bold text-slate-400 truncate">
                        {client.categoryLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 font-medium pt-2">
              💡 นำเมาส์วางเหนือโลโก้เพื่อหยุดภาพสไลด์ชั่วคราว
            </p>
          </div>
        ) : (
          /* ========================================================================= */
          /* 📱 MODE 2: STANDALONE LOGOS GRID (36 รูปเดี่ยว แยกกันชัดเจน) */
          /* ========================================================================= */
          <div className="space-y-6 my-8">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of Individual Standalone Logos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {filteredGridLogos.map((client) => (
                <div
                  key={client.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-red-400 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-center space-y-2"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1.5 border border-slate-100">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-full h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-[11px] font-black text-slate-800 truncate">
                      {client.name}
                    </div>
                    <div className="text-[9.5px] font-bold text-slate-400 truncate">
                      {client.categoryLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 Category Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">มหาวิทยาลัยชั้นนำ</div>
              <div className="text-[11px] text-slate-500 font-medium">จุฬาฯ, ธรรมศาสตร์, มก., มศว</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">บริษัทมหาชน & อสังหาฯ</div>
              <div className="text-[11px] text-slate-500 font-medium">แสนสิริ, SC Asset, Frasers, ABB</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">สถาบันการเงิน & ประกันภัย</div>
              <div className="text-[11px] text-slate-500 font-medium">SCB, กรุงไทย, กรุงศรี, ttb, FWD</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">ยานยนต์ & อุตสาหกรรม</div>
              <div className="text-[11px] text-slate-500 font-medium">Mercedes, Toyota, Honda, Canon</div>
            </div>
          </div>
        </div>

        {/* Corporate Catering Booking CTA */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CORPORATE & BANQUET SOLUTIONS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              จัดเลี้ยงองค์กร งานประชุม หรืองานสังสรรค์ประจำปี?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              เราพร้อมออกใบเสนอราคาอย่างเป็นทางการ มีเอกสารหัก ณ ที่จ่าย และใบเสร็จรับเงินถูกต้องตามกฎหมาย
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:0813311646"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              โทรสอบถาม 081-331-1646
            </a>

            <a
              href="#quotation"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-red-glow transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>คำนวณราคาออกใบเสนอราคา</span>
              <HeartHandshake className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Official Trustmark & Culinary Quality Guarantee Badges */}
        <div className="mt-10 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-black tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              👑 การันตีความมั่นใจ มาตรฐานโต๊ะจีนระดับภัตตาคาร
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white">
              เครื่องหมายรับรองมาตรฐาน & ความน่าเชื่อถือสูงสุด
            </h4>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. DBD Registered Badge */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-2 border-cyan-500/40 shadow-xl relative overflow-hidden group hover:border-cyan-400 transition-all hover:scale-101">
              <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-800 text-white flex flex-col items-center justify-center shrink-0 shadow-lg border border-cyan-300/50 p-1">
                  <div className="text-[9px] font-black tracking-wider leading-none text-cyan-200">กรมพัฒนา</div>
                  <div className="text-[13px] font-black tracking-tighter leading-none text-white my-0.5">DBD</div>
                  <div className="text-[7.5px] font-bold tracking-widest leading-none text-cyan-300 uppercase">Registered</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-cyan-300 tracking-wide">DBD Registered</span>
                    <span className="px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-bold border border-cyan-400/40">
                      ✓ ตรวจสอบได้ 100%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    ทะเบียนพาณิชย์อิเล็กทรอนิกส์ กรมพัฒนาธุรกิจการค้า
                  </div>
                  <p className="text-[11.5px] text-slate-300 font-medium leading-relaxed pt-0.5">
                    จดทะเบียนพาณิชย์ถูกต้องตามกฎหมาย มีสถานที่ตั้งและตัวตนชัดเจน มั่นใจในความซื่อสัตย์ ปลอดภัยทุกการสั่งจอง
                  </p>
                </div>
              </div>
            </div>

            {/* 2. 100% Fresh & Cleanliness Guarantee Badge */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-2 border-emerald-500/40 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all hover:scale-101">
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 text-white flex flex-col items-center justify-center shrink-0 shadow-lg border border-emerald-300/50 p-1">
                  <Flame className="w-5 h-5 text-amber-300" />
                  <div className="text-[8px] font-black tracking-wider leading-none text-emerald-100 uppercase mt-0.5">100% Fresh</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-400 tracking-wide">ความสะอาด & สดใหม่ 100%</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/40">
                      GRADE A+
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    วัตถุดิบคัดเกรดพรีเมียม สดใหม่ต่อวัน ปรุงสุกร้อนหน้างาน 100%
                  </div>
                  <p className="text-[11.5px] text-slate-300 font-medium leading-relaxed pt-0.5">
                    คัดสรรเนื้อสัตว์ ผักสด และซีฟู้ดสดใหม่วันต่อวัน ปรุงสุกสดใหม่ร้อนๆ ณ สถานที่จัดงาน ไร้สารกันบูด ถูกสุขอนามัย
                  </p>
                </div>
              </div>
            </div>

            {/* 3. 35+ Years Culinary Heritage Guarantee Badge */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-2 border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all hover:scale-101 md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-800 text-white flex flex-col items-center justify-center shrink-0 shadow-lg border border-amber-300/50 p-1">
                  <Crown className="w-5 h-5 text-amber-200" />
                  <div className="text-[8.5px] font-black tracking-wider leading-none text-amber-100 uppercase mt-0.5">35+ Years</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-amber-300 tracking-wide">การันตีประสบการณ์ 35+ ปี</span>
                    <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-200 text-[10px] font-bold border border-amber-400/40">
                      ต้นตำรับแท้
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    สืบทอดตำนานความอร่อย ต้นตำรับนครปฐม ยาวนานกว่า 35 ปี
                  </div>
                  <p className="text-[11.5px] text-slate-300 font-medium leading-relaxed pt-0.5">
                    สืบสานสูตรลับโต๊ะจีนนครปฐมแท้ชั้นครูภัตตาคาร การันตีความประทับใจและความสมเกียรติเจ้าภาพกว่า 10,000+ งาน
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Contract & Official Receipts Assurance Strip */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-center sm:text-left">
                📜 มีสัญญาจ้างจัดเลี้ยง ออกใบเสร็จรับเงินมัดจำ 30% และใบเสร็จรับเงินคงเหลือ 70% ชัดเจน มีผลบังคับใช้ตามกฎหมาย 100%
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black">
                ✓ บุคคลธรรมดา
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-black">
                ✓ องค์กร & นิติบุคคล
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
