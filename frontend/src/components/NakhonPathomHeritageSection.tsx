import React, { useState } from 'react';
import {
  Sparkles,
  UtensilsCrossed,
  Flame,
  ShieldCheck,
  Award,
  Crown,
  HeartHandshake,
  CheckCircle2,
  Maximize2,
  X,
  ArrowRight,
  MapPin,
  Clock,
  ChefHat,
  Film,
  Play,
  Video
} from 'lucide-react';
import { WatermarkOverlay } from './WatermarkOverlay';
import { HeritageVideoModal } from './HeritageVideoModal.js';

interface HeritageCard {
  id: string;
  badge: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  highlights: string[];
}

export const NakhonPathomHeritageSection: React.FC<{ onOpenBuilder?: () => void }> = ({ onOpenBuilder }) => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; desc: string } | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  const heritageCards: HeritageCard[] = [
    {
      id: 'landmark-heritage',
      badge: '🏛️ นครปฐม: เมืองหลวงโต๊ะจีนแห่งสยาม',
      badgeBg: 'from-amber-600 to-amber-700',
      title: 'สืบสานตำนานโต๊ะจีนคู่เมืองนครปฐมกว่า 35 ปี',
      subtitle: 'ศาสตร์และศิลป์แห่งการจัดเลี้ยงโต๊ะจีนมงคลต้นตำรับ',
      image: '/images/heritage/nakhonpathom-heritage-landmark.jpg',
      description: 'โต๊ะจีนรพีพัฒน์ ถือกำเนิดและเติบโตจากดินแดน "นครปฐม" เมืองหลวงโต๊ะจีนอันดับ 1 ของประเทศไทย เราสืบทอดสูตรอาหารโต๊ะจีนจักรพรรดิโบราณ ผสานความประณีตในการจัดเลี้ยง เพื่อส่งมอบความเป็นสิริมงคลและความประทับใจแด่เจ้าภาพในทุกโอกาสสำคัญ',
      highlights: [
        'ต้นกำเนิดสูตรความอร่อยแท้จากนครปฐม เมืองหลวงโต๊ะจีนแห่งประเทศไทย',
        'ผังจัดเลี้ยงโอ่อ่า สมเกียรติเจ้าภาพ พร้อมบริการผ้าคลุมเก้าอี้และโบว์ซาตินครบชุด',
        'รองรับงานเลี้ยงมงคลสมรส งานบวช งานองค์กร และงานระดับจังหวัดทั่วประเทศ',
        'การันตีความประทับใจจากเจ้าภาพและแขกผู้มีเกียรติกว่า 6,500 งาน'
      ]
    },
    {
      id: 'master-chef-wok',
      badge: '🔥 ศิลปะการปรุงสดหน้างาน (Wok Hei)',
      badgeBg: 'from-red-600 to-red-700',
      title: 'ควันกระทะเหล็กไฟแรง ปรุงสุกสดใหม่หน้างาน 100%',
      subtitle: 'ความร้อนฉ่าและรสชาติกลมกล่อมตามแบบฉบับภัตตาคาร 35 ปี',
      image: '/images/heritage/nakhonpathom-master-chef-wok.jpg',
      description: 'เอกลักษณ์ที่โดดเด่นที่สุดของโต๊ะจีนนครปฐมคือ "การปรุงสดหน้างานด้วยเตาเร่งไฟแรงสูง" อาหารทุกจานผ่านการผัดและเคี่ยวหม้อต่อหม้อ หอมกลิ่นควันกระทะเหล็ก (Wok Hei) เสิร์ฟร้อนๆ ถึงทุกโต๊ะพร้อมกัน ให้รสชาติที่สด อร่อย และมีชีวิตชีวาที่สุด',
      highlights: [
        'ครัวสนามเคลื่อนที่มาตรฐานสูง ปรุงสุกใหม่สดๆ หน้างาน 100%',
        'ควบคุมความอร่อยโดยทีมเชฟมืออาชีพและกุ๊กผู้เชี่ยวชาญประสบการณ์ 35 ปี',
        'วัตถุดิบคัดสดใหม่วันต่อวัน กุ้ง ปลากะพง ปู และเป็ดพะโล้เนื้อนุ่ม',
        'เสิร์ฟร้อนฉ่าพร้อมกันทุกโต๊ะ อาหารไม่ชืด ตรงตามกำหนดเวลา 100%'
      ]
    }
  ];

  const pillars = [
    {
      icon: Sparkles,
      title: 'วัตถุดิบคัดสดพรีเมียม',
      desc: 'คัดสรรกุ้งแม่น้ำตัวโต ปลากะพง 9 ขีดสดๆ กระเพาะปลาแท้ และเป็ดเนื้อนุ่มพิเศษวันต่อวัน',
      color: 'from-amber-500 to-amber-700',
    },
    {
      icon: Flame,
      title: 'สูตรซุปตุ๋นยาจีน 8 ชม.',
      desc: 'น้ำซุปหอมหวานกลมกล่อม เคี่ยวด้วยเครื่องยาจีนชั้นดีและเห็ดหอม ซดคล่องคอตลอดงาน',
      color: 'from-red-500 to-red-700',
    },
    {
      icon: Crown,
      title: 'ภาชนะกังไส & จานขอบทอง',
      desc: 'ชุดจานกังไส จานเปลสีแดงมงคล แก้วคริสตัลใสสะอาด ไร้คราบน้ำ ถูกสุขอนามัย 100%',
      color: 'from-amber-600 to-yellow-600',
    },
    {
      icon: HeartHandshake,
      title: 'บริการความอร่อยทั่วไทย',
      desc: 'ขบวนรถควบคุมความเย็นกว่า 30 คัน เดินทางเสิร์ฟความอร่อยถึงที่หมายตรงเวลาทั่วประเทศ',
      color: 'from-emerald-500 to-emerald-700',
    },
  ];

  return (
    <section id="heritage" className="py-16 md:py-24 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative overflow-hidden border-t-2 border-amber-300">
      
      {/* Background Decorative Auras */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-200/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* ========================================================================= */}
        {/* 🌟 SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/15 via-amber-500/20 to-red-600/15 border-2 border-amber-400/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-amber-900 tracking-wide uppercase">
              🏛️ NAKHON PATHOM CATERING HERITAGE • เมืองหลวงโต๊ะจีน
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            ต้นตำรับความอร่อยจาก{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-amber-600 to-red-800 drop-shadow-xs">
              นครปฐม
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl font-bold text-amber-900/90 leading-relaxed">
            สัมผัสรสชาติต้นตำรับโต๊ะจีนระดับตำนาน แห่งเมืองนครปฐม
          </p>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            สืบทอดศาสตร์และศิลป์แห่งการจัดเลี้ยงโต๊ะจีนสูตรจักรพรรดิกว่า 35 ปี จากนครปฐม เมืองหลวงโต๊ะจีนแห่งประเทศไทย ผสานวัตถุดิบคัดสดพรีเมียมและการปรุงสดด้วยไฟแรงควันกระทะ เสิร์ฟความอร่อยระดับภัตตาคารส่งตรงถึงงานของคุณทั่วประเทศ
          </p>

          {/* 🎬 Interactive Heritage Video Showcase Button */}
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2.5 transition-all transform hover:scale-105 border-2 border-amber-300 cursor-pointer animate-pulse"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5 text-white" />
              </div>
              <span>🎬 ชมคลิปวีดีโอประวัติ 35 ปี & ดาวน์โหลดสำหรับโพสต์ลงเพจ</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🖼️ 2 MAIN HERITAGE CARDS (LANDMARK & MASTER CHEF WOK HEI) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {heritageCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl hover:shadow-2xl hover:border-amber-500 transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-1"
            >
              {/* Image Viewport (16:9) with Watermark Overlay & Hover Zoom */}
              <div
                className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => setSelectedImage({ src: card.image, title: card.title, desc: card.description })}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Protective Center Watermark */}
                <WatermarkOverlay size="md" opacity={0.4} />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`px-3.5 py-1.5 rounded-xl bg-gradient-to-r ${card.badgeBg} text-white text-xs font-black shadow-lg border border-white/20`}>
                    {card.badge}
                  </div>
                </div>

                {/* Hover Click to Expand */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-amber-400 text-amber-300 text-xs font-black flex items-center gap-2 shadow-2xl">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>คลิกเพื่อดูภาพขนาดใหญ่</span>
                  </div>
                </div>
              </div>

              {/* Text Description Body */}
              <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/20">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-black text-amber-700 tracking-wide">
                      {card.subtitle}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-red-700 transition-colors leading-snug mt-1">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Highlight Checkmarks List */}
                <div className="pt-4 border-t border-amber-100 space-y-2">
                  {card.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 🏛️ 4 PILLARS OF NAKHON PATHOM CULINARY EXCELLENCE */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-slate-950 text-white border-2 border-amber-400 shadow-2xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>4 หัวใจสำคัญแห่งตำนานความอร่อย</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              มาตรฐานโต๊ะจีนนครปฐม 35 ปี ที่เจ้าภาพไว้วางใจ
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-white/10 transition-all duration-300 space-y-3 shadow-inner group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-black text-amber-300">{pillar.title}</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Ribbon */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-sm font-black text-white">
                พร้อมสัมผัสรสชาติต้นตำรับโต๊ะจีนระดับตำนาน แห่งเมืองนครปฐมในงานของคุณ?
              </div>
              <div className="text-xs text-amber-300 font-medium">
                เริ่มต้นเพียง 1,500 บาท/โต๊ะ • ฟรีค่าเดินทางในระยะที่กำหนด
              </div>
            </div>

            <a
              href="#quotation"
              onClick={(e) => {
                if (onOpenBuilder) {
                  e.preventDefault();
                  onOpenBuilder();
                }
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl flex items-center gap-2 border border-amber-300 transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <span>คำนวณราคา & จองคิวงาน</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🖼️ FULL RESOLUTION LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-950 rounded-3xl border-2 border-amber-400 overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white border border-amber-300 shadow-md">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    ต้นตำรับความอร่อยจากนครปฐม • โต๊ะจีนรพีพัฒน์
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-2 min-h-[350px] sm:min-h-[480px]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[65vh] object-contain rounded-2xl border border-amber-400/40"
              />
              <WatermarkOverlay size="lg" opacity={0.45} />
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <p className="text-slate-300 font-medium text-center sm:text-left line-clamp-2 max-w-2xl">
                {selectedImage.desc}
              </p>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black shadow-lg border border-amber-300 shrink-0 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎬 OFFICIAL HERITAGE VIDEO MODAL & EXPORT SUITE */}
      {/* ========================================================================= */}
      <HeritageVideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

    </section>
  );
};
