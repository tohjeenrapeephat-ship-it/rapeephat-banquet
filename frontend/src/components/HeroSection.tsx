import React, { useState, useEffect, useRef } from 'react';
import { WatermarkOverlay } from './WatermarkOverlay';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Utensils,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Gift,
  ArrowRight,
  Award,
  Crown,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBuilder: () => void;
}



interface ShowcaseItem {
  id: string;
  image: string;
  badge: string;
  shortName: string;
  title: string;
  subtitle: string;
  description: string;
  isHotFood?: boolean;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'banquet-emerald-lawn-sunset',
    image: '/images/hero/hero-banquet-emerald-lawn-sunset.jpg',
    badge: '🌿 จัดเลี้ยงธีมเขียวมรกต Sunset',
    shortName: 'ธีมเขียว Sunset',
    title: 'จัดเลี้ยงโต๊ะจีนธีมเขียวมรกต กลางแจ้งสนามหญ้ายามเย็น',
    subtitle: 'ผ้าปูโต๊ะลูกไม้ขาว • โบว์ซาตินเขียวมรกตหรู • แสงทไวไลท์สวยสะกดใจ',
    description: 'บรรยากาศจัดเลี้ยงโต๊ะจีนระดับพรีเมียมบนสนามหญ้าจริง ผังโต๊ะกลมและ Long Table ปูผ้าลูกไม้ขาวผูกโบว์เขียวมรกต ประดับไฟแสงสีและเวทีฉากหลังงดงาม',
  },
  {
    id: 'braised-pork-knuckle-shiitake-spoon',
    image: '/images/hero/hero-braised-pork-knuckle-shiitake-spoon.jpg',
    badge: '⭐ ขาหมูน้ำแดงเห็ดหอมยอดผัก',
    shortName: 'ขาหมูน้ำแดงยอดผัก',
    title: 'ขาหมูน้ำแดงยอดผัก & เห็ดหอมตุ๋นยาจีนสูตรโบราณ 35 ปี',
    subtitle: 'เนื้อนุ่มละมุนลิ้น หนังบางนุ่ม • น้ำซอสเห็ดหอมเข้มข้นกลมกล่อม',
    description: 'เมนูยอดนิยมตลอดกาล ขาหมูตุ๋นไฟอ่อนจนเข้าเนื้อ นุ่มละลายในปาก ราดน้ำแดงเห็ดหอมสูตรลับเฉพาะ เสิร์ฟพร้อมผักกวางตุ้งฮ่องกงสดกรอบ ปรุงสดใหม่ทุกโต๊ะ',
  },
  {
    id: 'banquet-purple-stadium-hall',
    image: '/images/hero/hero-banquet-purple-stadium-hall.jpg',
    badge: '🟣 จัดเลี้ยงธีมสีม่วงราชวงศ์',
    shortName: 'ธีมสีม่วงสเตเดียม',
    title: 'มหาอภิมหาจัดเลี้ยงธีมสีม่วง ศูนย์ประชุม & อินดอร์สเตเดียม',
    subtitle: 'ผังสมมาตรเรียงแถวตรงเป๊ะ • แจกันกุหลาบขาว VIP • แขก 1,000+ ท่าน',
    description: 'ภาพผลงานจริงการจัดเลี้ยงสเกลใหญ่ในศูนย์การประชุมและสนามกีฬาในร่ม โต๊ะจีนปูผ้าคลุมม่วงสดใสตัดขาว แจกันดอกไม้สดหรูหรา รองรับแขกกว่า 1,000 ท่านพร้อมกัน',
  },
  {
    id: 'lotus-leaf-rice',
    image: '/images/hero/hero-lotus-leaf-rice.jpg',
    badge: '👑 ข้าวห่อใบบัวมงคล',
    shortName: 'ข้าวห่อใบบัว',
    title: 'ข้าวผัดห่อใบบัวทรงเครื่องจักรพรรดิ',
    subtitle: 'ไข่แดงเค็ม แปะก๊วย เม็ดบัว กุนเชียง กุ้งแห้ง เห็ดหอม',
    description: 'ข้าวผัดทรงเครื่องสูตรกวางตุ้งโบราณ อบในใบบัวหอมกรุ่น เครื่องแน่นล้นใบบัว เสิร์ฟร้อนๆ เป็นเมนูมงคลเสริมความเจริญรุ่งเรือง',
  },
  {
    id: 'duck-noodle-chopsticks',
    image: '/images/hero/hero-duck-noodle-chopsticks.jpg',
    badge: '🥢 ตะเกียบคีบคำโต',
    shortName: 'หมี่หยกคำโต',
    title: 'เป็ดย่างน้ำผึ้งหมี่หยกคำโต หนังกรอบเนื้อฉ่ำ',
    subtitle: 'คีบเนื้อเป็ดย่างหนังกรอบคู่หมี่หยกใบเตย • น้ำราดสูตร 35 ปี',
    description: 'เป็ดย่างสูตรภัตตาคารฮ่องกงแท้ หนังกรอบสีทอง เนื้อนุ่มฉ่ำ เสิร์ฟพร้อมหมี่หยกเหนียวนุ่มและผักสดกรอบ',
    isHotFood: true,
  },
  {
    id: 'appetizer-five-delight',
    image: '/images/hero/hero-appetizer-five-delight.jpg',
    badge: '🌟 ออเดิร์ฟ 5 อย่างจักรพรรดิ',
    shortName: 'ออเดิร์ฟ 5 อย่าง',
    title: 'ออเดิร์ฟ 5 อย่างจานหมุน (กุ้งแก้ว & ฮ่อยจ๊อทอดกรอบ)',
    subtitle: 'เสิร์ฟจานแรกเปิดงาน • สด สะอาด ปรุงใหม่',
    description: 'กุ้งแก้วลวกราดน้ำจิ้มซีฟู้ดมะนาวสด ไข่เยี่ยวม้าขิงดอง เม็ดมะม่วงหิมพานต์ทอดกรอบ แฮ่กึ๊นทอด และลูกชิ้นปลาลวก จัดในจานเซรามิก 5 ช่อง',
    isHotFood: true,
  },
  {
    id: 'honey-roast-duck',
    image: '/images/hero/hero-honey-roast-duck.jpg',
    badge: '🔥 เป็ดย่างน้ำผึ้งฮ่องกง',
    shortName: 'เป็ดย่างน้ำผึ้ง',
    title: 'เป็ดย่างน้ำผึ้งหมี่หยก ยอดผักคะน้าฮ่องกง',
    subtitle: 'หนังกรอบสีทอง เนื้อนุ่มชุ่มฉ่ำ • ราดซอสน้ำผึ้งแท้ 35 ปี',
    description: 'เป็ดย่างสูตรภัตตาคารฮ่องกงแท้ หนังกรอบบางเนื้อนุ่ม ทานคู่กับหมี่หยกใบเตยเหนียวนุ่มและผักคะน้าฮ่องกงสดกรอบ',
    isHotFood: true,
  },
  {
    id: 'salad-prawn-mushroom',
    image: '/images/hero/hero-salad-prawn-mushroom.jpg',
    badge: '🦐 สลัดกุ้งสด & เห็ดหอมยอดผัก',
    shortName: 'สลัดกุ้งสด',
    title: 'กุ้งสดลวก & เห็ดหอมยอดผักทรงเครื่องภัตตาคาร',
    subtitle: 'กุ้งตัวโตเนื้อหวานเด้ง • เห็ดหอมตุ๋นซีอิ๊วสูตรโบราณ',
    description: 'กุ้งสดคัดไซส์ใหญ่เนื้อเด้งหวาน เรียงล้อมรอบเห็ดหอมตุ๋นยาจีนและผักกาดแก้ว จัดจานประณีตสไตล์โต๊ะจีนภัตตาคารพรีเมียม',
    isHotFood: true,
  },
  {
    id: 'banquet-gold',
    image: '/images/hero/hero-banquet-gold.jpg',
    badge: '👑 เซ็ตโต๊ะจีนสีทองมงคล',
    shortName: 'ธีมสีทอง',
    title: 'เซ็ตโต๊ะจีนธีมสีทองสง่างาม & โบว์ซาตินทอง',
    subtitle: 'ฟรีอุปกรณ์ครบเซ็ต • โต๊ะ เก้าอี้ ผ้าคลุม จานชาม แก้วน้ำ',
    description: 'การจัดวางโต๊ะจีนมาตรฐานระดับภัตตาคาร ผ้าปูโต๊ะลูกไม้และโบว์เก้าอี้สีทองมงคล เหมาะสำหรับงานมงคลสมรส งานทำบุญ และงานฉลอง',
    isHotFood: false,
  },
  {
    id: 'banquet-emerald',
    image: '/images/hero/hero-banquet-emerald.jpg',
    badge: '✨ เซ็ตโต๊ะจีนเขียวมรกต',
    shortName: 'ธีมเขียวมรกต',
    title: 'เซ็ตโต๊ะจีนธีมเขียวมรกต & โบว์ซาตินพรีเมียม',
    subtitle: 'ฟรีอุปกรณ์ครบเซ็ต • โต๊ะ เก้าอี้ ผ้าคลุม จานชาม แก้วน้ำ',
    description: 'การจัดวางโต๊ะจีนมาตรฐานระดับภัตตาคาร ผ้าปูโต๊ะและโบว์เก้าอี้สีเขียวมรกตหรูหรา พร้อมชุดจานชามเมลามีนและผ้าเช็ดปากครบครัน',
    isHotFood: false,
  },
  {
    id: 'banquet-mint',
    image: '/images/hero/hero-banquet-mint.jpg',
    badge: '💎 เซ็ตโต๊ะจีนเขียวมิ้นต์',
    shortName: 'ธีมเขียวมิ้นต์',
    title: 'เซ็ตโต๊ะจีนธีมเขียวมิ้นต์ พรีเมียมโมเดิร์น',
    subtitle: 'บริการจัดเลี้ยงระดับพรีเมียม • สด สะอาด ตรงเวลา 100%',
    description: 'บรรยากาศโต๊ะจีนโทนสีเขียวมิ้นต์สดใส สบายตา ดูทันสมัย เหมาะสำหรับงานแต่งงาน งานสังสรรค์ และงานเลี้ยงฉลองทุกรูปแบบ',
    isHotFood: false,
  },
  {
    id: 'banquet-outdoor-night',
    image: '/images/hero/hero-banquet-outdoor-night.jpg',
    badge: '🌟 จัดเลี้ยงกลางแจ้งไฟประดับ',
    shortName: 'จัดเลี้ยงกลางแจ้ง',
    title: 'บรรยากาศจัดเลี้ยงกลางแจ้ง ไฟประดับสุดอลังการ',
    subtitle: 'รองรับ 5 - 500 โต๊ะ • พร้อมเวที เครื่องเสียง และระบบไฟ',
    description: 'บริการจัดเลี้ยงโต๊ะจีนกลางแจ้ง งานอีเวนต์ คอนเสิร์ต และงานเลี้ยงประจำปี บรรยากาศไฟประดับยามค่ำคืนสวยงามประทับใจ',
    isHotFood: false,
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBuilder }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeItem = SHOWCASE_ITEMS[currentIndex];

  // Auto-switch carousel every 4.5 seconds
  useEffect(() => {
    if (isAutoPlay) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SHOWCASE_ITEMS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
  };

  return (
    <div className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-16 overflow-hidden">
      
      {/* 👑 Royal Gold & Ruby Ambient Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-100/60 via-red-50/40 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: HEADLINE, LOGO & VALUE PROPOSITIONS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Prominent Official Logo Display with Gold Rim */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="p-2 rounded-3xl bg-white shadow-2xl border-2 border-amber-400 ring-4 ring-amber-300/30 flex items-center justify-center transform hover:scale-105 transition-all shrink-0">
                <img
                  src="/images/brand/logo.png"
                  alt="โต๊ะจีน รพีพัฒน์ RAPEEPHAT"
                  className="w-28 sm:w-32 h-auto object-contain"
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border-2 border-amber-300/80 shadow-xs backdrop-blur-md">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span className="text-xs font-black text-slate-900 tracking-wide flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>ประสบการณ์ 35+ ปี • จัดเลี้ยงกว่า 6,500+ งาน</span>
                  </span>
                </div>
                <div className="text-xs font-black text-amber-800 tracking-wider">
                  ★ มาตรฐานภัตตาคารพรีเมียม สด สะอาด ตรงเวลา 100% ★
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14]">
              <span className="text-slate-900">บริการจัดเลี้ยงโต๊ะจีน</span>
              <span className="block mt-2 text-gradient-red-gold">
                ระดับภัตตาคารพรีเมียม
              </span>
            </h1>

            {/* Slogan & Description */}
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              <strong className="text-slate-900 font-bold border-b-2 border-amber-400 pb-0.5">สด สะอาด อร่อย ทั่วราชอาณาจักร</strong> ปรุงสุกสดใหม่หน้างาน 100% พร้อมบริการครบวงจร <span className="text-red-700 font-bold">ฟรีอุปกรณ์โต๊ะ เก้าอี้ ผ้าคลุมผูกโบว์ ชุดจานชาม</span> และทีมงานบริกรมืออาชีพ
            </p>

            {/* Red & Gold Luxury Promo Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50/50 to-red-50 border-2 border-amber-300 shadow-sm flex items-center gap-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-300 group-hover:scale-105 transition-transform">
                <Gift className="w-6 h-6 text-amber-300 animate-bounce" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="text-red-700 font-black">โปรโมชันพิเศษฉลอง 35 ปี</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold uppercase shadow-xs border border-amber-300">
                    HOT PROMO
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-semibold">
                  สั่งจัดเลี้ยง <strong className="text-red-700 font-black">ครบ 20 โต๊ะ แถมฟรีทันที 1 โต๊ะ</strong> (ระบบคำนวณส่วนลดให้อัตโนมัติ)
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenBuilder}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black text-base shadow-red-glow border border-amber-300/80 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>คำนวณราคา & ออกใบเสนอราคา</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <a
                href="#packages"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-amber-50/60 text-slate-900 font-black text-sm border-2 border-amber-400 shadow-md transition-all flex items-center justify-center gap-2.5 group"
              >
                <Utensils className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                <span className="text-slate-900 group-hover:text-red-700 transition-colors">ดูแพ็กเกจ & เมนูอาหาร</span>
              </a>
            </div>

            {/* Quick Guarantees 3-Item Pill List with Gold Accent */}
            <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl bg-white border-2 border-amber-200 text-center space-y-0.5 shadow-2xs">
                <div className="text-xs font-black text-red-700">100% สดใหม่</div>
                <div className="text-[10.5px] text-amber-900 font-bold">ปรุงสุกหน้างาน</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border-2 border-amber-200 text-center space-y-0.5 shadow-2xs">
                <div className="text-xs font-black text-red-700">ฟรีอุปกรณ์ครบ</div>
                <div className="text-[10.5px] text-amber-900 font-bold">โต๊ะ เก้าอี้ ผูกโบว์</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border-2 border-amber-200 text-center space-y-0.5 shadow-2xs">
                <div className="text-xs font-black text-red-700">มัดจำ 30%</div>
                <div className="text-[10.5px] text-amber-900 font-bold">ชำระวันงาน 70%</div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 🌟 RIGHT COLUMN: ULTRA-LUXURIOUS 4-PHOTO SHOWCASE CAROUSEL (แทนวิดีโอ) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Spotlight Card with Gold Framing */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-slate-950 group"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Photo Display with Animated Steam on Hot Food */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative h-[430px] sm:h-[470px] overflow-hidden cursor-pointer"
              >
                <img
                  key={activeItem.id}
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-700 animate-fadeIn select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <WatermarkOverlay size="lg" opacity={0.42} />

                {/* Dark Vignette & Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/80 shadow-lg">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
                      {activeItem.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-mono font-bold">
                    <span>0{currentIndex + 1}</span>
                    <span className="text-amber-400">/</span>
                    <span>0{SHOWCASE_ITEMS.length}</span>
                  </div>
                </div>

                {/* Center Hover Magnifier Prompt */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                  <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-amber-300 text-white text-xs font-black flex items-center gap-2 shadow-2xl">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>คลิกเพื่อดูภาพความละเอียดสูง</span>
                  </div>
                </div>

                {/* Bottom Overlay Info Card */}
                <div className="absolute bottom-4 left-4 right-4 z-20 space-y-1.5 bg-black/75 backdrop-blur-md p-4 rounded-2xl border border-amber-300/40 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                      {activeItem.title}
                    </h3>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black tracking-wide border border-amber-300/60">
                      ภาพจริง 100%
                    </span>
                  </div>
                  <p className="text-xs text-amber-200 font-medium line-clamp-1">
                    {activeItem.subtitle}
                  </p>
                </div>

              </div>

              {/* Prev / Next Arrow Navigation Controls */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center border border-white/40 shadow-lg backdrop-blur-md transition-all z-30"
                aria-label="รูปก่อนหน้า"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center border border-white/40 shadow-lg backdrop-blur-md transition-all z-30"
                aria-label="รูปถัดไป"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Shimmering Timer Progress Bar */}
              <div className="w-full bg-white/20 h-1">
                <div
                  key={currentIndex}
                  className="bg-gradient-to-r from-amber-400 via-amber-300 to-red-500 h-full w-full origin-left transition-all"
                  style={{
                    animation: isAutoPlay ? 'progress 4.5s linear infinite' : 'none',
                  }}
                />
              </div>

            </div>

            {/* ========================================================================= */}
            {/* 11 INTERACTIVE THUMBNAIL SELECTOR CARDS (RED & GOLD LUXURY) */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
              {SHOWCASE_ITEMS.map((item, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden p-1 transition-all duration-300 text-left flex flex-col items-center group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-b from-amber-400 to-amber-600 ring-2 ring-amber-400 shadow-lg scale-102'
                        : 'bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-400 opacity-80 hover:opacity-100 shadow-2xs'
                    }`}
                  >
                    <div className="w-full h-14 sm:h-18 rounded-xl overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-red-600/20 border-2 border-white rounded-xl" />
                      )}
                    </div>
                    <div className="w-full py-1 px-0.5 text-center">
                      <div
                        className={`text-[9.5px] sm:text-[11.5px] font-black truncate leading-tight ${
                          isActive ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.shortName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ FULLSCREEN IMMERSIVE LIGHTBOX MODAL (NO BLACK GAPS / AMBIENT GLOW) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-950/95 backdrop-blur-2xl rounded-3xl border-2 border-amber-400/80 overflow-hidden shadow-2xl flex flex-col max-h-[96vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Fill from Image (Completely eliminates any black emptiness) */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-40 scale-125 -z-10 pointer-events-none transition-all duration-700"
              style={{ backgroundImage: `url(${activeItem.image})` }}
            />

            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-slate-900/95 backdrop-blur-md border-b border-amber-400/30 flex items-center justify-between text-white shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center border border-amber-300 text-white shadow-md">
                  <Camera className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{activeItem.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400 text-xs font-black">
                      {activeItem.badge}
                    </span>
                  </h3>
                  <p className="text-xs text-amber-200/80 font-medium">
                    โต๊ะจีน รพีพัฒน์ พรีเมียม • การันตีรูปภาพจริง 100%
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-red-600/80 text-white transition-all border border-white/20 hover:scale-105 cursor-pointer"
                title="ปิดหน้าต่าง"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Image Body - 100% Full-Bleed Edge-to-Edge */}
            <div className="relative w-full h-[450px] sm:h-[580px] md:h-[640px] bg-slate-950 overflow-hidden">
              {/* Main Photo (100% Full Frame) */}
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
              />
              <WatermarkOverlay size="lg" opacity={0.42} />

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-600 text-white flex items-center justify-center border-2 border-amber-300/80 shadow-2xl backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                aria-label="รูปก่อนหน้า"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-600 text-white flex items-center justify-center border-2 border-amber-300/80 shadow-2xl backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                aria-label="รูปถัดไป"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            {/* Modal Footer Description & CTA */}
            <div className="p-4 sm:p-5 bg-slate-900/95 backdrop-blur-md border-t border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shrink-0 z-10">
              <div className="text-slate-300 font-medium text-center sm:text-left space-y-1">
                <div className="text-amber-300 font-black text-sm sm:text-base">{activeItem.subtitle}</div>
                <p className="text-slate-300 text-xs sm:text-sm">{activeItem.description}</p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href="tel:0830872257"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-2 border border-white/20"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-black">โทร 083-087-2257</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setLightboxOpen(false);
                    onOpenBuilder();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black shadow-lg border border-amber-300 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>คำนวณราคาจัดเลี้ยง</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
