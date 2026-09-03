import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Crown,
  Flame,
  Film,
  Share2,
  Video,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

interface HeritageVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VideoScene {
  id: number;
  duration: number; // in seconds
  title: string;
  subtitle: string;
  badge: string;
  desc: string;
  image: string;
  overlayGradient: string;
  accentColor: string;
}

const VIDEO_SCENES: VideoScene[] = [
  {
    id: 1,
    duration: 6,
    badge: '🏛️ ต้นกำเนิดตำนาน 35 ปี',
    title: 'จากเมืองหลวงโต๊ะจีนแห่งสยาม',
    subtitle: 'สู่ตำนานความอร่อยที่สืบทอดกว่า 35 ปี',
    desc: 'โต๊ะจีนรพีพัฒน์ ถือกำเนิด ณ ดินแดนแห่งมนต์เสน่ห์ "นครปฐม" เมืองหลวงโต๊ะจีนอันดับ 1 ของประเทศไทย',
    image: '/images/brand/facebook-cover-real-1.jpg',
    overlayGradient: 'from-black/85 via-black/40 to-black/80',
    accentColor: '#F59E0B',
  },
  {
    id: 2,
    duration: 6,
    badge: '🔥 เอกลักษณ์การปรุงสด 100%',
    title: 'เตาเร่งไฟแรงสูง หอมกลิ่นกระทะ',
    subtitle: 'ผัดสดและเคี่ยวร้อนๆ หม้อต่อหม้อหน้างาน',
    desc: 'อาหารทุกจานปรุงสุกร้อนๆ ณ สถานที่จัดเลี้ยงจริง ไม่มีอาหารค้างคืน เสิร์ฟร้อนควันฉุยพร้อมกันทุกโต๊ะ',
    image: '/images/dishes/soups/soup-fishmaw-crab-fresh-wood.jpg',
    overlayGradient: 'from-red-950/90 via-black/40 to-black/85',
    accentColor: '#EF4444',
  },
  {
    id: 3,
    duration: 6,
    badge: '👑 วัตถุดิบคัดเกรดจักรพรรดิ',
    title: 'คัดสรรวัตถุดิบชั้นเลิศเกรดพรีเมียม',
    subtitle: 'กระเพาะปลาปูก้อน • ขาหมูน้ำแดง • ปลากะพง 9 ขีด',
    desc: 'คัดสดใหม่วันต่อวัน ทั้งปลากะพงสดเป็นๆ เป็ดปักกิ่งหนังกรอบ และขาหมูเคี่ยวนาน 6 ชั่วโมงสูตรโบราณ',
    image: '/images/dishes/mains/main-pork-leg-stewed-greens-wood.jpg',
    overlayGradient: 'from-amber-950/90 via-black/40 to-black/85',
    accentColor: '#FBBF24',
  },
  {
    id: 4,
    duration: 6,
    badge: '🚚 คาราวานครัวเคลื่อนที่ 77 จังหวัด',
    title: 'ขบวนรถครัวสัญจร 3 คัน ทั่วไทย',
    subtitle: 'ทีมครัวมืออาชีพ & ทีมบริกรดูแลดุจญาติมิตร',
    desc: 'พร้อมโต๊ะ เก้าอี้เบาะนุ่มคลุมผ้าผูกโบว์หรูหรา และอุปกรณ์จัดเลี้ยงครบวงจร ไม่ต้องเตรียมเอง',
    image: '/images/fleet/fleet-side-parade-real.png',
    overlayGradient: 'from-emerald-950/90 via-black/40 to-black/85',
    accentColor: '#10B981',
  },
  {
    id: 5,
    duration: 7,
    badge: '⭐ การันตีความประทับใจกว่า 6,500 งาน',
    title: 'โต๊ะจีน รพีพัฒน์ พรีเมียม',
    subtitle: 'สืบทอดตำนานความอร่อย ต้นตำรับนครปฐม 35 ปี',
    desc: 'โปรโมชั่นพิเศษ: สั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะ • ติดต่อจองคิว: 081-331-1646 (คุณแป้ง) • LINE: pang_baichaa',
    image: '/images/brand/facebook-cover-real-1.jpg',
    overlayGradient: 'from-slate-950/95 via-red-950/60 to-black/90',
    accentColor: '#F59E0B',
  },
];

export const FACEBOOK_POST_CAPTION = `🏮✨ ย้อนรอยตำนานความอร่อย 35 ปี "โต๊ะจีน รพีพัฒน์" ต้นตำรับนครปฐม เมืองหลวงโต๊ะจีนแห่งสยาม ✨🏮

กว่า 3 ทศวรรษที่ "โต๊ะจีน รพีพัฒน์" ได้รับความไว้วางใจจากเจ้าภาพมากกว่า 6,500 งานเลี้ยงทั่วประเทศไทย 🇹🇭

👑 อะไรที่ทำให้โต๊ะจีนรพีพัฒน์ครองใจเจ้าภาพยาวนานกว่า 35 ปี?
1️⃣ 🔥 ปรุงสุกสดใหม่หน้างาน 100%: ยกเตาเร่งไฟแรงสูง ปรุงร้อนหม้อต่อหม้อ หอมกลิ่นควันกระทะเหล็ก (Wok Hei) เสิร์ฟร้อนควันฉุยถึงโต๊ะพร้อมกัน
2️⃣ 🦞 วัตถุดิบคัดเกรดพรีเมียม: กระเพาะปลาแท้น้ำแดงเนื้อปูก้อนสด, ปลากะพง 9 ขีดสดเป็นๆ, ขาหมูน้ำแดงยอดผักเคี่ยวนาน 6 ชั่วโมง, เป็ดปักกิ่งบะหมี่หยกมงคล
3️⃣ 🚚 ขบวนรถครัวสัญจร 3 คัน: บริการจัดเลี้ยงทั่วประเทศไทย 77 จังหวัด ตรงเวลา ไม่มีผิดนัด
4️⃣ 🪑 ฟรีอุปกรณ์ครบวงจร: โต๊ะ เก้าอี้เบาะนุ่มพร้อมผ้าคลุมผูกโบว์หรูหรา ชุดจานชามแก้วน้ำ และทีมบริกรประจำโต๊ะดูแลตลอดงาน

🎉 โปรโมชันฉลอง 35 ปี:
✨ สั่ง 20 โต๊ะ แถมฟรี 1 โต๊ะทันที (สั่ง 40 โต๊ะ แถมฟรี 2 โต๊ะ)
✨ ราคาเริ่มต้นเพียง 1,400 บาท / โต๊ะ (เมนูภัตตาคาร 8-9 จาน)

📞 ปรึกษาและจองคิวงานจัดเลี้ยง:
• โทร: 081-331-1646 (คุณแป้ง)
• LINE ID: pang_baichaa (คลิก https://line.me/ti/p/~pang_baichaa)
• เว็บไซต์: www.rapeephat-catering.com
• ฐานผลิตโรงครัวกลาง: นครปฐม (เมืองหลวงโต๊ะจีน)

#โต๊ะจีนรพีพัฒน์ #โต๊ะจีนนครปฐม #โต๊ะจีนอร่อย #จัดเลี้ยงโต๊ะจีน #โต๊ะจีนงานแต่ง #โต๊ะจีนงานบวช #โต๊ะจีนขึ้นบ้านใหม่ #อาหารโต๊ะจีน #รับจัดโต๊ะจีนทั่วประเทศ #โต๊ะจีน35ปี`;

export const HeritageVideoModal: React.FC<HeritageVideoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sceneStartTimeRef = useRef<number>(Date.now());
  const imagesCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const currentScene = VIDEO_SCENES[currentSceneIndex] || VIDEO_SCENES[0];
  const totalDuration = VIDEO_SCENES.reduce((acc, s) => acc + s.duration, 0);

  // Preload Images
  useEffect(() => {
    VIDEO_SCENES.forEach((scene) => {
      if (!imagesCacheRef.current.has(scene.image)) {
        const img = new Image();
        img.src = scene.image;
        img.onload = () => {
          imagesCacheRef.current.set(scene.image, img);
        };
      }
    });
  }, []);

  // Playback timer & progress
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    sceneStartTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - sceneStartTimeRef.current) / 1000;
      const sceneDur = currentScene.duration;

      if (elapsed >= sceneDur) {
        if (currentSceneIndex < VIDEO_SCENES.length - 1) {
          setCurrentSceneIndex((prev) => prev + 1);
          sceneStartTimeRef.current = Date.now();
        } else {
          // Loop back to first scene
          setCurrentSceneIndex(0);
          sceneStartTimeRef.current = Date.now();
        }
      } else {
        setProgress(elapsed / sceneDur);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentSceneIndex, currentScene.duration]);

  // Render high-definition Canvas frame animation (Cinematic Ken Burns & Motion Typography)
  useEffect(() => {
    if (!isOpen) return;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1280;
      const height = 720;
      canvas.width = width;
      canvas.height = height;

      // 1. Background image with smooth Ken Burns zoom
      const img = imagesCacheRef.current.get(currentScene.image);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      if (img && img.complete) {
        ctx.save();
        const zoom = 1.0 + progress * 0.08; // 8% smooth zoom
        const offsetX = (width * (1 - zoom)) / 2;
        const offsetY = (height * (1 - zoom)) / 2;
        ctx.drawImage(img, offsetX, offsetY, width * zoom, height * zoom);
        ctx.restore();
      }

      // 2. Cinematic Gradient Overlay
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 3. Gold Vignette Border Frame
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Corner Accents
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 6;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(16, 60); ctx.lineTo(16, 16); ctx.lineTo(60, 16);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - 60, 16); ctx.lineTo(width - 16, 16); ctx.lineTo(width - 16, 60);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(16, height - 60); ctx.lineTo(16, height - 16); ctx.lineTo(60, height - 16);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - 60, height - 16); ctx.lineTo(width - 16, height - 16); ctx.lineTo(width - 16, height - 60);
      ctx.stroke();

      // 4. Brand Watermark Header
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 22px "Sarabun", "Noto Sans Thai", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('👑 โต๊ะจีนรพีพัฒน์ พรีเมียม • 35 ปี ต้นตำรับนครปฐม', 45, 60);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 16px "Sarabun", "Noto Sans Thai", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('โทร: 081-331-1646 • LINE: pang_baichaa', width - 45, 60);

      // 5. Scene Badge Tag (Fade + Slide)
      const textAlpha = Math.min(progress * 3.5, 1.0);
      ctx.save();
      ctx.globalAlpha = textAlpha;

      // Badge Box
      const badgeText = currentScene.badge;
      ctx.font = 'bold 20px "Sarabun", sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 36;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - badgeWidth / 2, 340, badgeWidth, 38, 12);
      ctx.fill();
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, width / 2, 366);

      // 6. Main Headline Title (Bold Gold Gradient)
      ctx.fillStyle = '#FDE047';
      ctx.font = '900 52px "Sarabun", "Prompt", sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 16;
      ctx.fillText(currentScene.title, width / 2, 435);

      // Subtitle
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px "Sarabun", sans-serif';
      ctx.shadowBlur = 10;
      ctx.fillText(currentScene.subtitle, width / 2, 485);

      // Description Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.font = '500 21px "Sarabun", sans-serif';
      ctx.fillText(currentScene.desc, width / 2, 535);

      ctx.restore();

      // 7. Bottom Scene Timeline Indicators
      const barY = height - 42;
      const barWidth = 140;
      const barGap = 16;
      const totalBarWidth = VIDEO_SCENES.length * barWidth + (VIDEO_SCENES.length - 1) * barGap;
      const startX = (width - totalBarWidth) / 2;

      VIDEO_SCENES.forEach((sc, idx) => {
        const x = startX + idx * (barWidth + barGap);
        // Base bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.roundRect(x, barY, barWidth, 6, 3);
        ctx.fill();

        // Active fill
        if (idx < currentSceneIndex) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.roundRect(x, barY, barWidth, 6, 3);
          ctx.fill();
        } else if (idx === currentSceneIndex) {
          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.roundRect(x, barY, barWidth * progress, 6, 3);
          ctx.fill();
        }
      });

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isPlaying, currentSceneIndex, progress, currentScene]);

  // Handle Video File Recording & Download (MediaRecorder HD Canvas Video Export)
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      setExportProgress(0);

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5000000, // 5 Mbps High Definition
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'วีดีโอประวัติ_โต๊ะจีนรพีพัฒน์_35ปี_Official.webm';
        a.click();
        setIsExporting(false);
        setExportProgress(100);
      };

      // Restart from Scene 1 and record whole sequence
      setCurrentSceneIndex(0);
      sceneStartTimeRef.current = Date.now();
      setIsPlaying(true);
      recorder.start();

      let secondsRecorded = 0;
      const exportTimer = setInterval(() => {
        secondsRecorded += 0.5;
        const pct = Math.min(Math.round((secondsRecorded / totalDuration) * 100), 99);
        setExportProgress(pct);

        if (secondsRecorded >= totalDuration) {
          clearInterval(exportTimer);
          recorder.stop();
        }
      }, 500);
    } catch (err) {
      console.error('Video Export Error:', err);
      setIsExporting(false);
      alert('เบราว์เซอร์ของคุณรองรับการเล่นวีดีโอ สามารถอัดหน้าจอหรือบันทึกวีดีโอได้ค่ะ');
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(FACEBOOK_POST_CAPTION);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-fadeIn selection:bg-red-500 selection:text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isExporting) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-5xl bg-slate-900 text-white rounded-3xl border-2 border-amber-400 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* ========================================================================= */}
        {/* 🎬 HEADER: CINEMATIC VIDEO TITLE & CONTROLS */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b-2 border-amber-400 flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  OFFICIAL HERITAGE VIDEO
                </span>
                <span className="px-2 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                  60 SECONDS HD
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                วีดีโอประวัติความเป็นมา โต๊ะจีนรพีพัฒน์ 35 ปี (สำหรับโพสต์ลงเพจ)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 📺 CANVAS 16:9 HD VIDEO PLAYER */}
        {/* ========================================================================= */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
          />

          {/* Quick Play/Pause Center Overlay */}
          {!isPlaying && (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl border-4 border-amber-300 hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-9 h-9 fill-white ml-1 text-amber-200" />
            </button>
          )}

          {/* Bottom Video Progress Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 text-xs bg-black/60 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/15">
            
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentSceneIndex(0);
                  sceneStartTimeRef.current = Date.now();
                }}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="เริ่มใหม่อีกครั้ง"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <span className="font-mono font-bold text-amber-300 text-xs">
                ฉาก {currentSceneIndex + 1} / {VIDEO_SCENES.length}
              </span>
            </div>

            {/* Current Scene Badge */}
            <div className="font-bold text-white text-xs truncate max-w-xs">
              {currentScene.title}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🛠️ VIDEO EXPORT & FACEBOOK CAPTION SUITE */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-7 space-y-6 bg-slate-950">
          
          {/* Action Row: Export Video & Copy Caption */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Export Video Button */}
            <button
              type="button"
              onClick={handleExportVideo}
              disabled={isExporting}
              className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:scale-102 cursor-pointer border border-amber-300 disabled:opacity-50"
            >
              <Download className="w-5 h-5 text-amber-300" />
              <span>
                {isExporting ? `กำลังอัดและส่งออกวีดีโอ (${exportProgress}%)...` : '📥 ดาวน์โหลดไฟล์วีดีโอ (HD สำหรับโพสต์ลงเพจ)'}
              </span>
            </button>

            {/* Copy Facebook Post Caption Button */}
            <button
              type="button"
              onClick={handleCopyCaption}
              className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-600 shadow-md"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกข้อความโพสต์เรียบร้อยแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-amber-300" />
                  <span>📋 คัดลอกแคปชันสำหรับโพสต์ Facebook</span>
                </>
              )}
            </button>

          </div>

          {/* Caption Box Preview (พร้อมนำไปโพสต์คู่กับวีดีโอบนเพจ) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>📝 ข้อความแคปชันสำหรับโพสต์ลงเพจ Facebook (ก๊อปปี้ไปวางคู่กับวีดีโอได้ทันที):</span>
              <span className="text-amber-400">พร้อมแฮชแท็กติดเทรนด์</span>
            </div>
            <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto p-3 bg-black/40 rounded-xl border border-slate-800">
              {FACEBOOK_POST_CAPTION}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
