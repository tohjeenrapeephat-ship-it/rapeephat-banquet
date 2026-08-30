import React from 'react';

interface WatermarkOverlayProps {
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  size = 'md',
  opacity = 0.43,
}) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-15 p-4"
      style={{ opacity }}
    >
      <div className="text-center transform -rotate-12 space-y-0.5 select-none">
        {/* Main Title Text - 15% Richer & Clearer */}
        <div
          className={`font-black tracking-wider text-white ${
            size === 'sm'
              ? 'text-xs sm:text-sm'
              : size === 'lg'
              ? 'text-xl sm:text-3xl md:text-4xl'
              : 'text-base sm:text-xl md:text-2xl'
          }`}
          style={{
            textShadow: '0 2px 6px rgba(0,0,0,0.75), 0 0 10px rgba(0,0,0,0.5)',
            fontFamily: "'Prompt', 'Noto Sans Thai', sans-serif",
          }}
        >
          โต๊ะจีน รพีพัฒน์
        </div>

        {/* Subtitle / Phone Text */}
        <div
          className={`font-bold tracking-widest text-amber-200 uppercase ${
            size === 'sm'
              ? 'text-[7.5px] sm:text-[8.5px]'
              : size === 'lg'
              ? 'text-[10px] sm:text-xs md:text-sm'
              : 'text-[8.5px] sm:text-[10px]'
          }`}
          style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)',
            letterSpacing: '0.18em',
          }}
        >
          RAPEEPHAT • 083-087-2257
        </div>
      </div>
    </div>
  );
};
