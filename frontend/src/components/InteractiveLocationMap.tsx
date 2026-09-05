import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Building2,
  ChefHat,
  Sparkles,
  Crown,
  Copy,
  Check,
  Smartphone,
  Compass,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface LocationInfo {
  id: 'nakhonpathom' | 'pathumthani';
  name: string;
  subName: string;
  badge: string;
  address: string;
  fullAddress: string;
  mapsQuery: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  description: string;
  highlights: string[];
  phone: string;
  hours: string;
  embedQuery: string;
}

const LOCATIONS: LocationInfo[] = [
  {
    id: 'nakhonpathom',
    name: 'ฐานผลิตและโรงครัวกลาง นครปฐม',
    subName: 'ครัวรพีพัฒน์ (โต๊ะจีน รพีพัฒน์)',
    badge: 'หมุดหลัก Google Maps • ครัวกลาง 35 ปี',
    address: '72 หมู่ 1 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม 73000',
    fullAddress: 'ครัวรพีพัฒน์ (โต๊ะจีน รพีพัฒน์) 72 หมู่ 1 ต.นครปฐม อ.เมืองนครปฐม จ.นครปฐม 73000',
    mapsQuery: 'ครัวรพีพัฒน์ โต๊ะจีน รพีพัฒน์ นครปฐม',
    googleMapsUrl: 'https://maps.google.com/?q=' + encodeURIComponent('ครัวรพีพัฒน์ โต๊ะจีน รพีพัฒน์ 72 หมู่ 1 นครปฐม'),
    appleMapsUrl: 'https://maps.apple.com/?q=' + encodeURIComponent('ครัวรพีพัฒน์ โต๊ะจีน นครปฐม'),
    description: 'ฐานผลิตโรงครัวใหญ่ คัดสรรวัตถุดิบสดใหม่วันต่อวัน ปรุงสุกร้อนจากเตา และเป็นศูนย์กระจายกองทัพรถบรรทุกอุปกรณ์จัดเลี้ยง 77 จังหวัดทั่วไทย',
    highlights: ['ปรุงสดจากเตาถ่านสูตรโบราณ 35 ปี', 'ศูนย์รวมรถบรรทุก 6 ล้อตู้ทึบควบคุมอุณหภูมิ', 'รองรับสเกลสูงสุด 750 โต๊ะ/วัน'],
    phone: '081-331-1646',
    hours: 'เปิดทำการทุกวัน 06:00 - 21:00 น. (โทรจองคิว 24 ชม.)',
    embedQuery: 'ครัวรพีพัฒน์ โต๊ะจีน นครปฐม 73000',
  },
  {
    id: 'pathumthani',
    name: 'สำนักงานประสานงานหลัก ปทุมธานี',
    subName: 'ออฟฟิศคลองสาม (ฝ่ายขาย & เอกสารสัญญา)',
    badge: 'ฝ่ายบริการลูกค้า & นัดหมายทำสัญญา',
    address: '50/8 หมู่ 4 ถ.เลียบคลองสาม ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี 12120',
    fullAddress: 'โต๊ะจีนรพีพัฒน์ พรีเมียม 50/8 หมู่ 4 ถ.เลียบคลองสาม ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี 12120',
    mapsQuery: '50/8 หมู่ 4 เลียบคลองสาม คลองหลวง ปทุมธานี',
    googleMapsUrl: 'https://maps.google.com/?q=' + encodeURIComponent('50/8 หมู่ 4 เลียบคลองสาม คลองหลวง ปทุมธานี 12120'),
    appleMapsUrl: 'https://maps.apple.com/?q=' + encodeURIComponent('50/8 หมู่ 4 เลียบคลองสาม คลองหลวง ปทุมธานี 12120'),
    description: 'ศูนย์บริการลูกค้า วางแผนเมนูอาหาร ออกใบเสนอราคามาตรฐาน A4 สัญญาว่าจ้าง และประสานงานทีมบริการจัดเลี้ยงอย่างเป็นทางการ',
    highlights: ['ออกใบเสนอราคา & ใบเสร็จรับเงินอย่างเป็นทางการ', 'ให้คำปรึกษาจัดเลี้ยงและชิมเมนูตัวอย่าง', 'บริการรวดเร็ว ปรึกษาฟรี 24 ชม.'],
    phone: '081-331-1646',
    hours: 'เปิดบริการทุกวัน 07:00 - 22:00 น.',
    embedQuery: '50/8 หมู่ 4 คลองสาม คลองหลวง ปทุมธานี',
  },
];

export const InteractiveLocationMap: React.FC = () => {
  const [activeLocationId, setActiveLocationId] = useState<'nakhonpathom' | 'pathumthani'>('nakhonpathom');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const activeLoc = LOCATIONS.find((l) => l.id === activeLocationId) || LOCATIONS[0];

  // Generate ultra-crisp QR code whenever active location changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(activeLoc.googleMapsUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 500,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeLoc.googleMapsUrl]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeLoc.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="map" className="space-y-6 scroll-mt-28">
      
      {/* 🌟 Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border-2 border-amber-300 text-red-950 text-xs font-black uppercase tracking-wider shadow-2xs">
          <MapPin className="w-4 h-4 text-red-600 animate-bounce" />
          <span>แผนที่หมุดร้าน & การเดินทาง (GOOGLE MAPS GPS)</span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          แผนที่ตั้งและพิกัดนำทาง โต๊ะจีน รพีพัฒน์
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          ตรวจดูที่ตั้งโรงครัวใหญ่ หรือสำนักงานประสานงานหลัก พร้อมระบบนำทาง GPS ทันสมัย สแกนด้วยมือถือเพื่อขับรถมาได้ทันที
        </p>
      </div>

      {/* 🧭 Location Selector Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {LOCATIONS.map((loc) => {
          const isActive = loc.id === activeLocationId;
          const isKitchen = loc.id === 'nakhonpathom';
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => setActiveLocationId(loc.id)}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md cursor-pointer border-2 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-amber-400 shadow-red-900/20 scale-102 ring-2 ring-amber-300/60'
                  : 'bg-white hover:bg-amber-50/50 text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-amber-400 text-red-950 font-black' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isKitchen ? <ChefHat className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <div>{loc.name}</div>
                <div className={`text-[11px] font-semibold ${isActive ? 'text-amber-200' : 'text-slate-400'}`}>
                  {loc.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 🗺️ Main Interactive Map Container */}
      <div className="relative rounded-3xl bg-slate-900 border-2 border-amber-300 shadow-2xl overflow-hidden">
        
        {/* Top Floating Glassmorphism Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/90 backdrop-blur-md text-white border-b border-amber-400/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shrink-0 border border-amber-300 shadow-md">
              {activeLoc.id === 'nakhonpathom' ? <ChefHat className="w-5 h-5 text-amber-200" /> : <Building2 className="w-5 h-5 text-amber-200" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-black text-amber-300">{activeLoc.name}</h4>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 text-[10.5px] font-bold">
                  เปิดให้บริการ
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{activeLoc.subName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Google Maps */}
            <a
              href={activeLoc.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-102 cursor-pointer border border-amber-300"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-200" />
              <span>เปิด Google Maps GPS</span>
              <ArrowUpRight className="w-3 h-3 text-amber-300" />
            </a>

            {/* Apple Maps */}
            <a
              href={activeLoc.appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Apple Maps</span>
            </a>

            {/* Copy Address */}
            <button
              type="button"
              onClick={handleCopyAddress}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-black">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>คัดลอกที่อยู่</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 🗺️ Grid: Map Frame + Interactive Details Side Card */}
        <div className="grid lg:grid-cols-12 gap-0 relative bg-slate-900">
          
          {/* Left Column: Responsive Google Maps Embed iframe (8 Cols) */}
          <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[440px] w-full bg-slate-950">
            <iframe
              title={`Google Map - ${activeLoc.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(activeLoc.embedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[380px] sm:min-h-[440px] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Quick Interactive Overlay Button on Map Corner */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/40 text-[11px] font-bold text-amber-200 flex items-center gap-1.5 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
              <span>{activeLoc.address}</span>
            </div>
          </div>

          {/* Right Column: Detailed Card + QR Code (4 Cols) */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white border-t lg:border-t-0 lg:border-l border-amber-400/20 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3.5">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeLoc.badge}</span>
              </div>

              {/* Address details */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-400">ที่อยู่ / พิกัด GPS:</div>
                <p className="text-xs sm:text-[13px] text-slate-200 font-semibold leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                  {activeLoc.fullAddress}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>จุดเด่น & ความพร้อมบริการ:</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 font-medium">
                  {activeLoc.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone & Working Hours */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/brand/khun-pang.jpg"
                    alt="คุณแป้ง โต๊ะจีนรพีพัฒน์"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shrink-0 shadow-xs"
                  />
                  <div>
                    <div className="text-[10px] text-amber-300 font-black">สายด่วนคุณแป้ง (24 ชม.)</div>
                    <a
                      href={`tel:${activeLoc.phone.replace(/[^0-9]/g, '')}`}
                      className="font-mono text-white text-xs sm:text-sm font-black hover:text-amber-300 transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{activeLoc.phone}</span>
                    </a>
                  </div>
                </div>
                <div className="text-[10.5px] text-slate-400 font-medium text-right shrink-0">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>พร้อมรับสาย</span>
                  </div>
                  <div>{activeLoc.hours}</div>
                </div>
              </div>

            </div>

            {/* 📱 Scan-to-Go Smartphone QR Code Box */}
            <div className="p-3 rounded-2xl bg-white/5 border border-amber-400/40 flex items-center gap-3.5 shadow-inner">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-white p-1 border-2 border-amber-300 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code ${activeLoc.name}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse rounded" />
                )}
              </div>
              <div className="space-y-1 flex-1">
                <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>สแกนด้วยกล้องมือถือ</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  เปิด GPS นำทางทันทีบนรถ เพื่อความสะดวกรวดเร็ว
                </p>
                <a
                  href={activeLoc.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 hover:underline pt-0.5"
                >
                  <span>แตะเพื่อเปิด Maps ทันที</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 🌟 77 Provinces Nationwide Service Coverage Badge */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-300">
            <Layers className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h5 className="text-sm font-black text-slate-900">
              รัศมีบริการจัดเลี้ยง: ทั่วประเทศไทย 77 จังหวัด
            </h5>
            <p className="text-xs text-slate-600 font-medium">
              กรุงเทพฯ ปริมณฑล นครปฐม ราชบุรี สุพรรณบุรี กาญจนบุรี อยุธยา ชลบุรี ระยอง และทุกภาคทั่วประเทศ
            </p>
          </div>
        </div>

        <a
          href="tel:0813311646"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs flex items-center gap-1.5 shadow-sm shrink-0 border border-amber-300 transform hover:scale-102 transition-all cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-amber-200" />
          <span>เช็กคิวจัดเลี้ยง: 081-331-1646</span>
        </a>
      </div>

    </div>
  );
};
