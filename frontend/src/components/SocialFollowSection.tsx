import React, { useState, useEffect, useRef } from 'react';
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
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Gift,
  Star,
  Bell,
  TrendingUp,
  Video,
  X,
  Phone,
  RefreshCw,
  Radio,
  Eye,
  Disc,
  ArrowRight,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import { GoogleReviewModal, DEFAULT_GOOGLE_REVIEW_URL } from './GoogleReviewModal.js';
import {
  SocialFeedItem,
  CURATED_SOCIAL_FEEDS,
  fetchLiveYouTubeFeed
} from '../services/socialFeedService.js';

interface VerticalReelItem {
  id: string;
  platform: 'tiktok' | 'youtube' | 'facebook';
  title: string;
  tagline: string;
  videoSrc: string;
  author: string;
  authorHandle: string;
  views: string;
  likes: string;
  shares: string;
  category: string;
  badge: string;
  musicTitle: string;
  url: string;
}

const VERTICAL_REELS: VerticalReelItem[] = [
  {
    id: 'reel-wok-fire',
    platform: 'tiktok',
    title: 'เปิดเตาเร่งไฟลุก! ผัดกระเพาะปลาน้ำแดงเนื้อปูก้อนสด 35 ปี นครปฐม 🔥',
    tagline: 'ปรุงสุกสดใหม่หน้างาน 100% ไม่ใช้อาหารเวฟ',
    videoSrc: '/Grand_Opening_9x16.mp4',
    author: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
    authorHandle: '@user6577563937099',
    views: '1.9M',
    likes: '142K',
    shares: '18.5K',
    category: '🍳 เชฟกระทะเหล็ก',
    badge: '🎵 TikTok ไวรัล',
    musicTitle: 'เพลงต้นฉบับ - โต๊ะจีนรพีพัฒน์ 35 ปี',
    url: 'https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ',
  },
  {
    id: 'reel-pork-stew',
    platform: 'tiktok',
    title: 'เคี่ยว 6 ชั่วโมง! ขาหมูน้ำแดงยอดผักสูตรจักรพรรดิ นุ่มละลายในปาก 🍖',
    tagline: 'เนื้อนุ่ม หนังเด้ง น้ำพะโล้สมุนไพรจีนเข้มข้น',
    videoSrc: '/Grand_Opening_9x16.mp4',
    author: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
    authorHandle: '@user6577563937099',
    views: '2.4M',
    likes: '185K',
    shares: '24.1K',
    category: '🍖 เมนูซิกเนเจอร์',
    badge: '🔥 ยอดวิว 2 ล้าน+',
    musicTitle: 'สูตรลับโต๊ะจีนโบราณ 35 ปี นครปฐม',
    url: 'https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ',
  },
  {
    id: 'reel-seabass-steam',
    platform: 'youtube',
    title: 'ปลากะพง 9 ขีด สดเป็นๆ นึ่งมะนาวพริกขี้หนูสวน น้ำซุปแซ่บซี๊ด 🐟',
    tagline: 'เสิร์ฟร้อนพร้อมเตาแป๊ะซะ กลิ่นหอมฟุ้งทั้งงาน',
    videoSrc: '/Grand_Opening_9x16.mp4',
    author: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
    authorHandle: '@rapeephat_catering',
    views: '980K',
    likes: '76K',
    shares: '9.8K',
    category: '🐟 ซีฟู้ดสด 100%',
    badge: '▶️ YouTube Shorts',
    musicTitle: 'Live Kitchen Atmosphere - Rapeephat',
    url: 'https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA',
  },
  {
    id: 'reel-mega-banquet',
    platform: 'facebook',
    title: 'บรรยากาศจริง มหกรรมจัดเลี้ยง 750 โต๊ะ ลานพระปฐมเจดีย์ สวยงามสมเกียรติ 👑',
    tagline: 'ขบวนรถครัวสัญจร 8 คัน ทีมบริกรกว่า 100 ท่าน',
    videoSrc: '/Grand_Opening_9x16.mp4',
    author: 'โต๊ะจีน รพีพัฒน์ นครปฐม',
    authorHandle: 'เพจทางการ',
    views: '1.2M',
    likes: '95K',
    shares: '14.2K',
    category: '🎉 งานจัดเลี้ยงจริง',
    badge: '📘 Facebook Reels',
    musicTitle: 'เสียงปรบมือ & รอยยิ้มเจ้าภาพ',
    url: 'https://web.facebook.com/profile.php?id=61593868896647',
  },
];

export const SocialFollowSection: React.FC = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'tiktok' | 'facebook'>('all');
  const [feedItems, setFeedItems] = useState<SocialFeedItem[]>(CURATED_SOCIAL_FEEDS);
  const [activeVideo, setActiveVideo] = useState<SocialFeedItem | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('ตรวจจับสด');

  // Master Hero Video Controls State
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(true);
  const [isHeroMuted, setIsHeroMuted] = useState<boolean>(true);
  const [heroLiveChannel, setHeroLiveChannel] = useState<'official' | 'tiktok' | 'facebook'>('official');
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Vertical Reels Carousel sound state
  const [activeReelId, setActiveReelId] = useState<string>(VERTICAL_REELS[0].id);
  const [isReelsMuted, setIsReelsMuted] = useState<boolean>(true);

  // Load and sync live YouTube feeds
  const loadFeeds = async () => {
    setIsSyncing(true);
    const liveYt = await fetchLiveYouTubeFeed();
    if (liveYt.length > 0) {
      const otherFeeds = CURATED_SOCIAL_FEEDS.filter((f) => f.platform !== 'youtube');
      setFeedItems([...liveYt, ...otherFeeds]);
    } else {
      setFeedItems(CURATED_SOCIAL_FEEDS);
    }
    setLastSyncTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
    setIsSyncing(false);
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (isHeroPlaying) {
        heroVideoRef.current.pause();
        setIsHeroPlaying(false);
      } else {
        heroVideoRef.current.play().catch(() => {});
        setIsHeroPlaying(true);
      }
    }
  };

  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isHeroMuted;
      setIsHeroMuted(!isHeroMuted);
    }
  };

  const socialChannels = [
    {
      id: 'facebook',
      name: 'Facebook Page',
      handle: 'โต๊ะจีน รพีพัฒน์ นครปฐม',
      followers: 'แฟนเพจโต๊ะจีนอันดับ 1',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50/70 border-blue-200',
      badge: '👍 Facebook Official',
      icon: '📘',
      desc: 'อัปเดตภาพและคลิปผลงานจัดเลี้ยงจริงทั่วไทยทุกวัน และโปรโมชันพิเศษ',
      ctaText: 'กดถูกใจ & ติดตามเพจ',
      url: 'https://web.facebook.com/profile.php?id=61593868896647',
    },
    {
      id: 'tiktok',
      name: 'TikTok Channel',
      handle: '@user6577563937099',
      followers: 'คลิปทำอาหารสดหน้างาน',
      color: 'from-slate-900 via-pink-600 to-slate-950',
      bgColor: 'bg-pink-50/60 border-pink-200',
      badge: '🔥 TikTok Official',
      icon: '🎵',
      desc: 'คลิปทำอาหารสดไฟลุกควันฉุย เคล็ดลับสูตรโต๊ะจีนโบราณ 35 ปี นครปฐม',
      ctaText: 'กดติดตามบน TikTok',
      url: 'https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ',
    },
    {
      id: 'youtube',
      name: 'YouTube Channel',
      handle: 'โต๊ะจีนรพีพัฒน์ นครปฐม',
      followers: 'Auto-Sync คลิปสด & Shorts',
      color: 'from-red-600 via-red-700 to-slate-950',
      bgColor: 'bg-red-50/60 border-red-200',
      badge: '▶️ YouTube Official',
      icon: '🔴',
      desc: 'รับชมวิดีโอทำอาหารสดระดับภัตตาคาร บรรยากาศงานเลี้ยงจริง และรีวิวจากเจ้าภาพ',
      ctaText: 'กดติดตามบน YouTube',
      url: 'https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA',
    },
    {
      id: 'line',
      name: 'LINE Official Account',
      handle: 'ID: pang_baichaa',
      followers: '45,000+ เพื่อน',
      color: 'from-emerald-600 to-green-700',
      bgColor: 'bg-emerald-50/70 border-emerald-200',
      badge: '⚡ ตอบไวใน 3 นาที',
      icon: '💬',
      desc: 'รับคูปองส่วนลด ล็อกคิวงานด่วน และปรึกษาจัดเลี้ยงกับคุณแป้งโดยตรง',
      ctaText: 'เพิ่มเพื่อนรับสิทธิ์พิเศษ',
      url: 'https://line.me/ti/p/~pang_baichaa',
    },
    {
      id: 'google',
      name: 'Google Reviews',
      handle: 'โต๊ะจีน รพีพัฒน์ (นครปฐม)',
      followers: '⭐⭐⭐⭐⭐ 5.0 (6,500+ งาน)',
      color: 'from-amber-600 via-red-600 to-amber-700',
      bgColor: 'bg-amber-50/70 border-amber-200',
      badge: '⭐ รีวิว 5 ดาว',
      icon: '🗺️',
      desc: 'รีวิวความประทับใจจากเจ้าภาพ และค้นหาเส้นทางโรงครัวกลาง',
      ctaText: 'เขียนรีวิว 5 ดาว',
      isModalTrigger: true,
      url: DEFAULT_GOOGLE_REVIEW_URL,
    },
  ];

  const filteredFeeds = feedItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.platform === activeTab;
  });

  return (
    <section id="social-community" className="py-20 relative bg-gradient-to-b from-white via-amber-50/25 to-white border-t-2 border-amber-300/80 overflow-hidden">
      
      {/* Decorative Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-red-500/10 via-amber-500/15 to-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* 🌟 1. SECTION HEADER (SOCIAL COMMUNITY & VIDEO HUB) */}
        {/* ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-100 via-amber-100 to-emerald-100 border-2 border-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            <span>LIVE SOCIAL VIDEO HUB • ยูทูป ติ๊กต๊อก เพจเฟซบุ๊ก</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            ชมคลิปวิดีโอสด & บรรยากาศงานเลี้ยง
            <span className="block mt-1 text-gradient-red-gold">
              YouTube • TikTok • Facebook Page ครบจบที่นี่ 👑🎬
            </span>
          </h2>

          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            รับชมคลิปทำอาหารสดไฟลุก ขบวนรถครัวสัญจร และบรรยากาศงานเลี้ยงจริงเล่นอัตโนมัติทันที พร้อมร่วมเป็นครอบครัวผู้ติดตามกว่า 250,000+ ท่านทั่วประเทศค่ะ
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🎬 2. MASTER 16:9 AUTO-PLAYING CINEMA STUDIO (เล่นวิดีโอทันที ไม่ต้องคลิก) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl border-2 border-amber-400 relative overflow-hidden space-y-4">
          
          {/* Top Cinema Bar: Live Status & Channel Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping inline-block" />
                <span>🔴 LIVE VIDEO STREAM</span>
              </div>
              <span className="text-xs font-bold text-slate-300 hidden sm:inline-block">
                โต๊ะจีน รพีพัฒน์ นครปฐม (Official Channel 4K)
              </span>
            </div>

            {/* Platform Quick Switchers */}
            <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto overflow-x-auto">
              <a
                href="https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black flex items-center gap-1.5 transition-transform hover:scale-105 shadow-xs whitespace-nowrap"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>YouTube Channel</span>
              </a>

              <a
                href="https://www.tiktok.com/@user6577563937099?_r=1&_t=ZS-99PYzBzUIbJ"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black flex items-center gap-1.5 transition-transform hover:scale-105 shadow-xs whitespace-nowrap"
              >
                <span>🎵 TikTok</span>
              </a>

              <a
                href="https://web.facebook.com/profile.php?id=61593868896647"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-1.5 transition-transform hover:scale-105 shadow-xs whitespace-nowrap"
              >
                <ThumbsUp className="w-3 h-3 fill-white" />
                <span>เพจ Facebook</span>
              </a>
            </div>
          </div>

          {/* Main Video Screen Container (Auto-playing with sound/play controls) */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-amber-400/50 shadow-inner group">
            
            {/* Native Auto-Playing Video Tag */}
            <video
              ref={heroVideoRef}
              src="/Grand_Opening_16x9.mp4"
              autoPlay
              muted={isHeroMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Subtle Gradient Overlays for Cinematic Feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Floating Top-Left Broadcast Overlay */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2">
              <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-amber-300 text-xs font-black border border-white/20 flex items-center gap-1.5 shadow-lg">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>โต๊ะจีน รพีพัฒน์ พรีเมียม 35+ ปี</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/50 flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-400" />
                <span>2,480 กำลังรับชม</span>
              </div>
            </div>

            {/* Floating Top-Right Sound Control Button (Prominent) */}
            <button
              type="button"
              onClick={toggleHeroMute}
              className={`absolute top-3 sm:top-4 right-3 sm:right-4 z-10 px-3.5 py-2 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl transition-all transform hover:scale-105 cursor-pointer border ${
                isHeroMuted
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 ring-4 ring-amber-400/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 ring-4 ring-emerald-500/30'
              }`}
              title={isHeroMuted ? 'คลิกเพื่อเปิดเสียง' : 'คลิกเพื่อปิดเสียง'}
            >
              {isHeroMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-slate-950 animate-bounce" />
                  <span>🔊 แตะเพื่อเปิดเสียง</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-white" />
                  <span>กำลังเปิดเสียง (แตะปิด)</span>
                </>
              )}
            </button>

            {/* Bottom In-Video Bar: Play/Pause, Title, and Action Buttons */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase">
                    4K OFFICIAL
                  </span>
                  <span className="text-xs text-amber-200 font-bold">
                    นครปฐม • กรุงเทพฯ • ทั่วราชอาณาจักร
                  </span>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-black text-white leading-snug drop-shadow-md">
                  ขบวนคาราวานครัวสัญจร ปรุงสุกสดใหม่หน้างาน 100% มาตรฐานภัตตาคาร 35 ปี
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={toggleHeroPlay}
                  className="p-2.5 sm:p-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-transform hover:scale-105 cursor-pointer border border-white/30"
                  aria-label={isHeroPlaying ? 'หยุดเล่น' : 'เล่นวิดีโอ'}
                >
                  {isHeroPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <a
                  href="#quotation"
                  className="py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xl transition-all transform hover:scale-105 border border-amber-300"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>จองคิวงานในคลิป</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 📱 3. TIKTOK & YOUTUBE SHORTS VERTICAL REELS (คลิปสั้นแนวตั้ง 9:16 เล่นสด) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
                <span>VIRAL REELS & SHORTS (เล่นสดทันที)</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-black border border-pink-300">
                  🎵 TikTok & YouTube Shorts
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                คลิปสั้นไวรัลยอดวิวหลักล้าน 🔥 สูตรเด็ดโต๊ะจีน 35 ปี
              </h3>
            </div>

            <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <span>คลิปวิดีโอเล่นอัตโนมัติ • แตะเพื่อชมในแอปต้นทาง</span>
            </div>
          </div>

          {/* 4 Vertical Reels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {VERTICAL_REELS.map((reel) => (
              <div
                key={reel.id}
                className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 border-2 border-amber-300 shadow-xl group hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Auto-playing Native Vertical Video */}
                <video
                  src={reel.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 pointer-events-none" />

                {/* Top Header on Reel */}
                <div className="relative z-10 p-3.5 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-[10.5px] font-black border border-white/20">
                    {reel.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow-xs ${
                    reel.platform === 'tiktok'
                      ? 'bg-pink-600'
                      : reel.platform === 'youtube'
                      ? 'bg-red-600'
                      : 'bg-blue-600'
                  }`}>
                    {reel.badge}
                  </span>
                </div>

                {/* Center Floating Play / Logo Badge */}
                <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl border-2 border-white transform hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </a>
                </div>

                {/* Bottom TikTok/Reels Style UI */}
                <div className="relative z-10 p-4 space-y-2.5 text-white">
                  
                  {/* Author & Verification */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-red-600 text-white flex items-center justify-center font-black text-xs shadow-md border border-white">
                      ร
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1 leading-none">
                        <span>{reel.author}</span>
                        <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400" />
                      </div>
                      <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                        {reel.authorHandle}
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white line-clamp-2 leading-snug drop-shadow-sm">
                      {reel.title}
                    </h4>
                    <p className="text-[10.5px] text-amber-200 font-medium line-clamp-1 mt-0.5">
                      ✨ {reel.tagline}
                    </p>
                  </div>

                  {/* Music Disc Spin Animation */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-medium">
                    <Disc className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span className="truncate">{reel.musicTitle}</span>
                  </div>

                  {/* Action Link to Platform */}
                  <div className="pt-1.5 border-t border-white/20 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-[11px] font-black text-slate-200">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                        {reel.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        {reel.views}
                      </span>
                    </div>

                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-white text-slate-950 font-black text-[11px] flex items-center gap-1 hover:bg-amber-300 transition-colors shadow-sm"
                    >
                      <span>เปิดชม</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌐 4. ALL SOCIAL CHANNELS CARDS (FACEBOOK, TIKTOK, YOUTUBE, LINE, GOOGLE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {socialChannels.map((chan) => (
            <div
              key={chan.id}
              className={`p-5 sm:p-6 rounded-3xl ${chan.bgColor} border-2 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1`}
            >
              <div className="space-y-2.5">
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
        {/* 🎁 5. FOLLOWER PRIVILEGE CARD */}
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
                  กดติดตาม Facebook, TikTok & YouTube วันนี้ รับสิทธิ์อัปเกรดเมนูพิเศษฟรี!
                </h3>
                <p className="text-xs sm:text-sm text-red-100 font-medium">
                  เพียงแจ้งแคปหน้าจอที่กดติดตามช่องทางใดก็ได้กับทีมงาน รับสิทธิ์เลือกจานพิเศษเพิ่ม หรือรับส่วนลดจัดเลี้ยงทันทีค่ะ
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <a
                href="https://web.facebook.com/profile.php?id=61593868896647"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl flex items-center gap-1.5 transition-all transform hover:scale-105 border border-blue-300"
              >
                <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                <span>ติดตาม Facebook</span>
              </a>

              <a
                href="https://www.youtube.com/channel/UCY1eIpowWx1wcYtMZ09VCZA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4.5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-xl flex items-center gap-1.5 transition-all transform hover:scale-105 border border-red-300"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>ติดตาม YouTube</span>
              </a>

              <a
                href="https://line.me/ti/p/~pang_baichaa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4.5 py-2.5 rounded-2xl bg-[#06C755] hover:bg-green-600 text-white font-black text-xs shadow-xl flex items-center gap-1.5 transition-all transform hover:scale-105 border border-green-300"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>แอดไลน์ รับสิทธิ์</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📺 6. MULTI-PLATFORM LIVE VIDEO FEED GRID & AUTO-SYNC */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-wider">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                </span>
                <span>AUTO-SYNC LIVESTREAM GALLERY</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                  🟢 ตรวจจับสด ({lastSyncTime})
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                คลังวิดีโอ & เมนูยอดนิยม 🔥 อัปเดตล่าสุดทุกแพลตฟอร์ม
              </h3>
            </div>

            {/* Platform Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-300 shadow-inner overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌟 ทั้งหมด
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('youtube')}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  activeTab === 'youtube'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-red-700'
                }`}
              >
                <span>🔴 YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tiktok')}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  activeTab === 'tiktok'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-pink-700'
                }`}
              >
                <span>🎵 TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facebook')}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  activeTab === 'facebook'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                <span>📘 Facebook</span>
              </button>

              <button
                type="button"
                onClick={loadFeeds}
                disabled={isSyncing}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                title="รีเฟรชตรวจจับคลิปใหม่"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-red-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Video / Post Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFeeds.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white border-2 border-amber-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Image / Thumbnail Container */}
                <div
                  onClick={() => setActiveVideo(item)}
                  className="relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-red-500 transition-all border-2 border-white">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-amber-300 text-[10px] font-black border border-white/20">
                      {item.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black text-white shadow-xs ${
                      item.platform === 'youtube'
                        ? 'bg-red-600'
                        : item.platform === 'tiktok'
                        ? 'bg-pink-600'
                        : 'bg-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Bottom Stats */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-black text-white">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      {item.likes}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                      <span>{item.author}</span>
                      {item.publishedAt && <span className="text-slate-400">• {item.publishedAt}</span>}
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors mt-1">
                      {item.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(item)}
                      className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black flex items-center justify-center gap-1 transition-colors cursor-pointer border border-red-200"
                    >
                      <Play className="w-3 h-3 fill-red-700" />
                      <span>เล่นคลิป</span>
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-amber-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-amber-400"
                    >
                      <span>เปิดในแอป</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🎬 VIDEO PLAYER POPUP MODAL (เมื่อต้องการขยายจอใหญ่) */}
      {/* ========================================================================= */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl border-2 border-amber-400 shadow-2xl overflow-hidden text-white flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white ${
                  activeVideo.platform === 'youtube'
                    ? 'bg-red-600'
                    : activeVideo.platform === 'tiktok'
                    ? 'bg-pink-600'
                    : 'bg-blue-600'
                }`}>
                  {activeVideo.badge}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video / Embed Area */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeVideo.embedUrl ? (
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src="/Grand_Opening_16x9.mp4"
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>สนใจสั่งจองเมนูในคลิป โทร <strong className="text-white font-bold">081-331-1646 (คุณแป้ง)</strong></span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="#quotation"
                  onClick={() => setActiveVideo(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md border border-amber-400"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>คำนวณราคาโต๊ะจีน</span>
                </a>

                <a
                  href="https://line.me/ti/p/~pang_baichaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-green-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ทัก LINE คุณแป้ง</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Google Review Modal Trigger */}
      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

    </section>
  );
};
