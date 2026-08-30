import React from 'react';
import { CalendarDays, UtensilsCrossed, Users, Award, Crown, Sparkles, Activity, TrendingUp } from 'lucide-react';
import { useVisitorStats } from './VisitorCounter.js';

export const StatsSection: React.FC = () => {
  const { onlineNow, totalVisitors, todayVisitors } = useVisitorStats();

  const stats = [
    {
      icon: Crown,
      value: '35+',
      unit: 'ปี',
      label: 'ประสบการณ์จัดเลี้ยงภัตตาคาร',
      description: 'สืบทอดสูตรความอร่อยตำรับโต๊ะจีนจักรพรรดิ',
    },
    {
      icon: UtensilsCrossed,
      value: '6,500+',
      unit: 'งาน',
      label: 'งานจัดเลี้ยงทั่วราชอาณาจักร',
      description: 'งานแต่ง งานบวช งานองค์กร งานเลี้ยงพระ',
    },
    {
      icon: Sparkles,
      value: '100%',
      unit: 'สดใหม่',
      label: 'ปรุงสุกร้อนๆ หน้างานทุกจาน',
      description: 'วัตถุดิบคัดสดพรีเมียม ปรุงร้อนๆ หม้อต่อหม้อ',
    },
    {
      icon: Award,
      value: '99.8%',
      unit: 'พึงพอใจ',
      label: 'ความพึงพอใจจากเจ้าภาพ',
      description: 'แขกในงานชมว่าอร่อย ปริมาณจุใจ อุปกรณ์สะอาด',
    },
  ];

  return (
    <section className="py-14 relative border-y-2 border-amber-300/80 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white/95 p-6 rounded-3xl border-2 border-amber-300/90 hover:border-amber-500 hover:shadow-xl transition-all duration-300 group shadow-md shadow-amber-900/5 transform hover:-translate-y-1"
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-2 border-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-6 h-6 text-amber-300" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-sm font-black text-amber-700">{stat.unit}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">{stat.label}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Live Visitor & Audience Milestone Ribbon (เริ่มต้นที่ 2,500,000+ คน) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 text-white border-2 border-amber-400 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <span>สถิติผู้เข้าเยี่ยมชมเว็บไซต์ (Real-Time Live Traffic)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                โต๊ะจีนรพีพัฒน์ การันตีความไว้วางใจจากเจ้าภาพทั่วประเทศ ยอดชมสะสมทะลุ 2,500,000+ คน
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold shrink-0">
            {/* Current Online */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ออนไลน์ขณะนี้:</span>
              <strong className="text-white font-mono text-sm">{onlineNow}</strong>
              <span className="text-[10px]">คน</span>
            </div>

            {/* Today */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-200">
              <span>วันนี้:</span>
              <strong className="text-amber-300 font-mono text-sm">{todayVisitors.toLocaleString()}</strong>
              <span className="text-[10px]">ครั้ง</span>
            </div>

            {/* Cumulative Lifetime (2,500,000+) */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-red-500/30 border-2 border-amber-300 text-amber-300">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>ผู้เข้าชมสะสมตลอดกาล:</span>
              <strong className="text-white font-mono text-sm">{totalVisitors.toLocaleString()}</strong>
              <span className="text-[10px]">คน 🏆</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
