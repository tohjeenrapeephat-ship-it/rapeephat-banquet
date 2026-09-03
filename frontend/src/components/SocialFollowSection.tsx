import React, { useState } from 'react';
import {
  Users,
  ThumbsUp,
  Heart,
  Share2,
  Sparkles,
  Flame,
  Award,
  Crown,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Play,
  Gift,
  Star,
  Bell,
  TrendingUp,
  Video
} from 'lucide-react';
import { GoogleReviewModal, DEFAULT_GOOGLE_REVIEW_URL } from './GoogleReviewModal.js';

export const SocialFollowSection: React.FC = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const socialChannels = [
    {
      id: 'facebook',
      name: 'Facebook Page',
      handle: 'โต๊ะจีน รพีพัฒน์ นครปฐม',
      followers: 'แฟนเพจโต๊ะจีนอันดับ 1',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50 border-blue-200',
      badge: '👍 เพจทางการ Official',
      icon: '📘',
      desc: 'อัปเดตภาพผลงานจัดเลี้ยงจริงทั่วไทยทุกวัน และโปรโมชันพิเศษ',
      ctaText: 'กดถูกใจ & ติดตามเพจ',
      url: 'https://www.facebook.com/profile.php?id=61593868896647',
    },
    {
      id: 'tiktok',
      name: 'TikTok Channel',
      handle: '@user6577563937099',
      followers: 'คลิปทำอาหารสดหน้างาน',
      color: 'from-slate-900 via-pink-600 to-slate-950',
      bgColor: 'bg-pink-50/50 border-pink-200',
      badge: '🔥 ช่องทางการ Official',
      icon: '🎵',
      desc: 'คลิปทำอาหารสดไฟลุกควันฉุย เคล็ดลับสูตรโต๊ะจีนโบราณ 35 ปี นครปฐม',
      ctaText: 'กดติดตามบน TikTok',
      url: 'https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ',
    },
    {
      id: 'line',
      name: 'LINE Official Account',
      handle: 'ID: pang_baichaa',
      followers: '45,000+ เพื่อน',
      color: 'from-emerald-600 to-green-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      badge: '⚡ ตอบไวใน 3 นาที',
      icon: '💬',
      desc: 'รับคูปองส่วนลด ล็อกคิวงานด่วน และปรึกษาจัดเลี้ยงกับคุณแป้งโดยตรง',
      ctaText: 'เพิ่มเพื่อนรับสิทธิ์พิเศษ',
      url: 'https://line.me/ti/p/~pang_baichaa',
    },
    {
      id: 'google',
      name: 'Google Maps & Business',
      handle: 'โต๊ะจีน รพีพัฒน์ (นครปฐม)',
      followers: '⭐⭐⭐⭐⭐ 5.0 (6,500+ งาน)',
      color: 'from-amber-600 via-red-600 to-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      badge: '⭐ รีวิว 5 ดาว',
      icon: '🗺️',
      desc: 'รีวิวความประทับใจจากเจ้าภาพ และค้นหาเส้นทางโรงครัวกลาง',
      ctaText: 'เขียนรีวิว 5 ดาว',
      isModalTrigger: true,
      url: DEFAULT_GOOGLE_REVIEW_URL,
    },
  ];

  const viralReels = [
    {
      id: 'reel-1',
      title: 'ไฟลุกเตาเร่ง! ผัดกระเพาะปลาน้ำแดงเนื้อปูก้อนสด',
      views: '2.4M วิว',
      likes: '145K ไลก์',
      category: '🍳 เบื้องหลังครัวสด',
      image: '/images/dishes/soups/soup-fishmaw-crab-fresh-wood.jpg',
      duration: '0:45',
    },
    {
      id: 'reel-2',
      title: 'เคี่ยว 6 ชั่วโมง! ขาหมูน้ำแดงยอดผักสูตรจักรพรรดิ 35 ปี',
      views: '1.8M วิว',
      likes: '98K ไลก์',
      category: '🍖 เมนูซิกเนเจอร์',
      image: '/images/dishes/mains/main-pork-leg-stewed-greens-wood.jpg',
      duration: '0:58',
    },
    {
      id: 'reel-3',
      title: 'ขบวนรถครัวสัญจร 3 คัน พร้อมทีมบริกรลุยงาน 80 โต๊ะ!',
      views: '3.1M วิว',
      likes: '210K ไลก์',
      category: '🚚 คาราวานครัวเคลื่อนที่',
      image: '/images/fleet/fleet-side-parade-real.png',
      duration: '1:12',
    },
    {
      id: 'reel-4',
      title: 'ปลากะพง 9 ขีด สดเป็นๆ นึ่งมะนาวพริกสวนแซ่บจี๊ด',
      views: '1.2M วิว',
      likes: '82K ไลก์',
      category: '🐟 ซีฟู้ดสดใหม่ 100%',
      image: '/images/dishes/seafood/seafood-seabass-steamed-lime-wood.jpg',
      duration: '0:38',
    },
  ];

  return (
    <section id="social-community" className="py-20 relative bg-gradient-to-b from-white via-amber-50/30 to-white border-t-2 border-amber-300/80 overflow-hidden">
      
      {/* Decorative Radial Background Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-red-500/10 via-amber-500/15 to-blue-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* 🌟 1. SECTION HEADER (SOCIAL COMMUNITY & FOLLOWER EXPANSION) */}
        {/* ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 via-amber-50 to-blue-50 border-2 border-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider shadow-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span>JOIN OUR 250,000+ BANQUET LOVERS COMMUNITY</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            ร่วมติดตามครอบครัวโต๊ะจีนรพีพัฒน์
            <span className="block mt-1 text-gradient-red-gold">
              ผู้ติดตามกว่า 250,000+ ท่านทั่วประเทศ 👑✨
            </span>
          </h2>

          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            กดติดตาม Facebook, TikTok และ LINE Official เพื่อรับชมคลิปทำอาหารสดหน้างานไฟลุก เคล็ดลับสูตรอาหาร 35 ปี และรับสิทธิ์ลุ้นรับสิทธิพิเศษก่อนใครค่ะ
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🎁 2. EXCLUSIVE FOLLOWER PRIVILEGE CARD */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 via-red-800 to-slate-900 text-white shadow-2xl border-2 border-amber-300 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg border-2 border-white animate-bounce">
                <Gift className="w-8 h-8 text-red-700" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-amber-200 text-xs font-black uppercase">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>สิทธิพิเศษเฉพาะผู้ติดตามเพจ (Follower Bonus)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  กดติดตามเพจ Facebook & LINE วันนี้ รับสิทธิ์อัปเกรดเมนูพิเศษฟรี!
                </h3>
                <p className="text-xs sm:text-sm text-red-100 font-medium">
                  เพียงแจ้งแคปหน้าจอที่กดติดตามเพจกับทีมงาน รับสิทธิ์เลือกจานพิเศษเพิ่ม หรือรับส่วนลดจัดเลี้ยงทันทีค่ะ
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="https://www.facebook.com/profile.php?id=61593868896647"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 border border-blue-300"
              >
                <ThumbsUp className="w-4 h-4 fill-white" />
                <span>กดติดตาม Facebook</span>
              </a>

              <a
                href="https://line.me/ti/p/~pang_baichaa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#06C755] hover:bg-green-600 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 border border-green-300"
              >
                <MessageCircle className="w-4 h-4" />
                <span>เพิ่มเพื่อน LINE รับสิทธิ์</span>
              </a>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌐 3. SOCIAL CHANNELS GRID (FACEBOOK, TIKTOK, LINE, GOOGLE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socialChannels.map((chan) => (
            <div
              key={chan.id}
              className={`p-6 rounded-3xl ${chan.bgColor} border-2 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1`}
            >
              <div className="space-y-3">
                
                {/* Header with Icon & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-3xl">{chan.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-800 text-[10.5px] font-black shadow-2xs border border-slate-200">
                    {chan.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {chan.name}
                  </h4>
                  <div className="text-xs font-bold text-red-700 mt-0.5">
                    {chan.handle}
                  </div>
                  <div className="text-xs font-black text-slate-700 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{chan.followers}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {chan.desc}
                </p>

              </div>

              {/* Action Button */}
              {chan.isModalTrigger ? (
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${chan.color} text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform group-hover:scale-102 cursor-pointer`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>{chan.ctaText}</span>
                </button>
              ) : (
                <a
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${chan.color} text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform group-hover:scale-102 cursor-pointer`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-white/90" />
                  <span>{chan.ctaText}</span>
                </a>
              )}

            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 🎬 4. VIRAL REELS & TIKTOK VIDEO SHOWCASE (เตาเร่งไฟลุกควันฉุย) */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-700 uppercase tracking-wider">
                <Video className="w-4 h-4 text-red-600" />
                <span>VIRAL REELS & LIVE COOKING SHOWCASE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                คลิปไวรัลยอดวิวทะลุล้าน 🔥 อาหารสดใหม่ ปรุงร้อนหน้างาน
              </h3>
            </div>

            <a
              href="https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-2xl bg-slate-900 hover:bg-black text-amber-300 hover:text-white font-black text-xs flex items-center gap-2 shadow-sm transition-colors border border-amber-400"
            >
              <span>ดูคลิปทั้งหมดบน TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {viralReels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-3xl bg-white border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Container with Play Overlay & Stats */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={reel.image}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-red-500 transition-all border-2 border-white">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>

                  {/* Top Category Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-black border border-white/20">
                    {reel.category}
                  </div>

                  {/* Bottom Stats (Views & Likes) */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-black text-white">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {reel.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      {reel.likes}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                    {reel.title}
                  </h4>

                  <a
                    href="https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-900 hover:text-red-700 text-xs font-bold flex items-center justify-center gap-1 border border-amber-300 transition-colors"
                  >
                    <span>รับชมคลิปเต็ม</span>
                    <ExternalLink className="w-3 h-3 text-red-600" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Google Review Modal Trigger */}
      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

    </section>
  );
};
