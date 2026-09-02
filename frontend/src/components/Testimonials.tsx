import React, { useState } from 'react';
import {
  Star,
  Quote,
  Award,
  CheckCircle,
  Crown,
  ThumbsUp,
  Cake,
  HeartHandshake,
  Home,
  GraduationCap,
  PartyPopper,
  Sparkles,
  MapPin,
  Flame,
  Check,
  BadgeCheck,
  ChevronRight,
  QrCode
} from 'lucide-react';
import { GoogleReviewCard } from './GoogleReviewCard.js';

interface CeremonyReview {
  id: string;
  ceremonyType: 'birthday' | 'ordination' | 'housewarming' | 'wedding' | 'graduation' | 'reunion';
  ceremonyName: string;
  ceremonyBadge: string;
  ceremonyIcon: React.ElementType;
  name: string;
  role: string;
  location: string;
  tableCount: string;
  package: string;
  rating: number;
  thumbsUpCount: string;
  thumbsUpHighlight: string;
  favoriteDishes: string[];
  comment: string;
  date: string;
  bgAccent: string;
  borderAccent: string;
  textAccent: string;
}

const CEREMONY_REVIEWS: CeremonyReview[] = [
  // 🎂 1. งานเลี้ยงวันเกิด
  {
    id: 'rev-birthday',
    ceremonyType: 'birthday',
    ceremonyName: 'งานเลี้ยงวันเกิด 🎂',
    ceremonyBadge: 'งานฉลองวันเกิดครบรอบ 60 ปี',
    ceremonyIcon: Cake,
    name: 'คุณธีรศักดิ์ & ครอบครัว',
    role: 'เจ้าภาพงานวันเกิดคุณแม่',
    location: 'อ.บางกรวย จ.นนทบุรี',
    tableCount: '20 โต๊ะ (ฟรี 1 โต๊ะ)',
    package: 'แพ็กเกจยอดนิยม ฿1,700 / โต๊ะ',
    rating: 5,
    thumbsUpCount: '👍 แขก 200+ ท่าน ยกนิ้วโป้งให้ 100%',
    thumbsUpHighlight: 'ปลากะพงทอดน้ำปลาตัวใหญ่กรอบนอกนุ่มใน น้ำจิ้มซีฟู้ดรสเด็ด แขกยกนิ้วโป้งชมไม่หยุด',
    favoriteDishes: ['ปลากะพงทอดน้ำปลา', 'ออเดิร์ฟ 5 อย่าง', 'แกงส้มชะอมกุ้งสด', 'ข้าวผัดปู'],
    comment: 'จัดงานวันเกิดครบรอบ 60 ปีให้คุณแม่ แขกและญาติๆ ทุกคนยกนิ้วโป้งให้เลยครับ 👍 โดยเฉพาะปลากะพงทอดน้ำปลาตัวใหญ่กรอบนอกนุ่มใน น้ำจิ้มซีฟู้ดรสเด็ด อาหารออกร้อนๆ ทุกจาน โต๊ะเก้าอี้ผูกโบว์สีชมพูหวานเข้ากับบรรยากาศ คุณแม่มีความสุขและประทับใจมากครับ',
    date: 'กุมภาพันธ์ 2569',
    bgAccent: 'from-pink-50 via-white to-amber-50/40',
    borderAccent: 'border-pink-300',
    textAccent: 'text-pink-700',
  },

  // 📿 2. งานบวช / งานอุปสมบท
  {
    id: 'rev-ordination',
    ceremonyType: 'ordination',
    ceremonyName: 'งานบวช / อุปสมบท 📿',
    ceremonyBadge: 'งานอุปสมบท ณ วัดใหญ่',
    ceremonyIcon: HeartHandshake,
    name: 'โยมพ่อสมชาย & โยมแม่สุมาลี วัฒนศิริ',
    role: 'เจ้าภาพงานอุปสมบทลูกชาย',
    location: 'อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา',
    tableCount: '45 โต๊ะ (ฟรี 2 โต๊ะ)',
    package: 'แพ็กเกจมงคลสมบูรณ์ ฿2,200 / โต๊ะ',
    rating: 5,
    thumbsUpCount: '👍 แขก 450+ ท่าน ยกนิ้วโป้งให้ทั้งตำบล',
    thumbsUpHighlight: 'กระเพาะปลาน้ำแดงเนื้อปูแน่นๆ ขาหมูยอดผักนุ่มละลาย เสิร์ฟร้อนควันฉุยทั้ง 45 โต๊ะ',
    favoriteDishes: ['กระเพาะปลาน้ำแดงเนื้อปู', 'ขาหมูยอดผัก', 'ปลากะพงนึ่งซีอิ๊ว', 'บัวลอยน้ำขิง'],
    comment: 'งานบวชลูกชายจัดเลี้ยงโต๊ะจีน 45 โต๊ะ แขกผู้ใหญ่และชาวบ้านยกนิ้วโป้งให้ทั้งตำบล 👍 อาหารเสิร์ฟต่อเนื่อง ร้อนควันฉุย กระเพาะปลาน้ำแดงเนื้อปูแน่นๆ ขาหมูยอดผักนุ่มละลาย ทีมงานตั้งโต๊ะตรงเป๊ะเป็นระเบียบ เจ้าภาพได้รับคำชมตลอดงานครับ',
    date: 'มกราคม 2569',
    bgAccent: 'from-amber-50 via-white to-orange-50/40',
    borderAccent: 'border-amber-400',
    textAccent: 'text-amber-800',
  },

  // 🏡 3. งานขึ้นบ้านใหม่
  {
    id: 'rev-housewarming',
    ceremonyType: 'housewarming',
    ceremonyName: 'งานขึ้นบ้านใหม่ 🏡',
    ceremonyBadge: 'งานทำบุญขึ้นบ้านใหม่สิริมงคล',
    ceremonyIcon: Home,
    name: 'คุณวิชัย & คุณนฤมล รัตนโชติ',
    role: 'เจ้าภาพทำบุญบ้านใหม่',
    location: 'อ.คลองหลวง จ.ปทุมธานี',
    tableCount: '25 โต๊ะ (ฟรี 1 โต๊ะ)',
    package: 'แพ็กเกจพรีเมียมจัดเลี้ยง ฿3,000 / โต๊ะ',
    rating: 5,
    thumbsUpCount: '👍 แขก 250+ ท่าน ยกนิ้วโป้งให้ความคุ้มค่า',
    thumbsUpHighlight: 'เป็ดย่างน้ำผึ้งฮ่องกงกับต้มยำกุ้งแม่น้ำหม้อไฟ เชฟปรุงสดหน้างานควันฉุย 5 ดาว',
    favoriteDishes: ['เป็ดย่างน้ำผึ้งฮ่องกง', 'ต้มยำกุ้งแม่น้ำหม้อไฟ', 'ปลากะพงนึ่งมะนาว', 'แปะก๊วยนมสด'],
    comment: 'ทำบุญขึ้นบ้านใหม่ สั่ง 25 โต๊ะ ได้โต๊ะแถมฟรี 1 โต๊ะ คุ้มค่ามากครับ 👍 แขกยกนิ้วโป้งให้เป็ดย่างน้ำผึ้งฮ่องกงกับต้มยำกุ้งแม่น้ำหม้อไฟ รสจัดจ้านถึงใจ เชฟมาปรุงสดหน้างานควันฉุย เจ้าภาพไม่ต้องเหนื่อยเตรียมอะไรเลย มีอุปกรณ์ครบทุกอย่าง แนะนำเลยครับ',
    date: 'มกราคม 2569',
    bgAccent: 'from-emerald-50 via-white to-teal-50/40',
    borderAccent: 'border-emerald-300',
    textAccent: 'text-emerald-800',
  },

  // 💍 4. งานแต่งงาน / งานมงคลสมรส
  {
    id: 'rev-wedding',
    ceremonyType: 'wedding',
    ceremonyName: 'งานแต่งงาน 💍',
    ceremonyBadge: 'งานฉลองมงคลสมรสหรูหรา',
    ceremonyIcon: Crown,
    name: 'คุณธนภัทร & คุณพิมพ์ลดา อัครเดโช',
    role: 'คู่บ่าวสาว',
    location: 'หอประชุมใหญ่ จ.นครปฐม',
    tableCount: '60 โต๊ะ (ฟรี 3 โต๊ะ)',
    package: 'แพ็กเกจจักรพรรดิ VIP ฿5,000 / โต๊ะ',
    rating: 5,
    thumbsUpCount: '👍 แขก 600+ ท่าน ยกนิ้วโป้งชื่นชมทั้งงาน',
    thumbsUpHighlight: 'ขาหมูเยอรมันทอดกรอบ & หูฉลามน้ำแดงปูก้อน อร่อยที่สุดเท่าที่เคยกินโต๊ะจีนมา',
    favoriteDishes: ['หูฉลามน้ำแดงปูก้อน', 'ขาหมูเยอรมันทอดกรอบ', 'เป็ดปักกิ่ง', 'ข้าวผัดปูก้อน'],
    comment: 'งานแต่งงานของเรา เลือกแพ็กเกจจักรพรรดิ VIP แขกในงานกว่า 600 ท่าน ยกนิ้วโป้งชื่นชมทั้งงาน 👍 ขาหมูเยอรมันทอดกรอบกับหูฉลามน้ำแดงปูก้อนระดับภัตตาคารหรู แขกบอกว่าอร่อยที่สุดเท่าที่เคยกินโต๊ะจีนมา โต๊ะเก้าอี้ผูกโบว์ทองหรูหราสมเกียรติมากครับ',
    date: 'ธันวาคม 2568',
    bgAccent: 'from-amber-100/60 via-white to-red-50/40',
    borderAccent: 'border-amber-400 ring-1 ring-amber-300/60',
    textAccent: 'text-red-700',
  },

  // 🎓 5. งานรับปริญญา
  {
    id: 'rev-graduation',
    ceremonyType: 'graduation',
    ceremonyName: 'งานรับปริญญา 🎓',
    ceremonyBadge: 'งานฉลองบัณฑิตเกียรตินิยม',
    ceremonyIcon: GraduationCap,
    name: 'น้องแพรวา & ครอบครัวสิริโภคิน',
    role: 'บัณฑิตใหม่ & เจ้าภาพ',
    location: 'เขตจตุจักร กรุงเทพมหานคร',
    tableCount: '15 โต๊ะ',
    package: 'แพ็กเกจยอดนิยม ฿1,700 / โต๊ะ',
    rating: 5,
    thumbsUpCount: '👍 อาจารย์ & เพื่อนๆ ยกนิ้วโป้งให้ 100%',
    thumbsUpHighlight: 'สลัดกุ้งทอดผลไม้สดกรอบอร่อย ยำสามกรอบรสเด็ด และโอวนี้แปะก๊วยหวานละมุน',
    favoriteDishes: ['สลัดกุ้งทอดผลไม้สด', 'ยำสามกรอบ', 'ต้มยำโป๊ะแตก', 'โอวนี้แปะก๊วย'],
    comment: 'งานฉลองรับปริญญาของลูกสาว จัดที่บ้าน 15 โต๊ะ บรรยากาศอบอุ่น แขกเพื่อนๆ และอาจารย์ยกนิ้วโป้งให้รสชาติอาหารระดับ 5 ดาว 👍 สลัดกุ้งทอดผลไม้สดกรอบอร่อย ยำสามกรอบรสเด็ด และโอวนี้แปะก๊วยหวานละมุน ทีมงานสุภาพประทับใจมากค่ะ',
    date: 'พฤศจิกายน 2568',
    bgAccent: 'from-blue-50 via-white to-indigo-50/40',
    borderAccent: 'border-blue-300',
    textAccent: 'text-blue-700',
  },

  // 🎉 6. งานสังสรรค์ / เลี้ยงรุ่น / ประจำปี
  {
    id: 'rev-reunion',
    ceremonyType: 'reunion',
    ceremonyName: 'งานสังสรรค์ 🎉',
    ceremonyBadge: 'งานเลี้ยงสังสรรค์ประจำปี & เลี้ยงรุ่น',
    ceremonyIcon: PartyPopper,
    name: 'ชมรมศิษย์เก่าวิศวะฯ & สมาคมผู้ประกอบการ',
    role: 'คณะกรรมการจัดงาน',
    location: 'สนามกีฬา & ลานจัดเลี้ยง จ.สุพรรณบุรี',
    tableCount: '80 โต๊ะ (ฟรี 4 โต๊ะ)',
    package: 'แพ็กเกจมงคลสมบูรณ์ ฿2,200 / โต๊ะ',
    rating: 5,
    thumbsUpCount: '👍 สมาชิก 800+ ท่าน ยกนิ้วโป้งให้ความเป๊ะ',
    thumbsUpHighlight: 'อาหารออกตรงเวลา ร้อนๆ ทุกจานแม้โต๊ะจะเยอะมาก หอยจ๊อปูเนื้อแน่น เป็ดพะโล้นุ่ม',
    favoriteDishes: ['หอยจ๊อปูก้อน', 'เป็ดพะโล้ทรงเครื่อง', 'ขาหมูน้ำแดงหมั่นโถว', 'แกงส้มชะอมกุ้ง'],
    comment: 'จัดงานเลี้ยงสังสรรค์ประจำปี 80 โต๊ะ สมาชิกทุกคนยกนิ้วโป้งให้ความเป๊ะ 👍 อาหารออกตรงเวลา ร้อนๆ ทุกจานแม้โต๊ะจะเยอะมาก หอยจ๊อปูเนื้อแน่น เป็ดพะโล้ทรงเครื่องเนื้อนุ่ม อร่อยจุใจ มีใบเสร็จออกใบกำกับภาษีเรียบร้อย บริการระดับมืออาชีพ 35 ปีครับ',
    date: 'ตุลาคม 2568',
    bgAccent: 'from-purple-50 via-white to-amber-50/40',
    borderAccent: 'border-purple-300',
    textAccent: 'text-purple-700',
  },
];

export const Testimonials: React.FC = () => {
  const [selectedCeremony, setSelectedCeremony] = useState<string>('all');

  const filteredReviews = CEREMONY_REVIEWS.filter((item) => {
    return selectedCeremony === 'all' || item.ceremonyType === selectedCeremony;
  });

  return (
    <section id="testimonials" className="py-20 relative border-t-2 border-amber-300/80 bg-gradient-to-b from-white via-amber-50/25 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* Section Header */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border-2 border-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <ThumbsUp className="w-4 h-4 text-red-600 fill-red-600 animate-bounce" />
            <span>GUEST SATISFACTION & REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            รีวิวจากเจ้าภาพ & แขกในงาน
            <span className="block mt-1 text-gradient-red-gold">
              ยกนิ้วโป้งการันตีความอร่อย ในทุกงานพิธี 👍
            </span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium">
            เสียงตอบรับจริงจากเจ้าภาพและแขกผู้มีเกียรติกว่า 6,500 งานทั่วประเทศ ทั้งงานวันเกิด, งานบวช, งานขึ้นบ้านใหม่, งานแต่งงาน, งานรับปริญญา และงานสังสรรค์
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 👍 1. GUEST THUMBS-UP HIGHLIGHT METRICS BANNER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 via-red-800 to-slate-900 text-white shadow-2xl border-2 border-amber-300">
          
          <div className="flex flex-col items-center text-center space-y-1 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-amber-300/30">
            <div className="flex items-center gap-1.5 text-amber-300">
              <ThumbsUp className="w-5 h-5 fill-amber-300 text-amber-300" />
              <span className="text-2xl sm:text-3xl font-black">99.8%</span>
            </div>
            <div className="text-xs font-black text-white">แขกในงานยกนิ้วโป้งให้</div>
            <div className="text-[10.5px] text-amber-200/90 font-medium">รสชาติอร่อยระดับภัตตาคาร</div>
          </div>

          <div className="flex flex-col items-center text-center space-y-1 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-amber-300/30">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-5 h-5 text-amber-300" />
              <span className="text-2xl sm:text-3xl font-black">100%</span>
            </div>
            <div className="text-xs font-black text-white">ปรุงสดเสิร์ฟร้อนหน้างาน</div>
            <div className="text-[10.5px] text-amber-200/90 font-medium">ควันฉุยตรงเวลาทุกโต๊ะ</div>
          </div>

          <div className="flex flex-col items-center text-center space-y-1 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-amber-300/30">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Award className="w-5 h-5 text-amber-300" />
              <span className="text-2xl sm:text-3xl font-black">6,500+</span>
            </div>
            <div className="text-xs font-black text-white">งานจัดเลี้ยงทั่วประเทศ</div>
            <div className="text-[10.5px] text-amber-200/90 font-medium">ประสบการณ์ยาวนาน 35 ปี</div>
          </div>

          <div className="flex flex-col items-center text-center space-y-1 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-amber-300/30">
            <div className="flex items-center gap-1 text-amber-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <div className="text-xs font-black text-white">5.0 / 5.0 เต็ม</div>
            <div className="text-[10.5px] text-amber-200/90 font-medium">คะแนนรีวิวสูงสุดจากเจ้าภาพ</div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 🎭 2. CEREMONY FILTER TABS (งานวันเกิด, งานบวช, งานขึ้นบ้านใหม่, งานแต่งงาน, งานรับปริญญา, งานสังสรรค์) */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-3xl bg-white/80 backdrop-blur-md border-2 border-amber-300 shadow-lg">
          {[
            { id: 'all', name: '✨ ดูทุกงานพิธี', icon: Sparkles, count: CEREMONY_REVIEWS.length },
            { id: 'birthday', name: '🎂 งานเลี้ยงวันเกิด', icon: Cake, count: 1 },
            { id: 'ordination', name: '📿 งานบวช / อุปสมบท', icon: HeartHandshake, count: 1 },
            { id: 'housewarming', name: '🏡 งานขึ้นบ้านใหม่', icon: Home, count: 1 },
            { id: 'wedding', name: '💍 งานแต่งงาน', icon: Crown, count: 1 },
            { id: 'graduation', name: '🎓 งานรับปริญญา', icon: GraduationCap, count: 1 },
            { id: 'reunion', name: '🎉 งานสังสรรค์', icon: PartyPopper, count: 1 },
          ].map((tab) => {
            const isActive = selectedCeremony === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCeremony(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md border-2 border-amber-300 ring-2 ring-amber-300/40 scale-103'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-2 border-slate-200 hover:border-amber-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-600'}`} />
                <span>{tab.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 🏆 3. REVIEWS GRID WITH PROMINENT GUEST THUMBS-UP BADGES */}
        {/* ========================================================================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReviews.map((rev) => {
            const CeremonyIcon = rev.ceremonyIcon;
            return (
              <div
                key={rev.id}
                className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${rev.bgAccent} border-2 ${rev.borderAccent} shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 relative group hover:-translate-y-1.5`}
              >
                <Quote className="w-10 h-10 text-amber-300/40 absolute top-5 right-5 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  
                  {/* Ceremony Header Badge & Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 text-slate-900 text-xs font-black shadow-2xs flex items-center gap-1.5">
                      <CeremonyIcon className="w-3.5 h-3.5 text-red-600" />
                      <span>{rev.ceremonyName}</span>
                    </span>

                    {/* 5 Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* 👍 PROMINENT GUEST THUMBS-UP BANNER */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md border border-amber-300 flex items-center gap-2.5 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                      <ThumbsUp className="w-4 h-4 fill-white" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-black tracking-wide text-slate-950">
                        {rev.thumbsUpCount}
                      </div>
                      <div className="text-[10px] font-bold text-red-950 truncate max-w-[210px]">
                        {rev.thumbsUpHighlight}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-1">
                    "{rev.comment}"
                  </p>

                  {/* Favorite Dishes Highlight Tags */}
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>เมนูที่แขกยกนิ้วโป้งชมมากที่สุด:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rev.favoriteDishes.map((dish, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-white/80 border border-amber-200 text-[11px] font-bold text-slate-800 shadow-2xs"
                        >
                          ✨ {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Footer: Host Name, Ceremony Scale & Location */}
                <div className="pt-4 border-t border-amber-200/80 flex flex-col space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </h4>
                      <div className="text-[11px] text-slate-600 font-bold">{rev.role}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{rev.date}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-600" />
                      <span>{rev.location}</span>
                    </span>
                    <span className="font-black text-red-700">{rev.tableCount}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ⭐ GOOGLE MAPS & GOOGLE MY BUSINESS REVIEW QR CODE CARD */}
        {/* ========================================================================= */}
        <GoogleReviewCard />

        {/* ========================================================================= */}
        {/* 🎁 FREE TABLE PROMOTION CTA BANNER */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-2xl border-2 border-amber-300 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner border border-amber-300">
              <ThumbsUp className="w-8 h-8 text-amber-300 fill-amber-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-black">
                การันตีความอร่อย ให้แขกในงานของคุณยกนิ้วโป้งชื่นชม 100%!
              </h4>
              <p className="text-xs sm:text-sm text-red-100 font-medium">
                โปรโมชั่นจัดเลี้ยงพิเศษ: สั่งทุก 20 โต๊ะ แถมฟรี 1 โต๊ะทันที พร้อมฟรีอุปกรณ์ โต๊ะ เก้าอี้ และผ้าคลุมผูกโบว์ครบชุด
              </p>
            </div>
          </div>

          <a
            href="#quotation-builder"
            className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shrink-0 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-amber-200"
          >
            <span>คำนวณราคา & ออกใบเสนอราคาออนไลน์</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
