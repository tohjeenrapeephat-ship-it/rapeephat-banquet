import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, LocateFixed, Loader2, Sparkles, Map as MapIcon, CheckCircle2 } from 'lucide-react';

interface RealtimeLocationMapProps {
  location: string;
  onLocationChange?: (newLocation: string) => void;
  zone?: string;
  className?: string;
}

export const RealtimeLocationMap: React.FC<RealtimeLocationMapProps> = ({
  location,
  onLocationChange,
  zone,
  className = '',
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locateSuccess, setLocateSuccess] = useState<boolean>(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);

  // Debounce location input for smooth iframe rendering
  useEffect(() => {
    setIsMapLoading(true);
    const handler = setTimeout(() => {
      const trimmed = (location || '').trim();
      if (trimmed) {
        setDebouncedQuery(trimmed);
      } else {
        // Default area center for Rapeephat Catering
        setDebouncedQuery(zone === 'bkk_metro' ? 'จังหวัดนครปฐม ประเทศไทย' : 'ประเทศไทย');
      }
      setIsMapLoading(false);
    }, 450);

    return () => clearTimeout(handler);
  }, [location, zone]);

  // GPS Auto-detect handler
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocateError('อุปกรณ์ของคุณไม่รองรับการระบุพิกัด GPS');
      return;
    }

    setIsLocating(true);
    setLocateError(null);
    setLocateSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim for human-friendly Thai address
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=th`,
            { headers: { 'User-Agent': 'RapeephatCateringApp/1.0' } }
          );
          const data = await res.json();
          let addressName = '';
          if (data && data.display_name) {
            const addr = data.address || {};
            const venue = addr.amenity || addr.building || addr.road || addr.suburb || addr.district || '';
            const district = addr.city_district || addr.district || addr.amphoe || '';
            const province = addr.province || addr.state || '';
            
            if (venue && province) {
              addressName = `${venue} ${district ? 'อ.' + district.replace(/^(อำเภอ|อ\.)/, '') : ''} จ.${province.replace(/^(จังหวัด|จ\.)/, '')}`;
            } else {
              addressName = data.display_name.split(',').slice(0, 3).join(', ');
            }
          }

          const finalLocationText = addressName || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          if (onLocationChange) {
            onLocationChange(finalLocationText);
          }
          setDebouncedQuery(`${latitude},${longitude}`);
          setLocateSuccess(true);
          setTimeout(() => setLocateSuccess(false), 4000);
        } catch {
          // Fallback directly to coordinates
          const coordText = `พิกัด GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          if (onLocationChange) {
            onLocationChange(coordText);
          }
          setDebouncedQuery(`${latitude},${longitude}`);
          setLocateSuccess(true);
          setTimeout(() => setLocateSuccess(false), 4000);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError('กรุณากด "อนุญาต (Allow)" การเข้าถึงตำแหน่งในเบราว์เซอร์');
        } else {
          setLocateError('ไม่สามารถดึงตำแหน่งได้ กรุณากรอกชื่อสถานที่ในช่องข้อความ');
        }
        setTimeout(() => setLocateError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(debouncedQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsAppUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(debouncedQuery || 'นครปฐม')}`;

  const hasLocation = Boolean((location || '').trim());

  return (
    <div className={`rounded-2xl border-2 border-amber-300/80 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 p-3.5 sm:p-4 shadow-sm space-y-3 transition-all ${className}`}>
      
      {/* Header with Live Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-red-100 text-red-700 border border-red-200 shrink-0">
            <MapIcon className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-slate-900">
                แผนที่แสดงพิกัดสถานที่จัดงาน (Real-Time)
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                ดาวเทียมสด 🛰️
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {hasLocation
                ? `กำลังจับพิกัด: "${location}" สำหรับขบวนรถครัวสัญจร 35 ปี`
                : 'พิมพ์ชื่อสถานที่หรือกดปักหมุด GPS เพื่อดูพิกัดจริงบนแผนที่'}
            </p>
          </div>
        </div>

        {/* Action Buttons: GPS & Google Maps App Link */}
        <div className="flex items-center gap-2 ml-auto">
          {/* GPS Button */}
          <button
            type="button"
            onClick={handleGetGPSLocation}
            disabled={isLocating}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-2xs border ${
              locateSuccess
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 hover:border-amber-400 active:scale-95'
            }`}
            title="ดึงพิกัดตำแหน่งปัจจุบันจากมือถือ/คอมพิวเตอร์"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>กำลังระบุพิกัด...</span>
              </>
            ) : locateSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ปักหมุดแล้ว!</span>
              </>
            ) : (
              <>
                <LocateFixed className="w-3.5 h-3.5 text-red-600" />
                <span>ปักหมุด GPS ปัจจุบัน</span>
              </>
            )}
          </button>

          {/* Open in Google Maps Link */}
          <a
            href={googleMapsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-xs hover:shadow transition-all active:scale-95"
            title="เปิดพิกัดนี้ในแอป Google Maps นำทาง"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>เปิด Google Maps นำทาง</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* GPS Error Notice */}
      {locateError && (
        <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span>⚠️ {locateError}</span>
        </div>
      )}

      {/* Map Iframe Container */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
        {isMapLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-200">
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              <span className="text-xs font-bold text-slate-700">กำลังอัปเดตแผนที่...</span>
            </div>
          </div>
        )}
        <iframe
          title="แผนที่สถานที่จัดงานโต๊ะจีน รพีพัฒน์"
          src={mapSrc}
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* Floating Quick Pin Indicator at Bottom-Left */}
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-md border border-white/20 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-[320px]">
            {hasLocation ? location : 'โต๊ะจีน รพีพัฒน์ (ศูนย์นครปฐม & ทั่วไทย)'}
          </span>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      {!hasLocation && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            ตัวอย่างสถานที่:
          </span>
          {[
            'หอประชุมเทศบาลเมืองนครปฐม',
            'วัดไร่ขิง อ.สามพราน',
            'องค์พระปฐมเจดีย์',
            'สมาคมแต้จิ๋ว สาทร กทม.',
            'สโมสรตำรวจ ถ.วิภาวดี',
            'วัดพระศรีมหาธาตุ บางเขน'
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onLocationChange && onLocationChange(preset)}
              className="text-[11px] font-bold bg-white hover:bg-amber-100/80 text-slate-700 hover:text-amber-950 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
            >
              + {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
