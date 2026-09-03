import React, { useState, useEffect } from 'react';
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
  Video,
  X,
  Phone,
  RefreshCw
} from 'lucide-react';
import { GoogleReviewModal, DEFAULT_GOOGLE_REVIEW_URL } from './GoogleReviewModal.js';
import {
  SocialFeedItem,
  CURATED_SOCIAL_FEEDS,
  fetchLiveYouTubeFeed
} from '../services/socialFeedService.js';

export const SocialFollowSection: React.FC = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'tiktok' | 'facebook'>('all');
  const [feedItems, setFeedItems] = useState<SocialFeedItem[]>(CURATED_SOCIAL_FEEDS);
  const [activeVideo, setActiveVideo] = useState<SocialFeedItem | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('ตรวจจับสด');

  // Load and sync live YouTube feeds
  const loadFeeds = async () => {
    setIsSyncing(true);
    const liveYt = await fetchLiveYouTubeFeed();
    if (liveYt.length > 0) {
      // Merge live YouTube videos on top of curated feeds
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

  const socialChannels = [
    {
      id: 'facebook',
      name: 'Facebook Page',
      handle: 'โต๊ะจีน รพีพัฒน์ นครปฐม',
      followers: 'แฟนเพจโต๊ะจีนอันดับ 1',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50 border-blue-200',
      badge: '👍 Facebook Official',
      icon: '📘',
      desc: 'อัปเดตภาพผลงานจัดเลี้ยงจริงทั่วไทยทุกวัน และโปรโมชันพิเศษ',
      ctaText: 'กดถูกใจ & ติดตามเพจ',
      url: 'https://web.facebook.com/profile.php?id=61593868896647',
    },
    {
      id: 'tiktok',
      name: 'TikTok Channel',
      handle: '@user6577563937099',
      followers: 'คลิปทำอาหารสดหน้างาน',
      color: 'from-slate-900 via-pink-600 to-slate-950',
      bgColor: 'bg-pink-50/50 border-pink-200',
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

  const filteredFeeds = feedItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.platform === activeTab;
  });

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
            กดติดตาม YouTube, TikTok, Facebook และ LINE Official เพื่อรับชมคลิปทำอาหารสดหน้างานไฟลุก เคล็ดลับสูตรอาหาร 35 ปี และรับสิทธิพิเศษก่อนใครค่ะ
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
        {/* 🌐 3. SOCIAL CHANNELS GRID (FACEBOOK, TIKTOK, YOUTUBE, LINE, GOOGLE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
        {/* 🎬 4. LIVE SOCIAL AUTO-FEED & VIRAL REELS SHOWCASE (AUTO-SYNC ENGINE) */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-wider">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                </span>
                <span>LIVE SOCIAL AUTO-FEED & VIRAL REELS</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                  🟢 Auto-Sync ({lastSyncTime})
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                คลิปสด & ผลงานจัดเลี้ยงล่าสุด 🔥 อาหารปรุงร้อนสดๆ หน้างาน
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
                      <span>ดูในเว็บ</span>
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
      {/* 🎬 VIDEO PLAYER POPUP MODAL */}
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
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="relative z-10 space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-xl border-2 border-white animate-pulse">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {activeVideo.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        คลิกเพื่อรับชมวิดีโอฉบับเต็มความคมชัดระดับ HD บน {activeVideo.platform.toUpperCase()}
                      </p>
                    </div>
                    <a
                      href={activeVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl transition-transform hover:scale-105"
                    >
                      <span>เปิดรับชมบน {activeVideo.platform.toUpperCase()}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
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
                  href="#quotation-builder"
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
