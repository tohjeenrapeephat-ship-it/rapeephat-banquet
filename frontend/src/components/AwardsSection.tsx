import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Tv,
  Star,
  CheckCircle2,
  Sparkles,
  Maximize2,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AwardItem {
  id: string;
  image: string;
  badge: string;
  badgeColor: string;
  title: string;
  organization: string;
  year: string;
  highlight: string;
  description: string;
  tags: string[];
}

const AWARDS_DATA: AwardItem[] = [
  {
    id: 'award-np-champion',
    image: '/images/awards/award-nakhonpathom-champion.jpg',
    badge: '🏆 รางวัลชนะเลิศอันดับ 1',
    badgeColor: 'from-amber-600 to-amber-700',
    title: 'รางวัลชนะเลิศอันดับ 1 สุดยอดโต๊ะจีนอาหารอร่อย จ.นครปฐม',
    organization: 'สมาคมผู้ประกอบการโต๊ะจีน & จังหวัดนครปฐม (เมืองหลวงโต๊ะจีนแห่งประเทศไทย)',
    year: 'ประจำปี 2567',
    highlight: 'ถ้วยเกียรติยศทองคำแท้ & ใบประกาศเกียรติคุณชนะเลิศอันดับ 1',
    description: 'ชนะเลิศการประกวดสุดยอดโต๊ะจีนอาหารอร่อยแห่งนครปฐม ด้วยคะแนนเอกฉันท์จากคณะกรรมการผู้ทรงคุณวุฒิ ด้านรสชาติตำรับดั้งเดิม ความสดใหม่ของวัตถุดิบ ความสะอาด และความประณีตในการจัดเซ็ตโต๊ะ',
    tags: ['ชนะเลิศอันดับ 1', 'นครปฐมเมืองโต๊ะจีน', 'รสชาติยอดเยี่ยม 100%'],
  },
  {
    id: 'award-tv-battle',
    image: '/images/awards/award-tv-cooking-battle.jpg',
    badge: '📺 แชมป์รายการทีวีระดับประเทศ',
    badgeColor: 'from-red-600 to-red-800',
    title: 'แชมป์ชนะเลิศการแข่งขันทำอาหาร รายการทีวีชื่อดัง (TV Cooking Battle)',
    organization: 'รายการแข่งขันทำอาหารและการประชันเชฟชื่อดังทางโทรทัศน์',
    year: 'CHAMPION FINALS',
    highlight: 'คว้าถ้วยแชมป์ทองคำ 1st Place Champion & เหรียญทองเกียรติยศ',
    description: 'เชฟใหญ่โต๊ะจีนรพีพัฒน์ประชันฝีมือปรุงสดหน้ากล้องในสตูดิโอทีวี ด้วยเมนูซิกเนเจอร์ "เป็ดย่างฮ่องกงหนังกรอบ" และ "หูฉลามน้ำแดงเนื้อปูก้อน" คว้าชัยชนะอันดับ 1 จากกรรมการเชฟระดับประเทศ',
    tags: ['1st Place Champion', 'ออกอากาศทั่วประเทศ', 'เชฟกระทะทอง'],
  },
  {
    id: 'award-national-grand',
    image: '/images/awards/award-national-grand-medal.jpg',
    badge: '🥇 เหรียญทองเกียรติยศระดับประเทศ',
    badgeColor: 'from-amber-600 to-amber-800',
    title: 'เหรียญทองเกียรติยศ สุดยอดผู้เชี่ยวชาญโต๊ะจีนแห่งสยาม (Grand Master)',
    organization: 'สมาพันธ์การจัดเลี้ยงและอาหารไทย-จีนแห่งประเทศไทย',
    year: 'แห่งชาติ',
    highlight: 'เหรียญทองคำมงคล 24K & โล่เกียรติคุณไม้พรีเมียม',
    description: 'การันตีมาตรฐานการบริการจัดเลี้ยงครัวสัญจร ปรุงสุกสดหน้างาน 100% พร้อมสุขอนามัยระดับภัตตาคาร และความไว้วางใจจากเจ้าภาพกว่า 6,500 งานทั่ว 77 จังหวัด',
    tags: ['Grand Master Award', 'มาตรฐาน 35 ปี', 'ครัวสัญจรสดใหม่'],
  },
  {
    id: 'award-tv-broadcast',
    image: '/images/awards/award-tv-broadcast-shield.jpg',
    badge: '🎖️ โล่เกียรติคุณโทรทัศน์',
    badgeColor: 'from-red-700 to-amber-700',
    title: 'โล่เกียรติคุณยอดเยี่ยม รายการโทรทัศน์ (Premier Culinary Broadcast)',
    organization: 'สมาคมผู้สื่อข่าวบันเทิง-อาหารและสื่อโทรทัศน์ชั้นนำ',
    year: 'BROADCAST EXCELLENCE',
    highlight: 'โล่ทองคำสัญลักษณ์เชฟยอดเยี่ยม (Outstanding Chef Award)',
    description: 'ได้รับเชิญถ่ายทอดสูตรความอร่อยตำรับโต๊ะจีนโบราณ 35 ปี ผ่านรายการอาหารยอดนิยมทางทีวีหลากหลายช่อง เพื่อส่งต่อความอร่อยระดับตำนานสู่สายตาผู้ชมทั่วประเทศ',
    tags: ['รายการอาหารยอดนิยม', 'การันตีสื่อทีวี', 'สูตรลับ 35 ปี'],
  },
];

export const AwardsSection: React.FC = () => {
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);

  const tvChannels = [
    { name: 'ช่อง 3 HD', desc: 'รายการอาหารชื่อดัง' },
    { name: 'ช่อง 7HD', desc: 'รายการวาไรตี้จัดเลี้ยง' },
    { name: 'ช่อง One31', desc: 'แนะนำร้านเด็ดทั่วไทย' },
    { name: 'ไทยรัฐทีวี 32', desc: 'เจาะลึกโต๊ะจีนนครปฐม' },
    { name: 'Workpoint 23', desc: 'ศึกชิงแชมป์เมนูโต๊ะจีน' },
    { name: 'Amarin TV 34', desc: 'สุดยอดอาหารจัดเลี้ยง' },
  ];

  return (
    <section id="awards" className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/40 to-white overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>HALL OF FAME & PRESTIGIOUS AWARDS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            การันตีความอร่อยระดับแชมป์
            <span className="block mt-1.5 text-gradient-red-gold">
              รางวัลชนะเลิศ จ.นครปฐม & แชมป์รายการทีวี
            </span>
          </h2>

          <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
            ตอกย้ำมาตรฐานภัตตาคาร 35 ปี ด้วย<strong className="text-red-700 font-black">ถ้วยรางวัลชนะเลิศอันดับ 1 สุดยอดโต๊ะจีนอาหารอร่อย จ.นครปฐม</strong> (เมืองหลวงโต๊ะจีนแห่งประเทศไทย) และ<strong className="text-amber-800 font-black">แชมป์การแข่งขันทำอาหารในรายการโทรทัศน์ระดับประเทศ</strong>
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 4 PRESTIGIOUS AWARDS CARDS GRID */}
        {/* ========================================================================= */}
        <div className="grid md:grid-cols-2 gap-8">
          {AWARDS_DATA.map((award) => (
            <div
              key={award.id}
              onClick={() => setSelectedAward(award)}
              className="bg-white rounded-3xl border-2 border-amber-300 hover:border-amber-500 shadow-lg shadow-amber-900/5 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer transform hover:-translate-y-1.5 ring-1 ring-amber-200/50"
            >
              {/* Photo Area with Gold Frame & Tags */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-950">
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className={`px-3.5 py-1.5 rounded-full bg-gradient-to-r ${award.badgeColor} text-white font-black text-xs shadow-md border border-amber-300/80 flex items-center gap-1.5`}>
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>{award.badge}</span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-black border border-white/20">
                    {award.year}
                  </span>
                </div>

                {/* Hover Click To View Prompt */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-amber-300 text-white text-xs font-black flex items-center gap-2 shadow-xl">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                    <span>คลิกเพื่อดูภาพถ้วยรางวัลขนาดใหญ่</span>
                  </div>
                </div>

                {/* Bottom Highlight on Photo */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span className="truncate">{award.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Text Description Body */}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-red-700 transition-colors leading-tight">
                    {award.title}
                  </h3>

                  <div className="text-xs font-bold text-amber-800 flex items-start gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{award.organization}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {award.description}
                  </p>
                </div>

                {/* Tag Pills & Action */}
                <div className="pt-4 border-t border-amber-100 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {award.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[10.5px] font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-black text-red-700 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>ดูรายละเอียด</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 📺 TV BROADCAST & MEDIA COVERAGE BANNER */}
        {/* ========================================================================= */}
        <div className="mt-14 p-7 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: TV Title */}
            <div className="lg:col-span-4 space-y-1.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-300/40">
                <Tv className="w-3.5 h-3.5 text-amber-300" />
                <span>AS SEEN ON TELEVISION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                การันตีผลงานผ่านรายการทีวีชั้นนำ
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                ได้รับเชิญออกรายการโทรทัศน์และแข่งขันทำอาหารทั่วประเทศ
              </p>
            </div>

            {/* Right: TV Channels Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tvChannels.map((channel, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-300/40 text-center space-y-1 hover:bg-white/20 transition-colors"
                >
                  <div className="text-sm font-black text-amber-300">{channel.name}</div>
                  <div className="text-[10.5px] text-slate-200 font-medium leading-tight">{channel.desc}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🖼️ AWARDS FULL RESOLUTION LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedAward && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedAward(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border-2 border-amber-400 overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white border border-amber-300 shadow-md">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>{selectedAward.title}</span>
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {selectedAward.organization} • {selectedAward.year}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAward(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Body */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-3 min-h-[350px] sm:min-h-[480px]">
              <img
                src={selectedAward.image}
                alt={selectedAward.title}
                className="max-w-full max-h-[60vh] object-contain rounded-2xl border border-amber-400/40"
              />
            </div>

            {/* Footer Detail */}
            <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-slate-300 font-medium text-center sm:text-left space-y-1">
                <div className="text-amber-300 font-black text-sm">{selectedAward.highlight}</div>
                <p className="text-slate-400 text-xs">{selectedAward.description}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAward(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black shadow-red-glow border border-amber-300 shrink-0"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
