import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Award,
  Users,
  UtensilsCrossed,
  Truck,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  Radio,
  ArrowRight
} from 'lucide-react';
import { WatermarkOverlay } from './WatermarkOverlay';

interface DroneScene {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  tables: string;
  zone: string;
  altitude: string;
  description: string;
}

const DRONE_SCENES: DroneScene[] = [
  {
    id: 'scene-aerial-zones',
    title: 'ภาพมุมสูงโดรน 4K: ลานจัดเลี้ยงมหาอภิมหา 750 โต๊ะ (4 โซนสีมงคล)',
    subtitle: 'ทัศนียภาพมุมสูงจากโดรน แสดงผังจัดเลี้ยงขนาดใหญ่ที่สุด แบ่งโซนสีแดง ม่วง เขียว น้ำเงิน',
    badge: '🚁 ภาพมุมสูงโดรน 4K',
    image: '/images/portfolio/work-mega-750tables-drone-grand-flagship.jpg',
    tables: '750 โต๊ะ (7,500 แขก)',
    zone: 'ลานจัดเลี้ยงกลางแจ้ง 4 โซน',
    altitude: 'ความสูงโดรน 45 เมตร',
    description: 'ผังจัดเลี้ยงระดับประเทศ รองรับแขกกว่า 7,500 ท่าน จัดวางโต๊ะจีนมาตรฐานเป็นระเบียบเรียบร้อยเต็มลานกิจกรรม พร้อมเวทีคอนเสิร์ตและเสาไฟประดับสุดอลังการ',
  },
  {
    id: 'scene-high-angle-overview',
    title: 'ทัศนียภาพพาโนรามามุมสูง: ขบวนโต๊ะจีนทอดยาวจรดเวทีใหญ่',
    subtitle: 'มองเห็นภาพรวมงานเลี้ยงระดับมหกรรม พร้อมขบวนรถบริการและเต็นท์อำนวยการ',
    badge: '🌟 มุมสูงพาโนรามา',
    image: '/images/portfolio/work-mega-750tables-high-angle-overview.jpg',
    tables: '500 - 750 โต๊ะ',
    zone: 'ลานเวที & แดนซ์ฟลอร์',
    altitude: 'ความสูงโดรน 35 เมตร',
    description: 'ขบวนโต๊ะจีนผ้าคลุมสีน้ำเงินตัดโบว์ขาวสะอาดตา ทอดยาวจรดเวทีใหญ่ด้านหน้า พร้อมระบบเสียงและแสงสว่างรองรับงานเลี้ยงสังสรรค์ยามค่ำคืน',
  },
  {
    id: 'scene-blue-arena',
    title: 'โซนรอยัลบลู & เสาไฟส่องสว่างจัดเลี้ยงกลางแจ้ง',
    subtitle: 'โต๊ะจีนธีมสีน้ำเงินสง่างาม ผ้าคลุมเก้าอี้ขาวตัดโบว์น้ำเงินซาตินพรีเมียม',
    badge: '💙 ธีมรอยัลบลูพรีเมียม',
    image: '/images/portfolio/work-mega-750tables-blue-arena-hydrangea.jpg',
    tables: '300 โต๊ะ',
    zone: 'โซนกลางแจ้งเสาไฟประดับ',
    altitude: 'ความสูงโดรน 18 เมตร',
    description: 'การจัดวางโต๊ะจีนกลางแจ้งพร้อมแจกันดอกไฮเดรนเยียสีฟ้า-ขาว และชุดจานชามแก้วน้ำครบเซ็ตระดับภัตตาคาร 35 ปี',
  },
  {
    id: 'scene-blue-tower',
    title: 'ขบวนแถวโต๊ะจีนสุดสายตา & เสาไฟบานสปอตไลต์',
    subtitle: 'ความเป็นระเบียบเรียบร้อยระดับมืออาชีพ รองรับงานสัมมนาและงานเลี้ยงบริษัท',
    badge: '⚡ ความพร้อม 100%',
    image: '/images/portfolio/work-mega-750tables-blue-lighting-tower.jpg',
    tables: '400 โต๊ะ',
    zone: 'โซนเสาไฟประดับสายรุ้ง',
    altitude: 'ความสูงโดรน 20 เมตร',
    description: 'ขบวนแถวโต๊ะจีนจัดวางเว้นระยะทางเดินสะดวก เสิร์ฟอาหารร้อนได้รวดเร็วทันใจ พร้อมโครงสร้างเสาไฟส่องสว่างทั่วถึงทุกโต๊ะ',
  },
  {
    id: 'scene-vip-tableware',
    title: 'เซ็ตโต๊ะ VIP จานชามขอบทอง & แถวโต๊ะจีนทอดยาว',
    subtitle: 'ความประณีตระดับงานกาล่าดินเนอร์ จานชามขอบทอง แก้วไวน์ และผ้าซาติน',
    badge: '👑 เซ็ต VIP ขอบทอง',
    image: '/images/portfolio/work-mega-750tables-vip-gold-tableware.jpg',
    tables: 'VIP 50 โต๊ะ',
    zone: 'โซนประธาน & แขก VIP',
    altitude: 'ความสูงระดับสายตา (Eye-Level)',
    description: 'ชุดจานกังไสขอบทอง แก้วน้ำคริสตัล ช้อนส้อมสแตนเลสขัดเงา และดอกไม้สดประดับโต๊ะประธาน สวยงามสมเกียรติเจ้าภาพ',
  },
];

export const DroneAerialShowcase: React.FC<{ onOpenBuilder?: () => void }> = ({ onOpenBuilder }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanning, setIsPanning] = useState(true);
  const [simulatedAltitude, setSimulatedAltitude] = useState(45);
  const [simulatedSpeed, setSimulatedSpeed] = useState(1.4);

  const activeScene = DRONE_SCENES[currentSceneIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto drone flight scene rotation
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % DRONE_SCENES.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Altitude oscillation for drone simulation
  useEffect(() => {
    const altInterval = setInterval(() => {
      setSimulatedAltitude((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(30, Math.min(55, Math.round((prev + delta) * 10) / 10));
      });
      setSimulatedSpeed((prev) => {
        const delta = (Math.random() - 0.5) * 0.3;
        return Math.max(0.8, Math.min(2.2, Math.round((prev + delta) * 10) / 10));
      });
    }, 1500);
    return () => clearInterval(altInterval);
  }, []);

  const handlePrev = () => {
    setCurrentSceneIndex((prev) => (prev > 0 ? prev - 1 : DRONE_SCENES.length - 1));
  };

  const handleNext = () => {
    setCurrentSceneIndex((prev) => (prev + 1) % DRONE_SCENES.length);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t-2 border-b-2 border-amber-400/50">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-amber-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* 🌟 SECTION HEADER: 750 TABLES/DAY CAPACITY & DRONE 4K */}
        {/* ========================================================================= */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/30 via-amber-500/30 to-blue-600/30 border border-amber-400/60 backdrop-blur-md shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider">
              🚁 4K DRONE AERIAL CINEMATIC • ถ่ายมุมสูงจากโดรน
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            ศักยภาพสูงสุด{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow-md">
              จัดงานได้ถึง 750 โต๊ะ/วัน
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium leading-relaxed">
            การันตีความพร้อมระดับประเทศ! รองรับแขกกว่า{' '}
            <strong className="text-amber-300 font-black">7,500 ท่าน</strong> ด้วยครัวสนามเคลื่อนที่ 30 สถานี ขบวนรถควบคุมอุณหภูมิกว่า 30 คัน และทีมงานมืออาชีพกว่า 300 ชีวิต เสิร์ฟร้อน สด สะอาด ตรงเวลา 100%
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🎬 4K DRONE AERIAL CINEMATIC PLAYER WITH INTERACTIVE HUD */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-slate-950 flex flex-col group">
          
          {/* Drone Video / Photo Viewport */}
          <div className="relative w-full h-[400px] sm:h-[540px] md:h-[620px] overflow-hidden bg-black flex items-center justify-center">
            
            {/* Main Drone Image with Cinematic Pan & Zoom Motion */}
            <img
              key={activeScene.id}
              src={activeScene.image}
              alt={activeScene.title}
              className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                isPlaying && isPanning ? 'scale-110 translate-y-[-2%]' : 'scale-100'
              }`}
            />

            {/* Protective Center Watermark */}
            <WatermarkOverlay size="lg" opacity={0.45} />

            {/* Top Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60 pointer-events-none" />

            {/* 🔴 Top Left: REC Status & Live Flight Telemetry */}
            <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="px-3 py-1 rounded-xl bg-red-600/90 backdrop-blur-md text-white font-black text-xs flex items-center gap-1.5 shadow-lg border border-red-400 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>REC 4K 60FPS</span>
              </div>

              <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-amber-300 font-bold text-xs border border-white/20 flex items-center gap-2 shadow-lg">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>ALT: {simulatedAltitude}m</span>
                <span className="text-white/40">|</span>
                <span>SPD: {simulatedSpeed} m/s</span>
              </div>
            </div>

            {/* 👑 Top Right: Mega Capacity Guarantee Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 border border-amber-300">
                <Award className="w-4 h-4 text-slate-950" />
                <span>รองรับ 750 โต๊ะ/วัน</span>
              </div>
            </div>

            {/* 🎯 Crosshair / Drone Camera Grid Overlay (Subtle) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-24 h-24 border border-white/40 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
              </div>
              <div className="absolute w-32 h-[1px] bg-white/30" />
              <div className="absolute h-32 w-[1px] bg-white/30" />
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/70 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-600 text-white flex items-center justify-center border-2 border-amber-400/80 shadow-2xl backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
              title="ฉากก่อนหน้า"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/70 hover:bg-gradient-to-r hover:from-red-600 hover:to-amber-600 text-white flex items-center justify-center border-2 border-amber-400/80 shadow-2xl backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
              title="ฉากถัดไป"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* 📋 Bottom Overlay: Scene Info Card */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-amber-400/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 text-xs font-black">
                    {activeScene.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400 text-xs font-bold">
                    👥 {activeScene.tables}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    📍 {activeScene.zone}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white leading-snug">
                  {activeScene.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal line-clamp-2">
                  {activeScene.description}
                </p>
              </div>

              {/* Controls & Quotation CTA */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
                  title={isPlaying ? 'หยุดบินชั่วคราว' : 'เริ่มบินต่อ'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-amber-300" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <a
                  href="#quotation"
                  onClick={(e) => {
                    if (onOpenBuilder) {
                      e.preventDefault();
                      onOpenBuilder();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 border border-amber-300 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>จองคิว 750 โต๊ะ</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* 🎛️ Bottom Thumbnail Strip Selector (All 5 Drone Scenes) */}
          <div className="p-3 bg-slate-900/95 border-t border-amber-400/30 grid grid-cols-5 gap-2 sm:gap-3">
            {DRONE_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setIsPlaying(false);
                }}
                className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer text-left group/btn ${
                  currentSceneIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-300 scale-102 shadow-lg'
                    : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                <img src={scene.image} alt={scene.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1 left-1 right-1 pointer-events-none">
                  <p className="text-[9px] sm:text-[11px] font-black text-white truncate">
                    {scene.badge.replace(/🚁|🌟|💙|⚡|👑/g, '').trim()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📊 4 PILLARS OF 750 TABLES CAPACITY (จุดเด่นความพร้อมระดับประเทศ) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-400/40 shadow-xl space-y-3 hover:border-amber-400 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Users className="w-6 h-6 text-slate-950" />
            </div>
            <h4 className="text-xl font-black text-white">750 โต๊ะ / วัน (7,500 ที่นั่ง)</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              ศักยภาพรองรับงานขนาดใหญ่ที่สุดในประเทศ บริหารจัดการพื้นที่อย่างเป็นระเบียบ สวยงามทุกมุมมอง
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-400/40 shadow-xl space-y-3 hover:border-amber-400 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black shadow-md">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-black text-white">30 ครัวสนามปรุงสุกสดใหม่</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              เทคนิคการปรุงสดหน้างาน 100% ด้วยเตาเร่งไฟแรง อาหารร้อนฉ่าพร้อมเสิร์ฟถึงทุกโต๊ะพร้อมกัน
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-400/40 shadow-xl space-y-3 hover:border-amber-400 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black shadow-md">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-black text-white">ขบวนรถขนส่งกว่า 30 คัน</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              รถบรรทุก 6 ล้อ และรถตู้ทึบควบคุมความเย็น รักษาความสดใหม่ของวัตถุดิบ 100% ส่งมอบทั่วไทย
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-400/40 shadow-xl space-y-3 hover:border-amber-400 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-black text-white">ประสบการณ์ 35 ปี ไร้ประวัติเสียหาย</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              ผ่านงานระดับ 100 - 750 โต๊ะ มาแล้วนับพันงาน การันตีรสชาติอร่อย สะอาด ตรงเวลา 100%
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
