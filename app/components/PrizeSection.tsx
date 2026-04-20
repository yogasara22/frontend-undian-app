'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Winner, Prize } from '../types';
import Image from 'next/image';

import { type TypographyConfig } from '../lib/settings';

interface PrizeSectionProps {
  winner: Winner | null;
  prize: Prize | null;
  customTitle?: string;
  titleStyle?: TypographyConfig;
  prizeStyle?: TypographyConfig;
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

export function PrizeSection({ 
  winner, 
  prize, 
  customTitle = 'UNDIAN BERHADIAH',
  titleStyle,
  prizeStyle
}: PrizeSectionProps) {
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
          <div className="absolute left-[5%] md:left-[10%] top-[-10px] hidden sm:block">
            <svg width="45" height="55" viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] pb-2 -rotate-12">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          {/* Decorative Thunderbolt Right */}
          <div className="absolute right-[5%] md:right-[10%] bottom-[-10px] hidden sm:block">
            <svg width="35" height="45" viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] rotate-12">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          
          {customTitle && (
            <h3 className="uppercase relative z-10"
                style={{
                  fontFamily: titleStyle?.fontFamily || 'inherit',
                  fontSize: `${titleStyle?.fontSize ? titleStyle.fontSize * 0.75 : 24}px`, // Slight scale for desktop
                  color: titleStyle?.color || '#FFFFFF',
                  fontWeight: titleStyle?.fontWeight || '800',
                  letterSpacing: `${titleStyle?.letterSpacing || 4}px`,
                  fontVariant: 'all-small-caps',
                  textShadow: titleStyle?.textShadow 
                    ? `
                      -1px -1px 0 #0f54a8,  
                       1px -1px 0 #0f54a8,
                      -1px  1px 0 #0f54a8,
                       1px  1px 0 #0f54a8,
                       0px  2px 4px rgba(0,0,0,0.5)
                    ` 
                    : 'none'
                }}>
              {customTitle}
            </h3>
          )}
          <h2 className="uppercase relative z-10 leading-tight md:leading-none px-4"
              style={{
                fontFamily: prizeStyle?.fontFamily || 'inherit',
                fontSize: `${prizeStyle?.fontSize || 80}px`,
                color: prizeStyle?.color || '#FFFFFF',
                fontWeight: prizeStyle?.fontWeight || '900',
                letterSpacing: `${prizeStyle?.letterSpacing || 0}px`,
                textShadow: prizeStyle?.textShadow 
                  ? `
                    -2px -2px 0 #0f54a8,  
                     2px -2px 0 #0f54a8,
                    -2px  2px 0 #0f54a8,
                     2px  2px 0 #0f54a8,
                     0px  4px 0px #0c4bb0,
                     0px  8px 0px #093582,
                     0px 12px 20px rgba(0,0,0,0.4)
                  `
                  : 'none'
              }}>
            {prize.name}
          </h2>
        </div>

        {/* Podium & Prize Area */}
        <div className="relative w-80 md:w-[450px] flex flex-col items-center mt-4">
          
          {/* Light Beams from behind */}
          <div className="absolute -inset-20 z-0 flex justify-center pointer-events-none">
            <div className="w-[150px] h-[400px] bg-white/20 blur-3xl rotate-45 transform origin-bottom -translate-x-32"></div>
            <div className="w-[150px] h-[400px] bg-white/20 blur-3xl -rotate-45 transform origin-bottom translate-x-32"></div>
          </div>

          {/* Prize Image */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
            className="z-30 w-72 h-72 md:w-[500px] md:h-[500px] mb-[-50px] md:mb-[-105px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] relative flex items-end justify-center transform hover:scale-105 transition-transform duration-500 hover:rotate-2 pointer-events-none"
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
              <span className="text-[150px] md:text-[240px] leading-none mb-6 md:mb-10">{getPrizeIcon(prize.name)}</span>
            )}
          </motion.div>

          {/* 3D CSS Podium Stage */}
          <div className="relative w-[130%] h-[140px] md:h-[180px] z-10">
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
