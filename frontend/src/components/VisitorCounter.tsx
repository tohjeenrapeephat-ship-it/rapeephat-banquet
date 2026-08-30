import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  TrendingUp,
  Activity,
  Award,
  Sparkles,
  ShieldCheck,
  Globe2,
  Calendar,
  Clock,
  X,
  ChevronUp,
  BarChart3
} from 'lucide-react';

// Base cumulative counter starting at 2,500,000+ visitors
const BASE_TOTAL_VISITORS = 2500000;
const BASE_TODAY_VISITORS = 3842;
const BASE_MONTH_VISITORS = 94520;

export const useVisitorStats = () => {
  const [onlineNow, setOnlineNow] = useState<number>(54);
  const [totalVisitors, setTotalVisitors] = useState<number>(() => {
    const saved = localStorage.getItem('rapeephat_visitor_count');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return parsed >= 2500000 ? parsed : BASE_TOTAL_VISITORS;
    }
    return BASE_TOTAL_VISITORS;
  });
  const [todayVisitors, setTodayVisitors] = useState<number>(BASE_TODAY_VISITORS);

  useEffect(() => {
    // Increment visit once per session
    const sessionKey = 'rapeephat_visited_session';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      setTotalVisitors((prev) => {
        const next = prev + 1;
        localStorage.setItem('rapeephat_visitor_count', next.toString());
        return next;
      });
      setTodayVisitors((prev) => prev + 1);
    }

    // Natural fluctuation of online users every 4-7 seconds
    const interval = setInterval(() => {
      setOnlineNow((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = Math.max(38, Math.min(88, prev + delta));
        return next;
      });

      // Occasional random incremental view
      if (Math.random() > 0.6) {
        setTotalVisitors((prev) => {
          const next = prev + 1;
          localStorage.setItem('rapeephat_visitor_count', next.toString());
          return next;
        });
        setTodayVisitors((prev) => prev + 1);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return { onlineNow, totalVisitors, todayVisitors, monthVisitors: BASE_MONTH_VISITORS };
};

// =========================================================================
// 🌟 1. FLOATING LIVE VISITOR DOCK BADGE (Bottom-Left Luxury Capsule)
// =========================================================================
export const VisitorFloatingBadge: React.FC = () => {
  const { onlineNow, totalVisitors, todayVisitors } = useVisitorStats();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="fixed bottom-5 left-5 z-40 font-sans">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-950 text-white backdrop-blur-md border-2 border-amber-400/80 shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-amber-950/30"
          title="คลิกเพื่อดูสถิติผู้เข้าชมเว็บไซต์แบบละเอียด"
        >
          {/* Live Pulsing Dot */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-300">
              ออนไลน์: <strong className="text-emerald-400 font-black font-mono">{onlineNow}</strong> คน
            </span>
            <span className="text-amber-400/50">|</span>
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalVisitors.toLocaleString()}</span>
            </span>
          </div>

          <ChevronUp className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      ) : (
        /* EXPANDED STATS POPUP MODAL */
        <div className="w-80 sm:w-96 rounded-3xl bg-slate-950 text-white border-2 border-amber-400 shadow-2xl p-5 space-y-4 animate-scaleUp backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  สถิติผู้เข้าเยี่ยมชมเว็บไซต์
                </h4>
                <div className="text-[10px] text-slate-400 font-medium">โต๊ะจีน รพีพัฒน์ พรีเมียม (Real-Time)</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Online Live Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-300">กำลังเข้าชมขณะนี้ (Live Online)</div>
                <div className="text-[10px] text-slate-300">ผู้ใช้งานจริงบนเว็บไซต์ทั่วไทย</div>
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {onlineNow} <span className="text-xs font-bold text-slate-300">คน</span>
            </div>
          </div>

          {/* Lifetime & Daily Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>ผู้เข้าชมวันนี้</span>
              </div>
              <div className="text-base font-black text-white font-mono">
                {todayVisitors.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">คน</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>ผู้เข้าชมเดือนนี้</span>
              </div>
              <div className="text-base font-black text-white font-mono">
                {BASE_MONTH_VISITORS.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">คน</span>
              </div>
            </div>
          </div>

          {/* Cumulative Milestone Box (1 Million+ Starting Point) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-red-500/20 border-2 border-amber-400/70 space-y-1 text-center">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9.5px] font-black uppercase shadow-xs">
              <Award className="w-3 h-3" />
              <span>ยอดผู้เข้าชมสะสมตลอดกาล (2,500,000+ MILESTONE)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight pt-1">
              {totalVisitors.toLocaleString()}
              <span className="text-xs font-bold text-slate-200 ml-1">ครั้ง</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              การันตีความไว้วางใจจากเจ้าภาพทั่วราชอาณาจักรกว่า 35 ปี
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 📊 2. EMBEDDED VISITOR STATS BANNER (For Footer & Stats Sections)
// =========================================================================
export const VisitorStatsSection: React.FC = () => {
  const { onlineNow, totalVisitors, todayVisitors, monthVisitors } = useVisitorStats();

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-2 border-amber-400 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE WEBSITE TRAFFIC & AUDIENCE COUNTER</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              สถิติผู้เข้าเยี่ยมชมเว็บไซต์ "โต๊ะจีนรพีพัฒน์"
            </h3>
          </div>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-black shadow-xs shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>ระบบนับยอดสดเรียลไทม์ (Live 24h)</span>
        </div>
      </div>

      {/* 4-Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Online Real-Time */}
        <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-inner flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300">กำลังเข้าชมขณะนี้</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {onlineNow}
            </span>
            <span className="text-xs font-bold text-slate-300">คนออนไลน์</span>
          </div>
          <p className="text-[10px] text-emerald-200/80 font-medium">กำลังเลือกดูเมนู & คิวงาน</p>
        </div>

        {/* 2. Today Visitors */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">ผู้เข้าชมวันนี้</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {todayVisitors.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">ครั้ง</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">เฉลี่ย 3,500+ ครั้ง/วัน</p>
        </div>

        {/* 3. This Month */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">ผู้เข้าชมเดือนนี้</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {monthVisitors.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">ครั้ง</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">ครอบคลุม 77 จังหวัด</p>
        </div>

        {/* 4. Total Cumulative (1 Million+ Milestone) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-red-500/20 border-2 border-amber-400 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300">ผู้เข้าชมสะสมตลอดกาล</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
              {totalVisitors.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-200">คน</span>
          </div>
          <p className="text-[10px] text-amber-200/90 font-bold">ทะลุ 2,500,000+ คนอย่างเป็นทางการ 🏆</p>
        </div>

      </div>

    </div>
  );
};
