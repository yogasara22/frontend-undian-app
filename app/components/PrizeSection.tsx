'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Winner, Prize } from '../types';
import Image from 'next/image';

interface PrizeSectionProps {
  winner: Winner | null;
  prize: Prize | null;
}

// Map prize name to emoji icons as fallback
function getPrizeIcon(prizeName: string): string {
  const n = prizeName.toLowerCase();
  if (n.includes('laptop')) return '💻';
  if (n.includes('smartphone') || n.includes('hp') || n.includes('phone') || n.includes('iphone')) return '📱';
  if (n.includes('tv') || n.includes('televisi')) return '📺';
  if (n.includes('sepeda') || n.includes('motor')) return '🏍️';
  if (n.includes('kamera') || n.includes('camera')) return '📷';
  if (n.includes('headphone') || n.includes('earphone')) return '🎧';
  if (n.includes('voucher') || n.includes('belanja')) return '🛍️';
  return '🎁';
}

export function PrizeSection({ winner, prize }: PrizeSectionProps) {
  if (!prize) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full relative mt-8 flex flex-col items-center z-10"
      >
        {/* Text Area */}
        <div className="flex flex-col items-center mb-8 relative z-20 text-center w-full">
          {/* Decorative Thunderbolt Left */}
          <div className="absolute left-[10%] md:left-[20%] top-0 hidden sm:block">
            <svg width="40" height="50" viewBox="0 0 24 24" fill="white" className="drop-shadow-md pb-2 -rotate-12">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          {/* Decorative Thunderbolt Right */}
          <div className="absolute right-[10%] md:right-[20%] bottom-0 hidden sm:block">
            <svg width="30" height="40" viewBox="0 0 24 24" fill="white" className="drop-shadow-md rotate-12">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-widest uppercase relative z-10"
              style={{
                textShadow: '-2px -2px 0 #0f54a8, 2px -2px 0 #0f54a8, -2px 2px 0 #0f54a8, 2px 2px 0 #0f54a8, 0px 4px 6px rgba(0,0,0,0.5)'
              }}>
            UNDIAN BERHADIAH
          </h3>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mt-1 uppercase relative z-10 leading-tight md:leading-none px-4"
              style={{
                textShadow: '-3px -3px 0 #0f54a8, 3px -3px 0 #0f54a8, -3px 3px 0 #0f54a8, 3px 3px 0 #0f54a8, 0px 8px 0px #0f54a8, 0px 15px 15px rgba(0,0,0,0.4)',
                WebkitTextStroke: '1px #0f54a8'
              }}>
            {prize.name}
          </h2>
        </div>

        {/* Podium & Prize Area */}
        <div className="relative w-64 md:w-96 flex flex-col items-center mt-4">
          
          {/* Light Beams from behind */}
          <div className="absolute -inset-20 z-0 flex justify-center pointer-events-none">
            <div className="w-[100px] h-[300px] bg-white/20 blur-2xl rotate-45 transform origin-bottom -translate-x-20"></div>
            <div className="w-[100px] h-[300px] bg-white/20 blur-2xl -rotate-45 transform origin-bottom translate-x-20"></div>
          </div>

          {/* Prize Image */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
            className="z-30 w-64 h-64 md:w-80 md:h-80 mb-[-30px] md:mb-[-40px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] relative flex items-end justify-center transform hover:scale-105 transition-transform duration-500 hover:rotate-2 pointer-events-none"
          >
            {prize.imageUrl ? (
              <Image
                src={prize.imageUrl}
                alt={prize.name}
                fill
                className="object-contain object-bottom"
                priority
              />
            ) : (
              <span className="text-[120px] md:text-[150px] leading-none mb-4 md:mb-6">{getPrizeIcon(prize.name)}</span>
            )}
          </motion.div>

          {/* 3D CSS Podium Stage */}
          <div className="relative w-[120%] h-[120px] md:h-[150px] z-10">
            {/* Bottom Level (White) */}
            <div className="absolute bottom-0 w-full h-[60px] md:h-[80px]">
              {/* White cylinder top */}
              <div className="absolute top-0 w-full h-[30px] md:h-[40px] bg-[#f8f9fa] rounded-[50%] z-10"></div>
              {/* White cylinder body */}
              <div className="absolute top-[15px] md:top-[20px] w-full h-[30px] md:h-[40px] bg-[#e9ecef]"></div>
              {/* White cylinder bottom */}
              <div className="absolute bottom-0 w-full h-[30px] md:h-[40px] bg-[#e9ecef] rounded-[50%] shadow-[0_25px_40px_rgba(0,0,0,0.5)]"></div>
            </div>

            {/* Top Level (Blue) */}
            <div className="absolute bottom-[48px] md:bottom-[60px] w-[86%] left-[7%] h-[50px] md:h-[70px] z-20">
              {/* Blue cylinder top */}
              <div className="absolute top-0 w-full h-[25px] md:h-[35px] bg-[#0f62d1] rounded-[50%] z-10 border border-blue-400 shadow-[inset_0_-4px_10px_rgba(0,0,0,0.2)]"></div>
              {/* Blue cylinder body */}
              <div className="absolute top-[12.5px] md:top-[17.5px] w-full h-[25px] md:h-[35px] bg-[#0c4bb0]"></div>
              {/* Blue cylinder bottom */}
              <div className="absolute bottom-0 w-full h-[25px] md:h-[35px] bg-[#093582] rounded-[50%] shadow-[0_10px_15px_rgba(0,0,0,0.3)]"></div>
            </div>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
