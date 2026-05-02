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
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full relative mt-0.5 flex flex-col items-center z-10"
      >
          {/* Text Area */}
        <div className="flex flex-col items-center mb-0.5 relative z-20 text-center w-full">
          {/* Decorative Thunderbolt Left */}
          <div className="absolute left-[5%] md:left-[20%] top-[-1px] hidden sm:block">
            <svg width="18" height="24" viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] pb-1 -rotate-12">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          {/* Decorative Thunderbolt Right */}
          <div className="absolute right-[5%] md:right-[20%] bottom-[-1px] hidden sm:block">
            <svg width="16" height="22" viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] rotate-12">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          {customTitle && (
            <h3 className="uppercase relative z-10"
              style={{
                fontFamily: titleStyle?.fontFamily || 'inherit',
                fontSize: `${titleStyle?.fontSize ? titleStyle.fontSize * 0.35 : 12}px`, // Scaled up
                color: titleStyle?.color || '#FFFFFF',
                fontWeight: titleStyle?.fontWeight || '800',
                letterSpacing: `${titleStyle?.letterSpacing || 1}px`,
                fontVariant: 'all-small-caps',
                textShadow: titleStyle?.textShadow
                  ? `
                      -1px -1px 0 #0f54a8,  
                       1px -1px 0 #0f54a8,
                      -1px  1px 0 #0f54a8,
                       1px  1px 0 #0f54a8,
                       0px  1px 2px rgba(0,0,0,0.5)
                    `
                  : 'none'
              }}>
              {customTitle}
            </h3>
          )}
          <h2 className="uppercase relative z-10 leading-tight md:leading-none px-4"
            style={{
              fontFamily: prizeStyle?.fontFamily || 'inherit',
              fontSize: `${prizeStyle?.fontSize ? prizeStyle.fontSize * 0.45 : 32}px`, // Scaled up
              color: prizeStyle?.color || '#FFFFFF',
              fontWeight: prizeStyle?.fontWeight || '900',
              letterSpacing: `${prizeStyle?.letterSpacing || 0}px`,
              textShadow: prizeStyle?.textShadow
                ? `
                    -1.5px -1.5px 0 #0f54a8,  
                     1.5px -1.5px 0 #0f54a8,
                    -1.5px  1.5px 0 #0f54a8,
                     1.5px  1.5px 0 #0f54a8,
                     0px  2px 0px #0c4bb0,
                     0px  4px 0px #093582,
                     0px 8px 12px rgba(0,0,0,0.4)
                  `
                : 'none'
            }}>
            {prize.name}
          </h2>
        </div>

        {/* Podium & Prize Area */}
        <div className="relative w-full max-w-[260px] md:max-w-[320px] flex flex-col items-center mt-2">

          {/* Light Beams from behind */}
          <div className="absolute -inset-2 z-0 flex justify-center pointer-events-none">
            <div className="w-[50px] h-[100px] bg-white/10 blur-3xl rotate-45 transform origin-bottom -translate-x-10"></div>
            <div className="w-[50px] h-[100px] bg-white/10 blur-3xl -rotate-45 transform origin-bottom translate-x-10"></div>
          </div>

          {/* Prize Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
            className="z-30 w-40 h-40 md:w-[220px] md:h-[220px] mb-[-35px] md:mb-[-45px] relative flex items-end justify-center transform hover:scale-105 transition-transform duration-500 hover:rotate-2 pointer-events-none group"
          >
            {/* Real-time Contact Shadow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[60%] h-[8%] bg-black/60 blur-[8px] md:blur-[14px] rounded-[50%] z-10"
            />

            {/* Subtle Reflection */}
            {prize.imageUrl && (
              <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[30%] opacity-[0.1] blur-[2px] z-0 scale-y-[-0.5] pointer-events-none overflow-hidden">
                <Image
                  src={prize.imageUrl}
                  alt=""
                  fill
                  className="object-contain object-top"
                />
              </div>
            )}

            {prize.imageUrl ? (
              <div className="relative z-20 w-full h-full flex items-end justify-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                <Image
                  src={prize.imageUrl}
                  alt={prize.name}
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            ) : (
              <span className="text-[30px] md:text-[40px] leading-none mb-1 md:mb-2 z-20 drop-shadow-lg">{getPrizeIcon(prize.name)}</span>
            )}

            {/* Remaining Quantity Badge */}
            {prize.remainingQty !== undefined && (
              <div className="absolute top-0 right-0 md:top-1 md:right-1 bg-black/70 backdrop-blur-md text-white font-bold px-1 py-0.5 rounded-full text-[6px] border border-white/20 shadow-lg flex items-center gap-0.5 z-40">
                <span className={`w-1 h-1 rounded-full ${prize.remainingQty > 0 ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
                {prize.remainingQty}
              </div>
            )}
          </motion.div>

          {/* 3D CSS Podium Stage */}
          <div className="relative w-[130%] h-[45px] md:h-[60px] z-10">
            {/* Bottom Level (White) */}
            <div className="absolute bottom-0 w-full h-[15px] md:h-[20px]">
              {/* White cylinder top */}
              <div className="absolute top-0 w-full h-[7px] md:h-[10px] bg-[#f8f9fa] rounded-[50%] z-10"></div>
              {/* White cylinder body */}
              <div className="absolute top-[3.5px] md:top-[5px] w-full h-[7px] md:h-[10px] bg-[#e9ecef]"></div>
              {/* White cylinder bottom */}
              <div className="absolute bottom-0 w-full h-[9px] md:h-[13px] bg-[#e9ecef] rounded-[50%] shadow-[0_5px_8px_rgba(0,0,0,0.4)]"></div>
            </div>

            {/* Top Level (Blue) */}
            <div className="absolute bottom-[15px] md:bottom-[20px] w-[86%] left-[7%] h-[15px] md:h-[18px] z-20">
              {/* Blue cylinder top */}
              <div className="absolute top-0 w-full h-[7px] md:h-[9px] bg-[#0f62d1] rounded-[50%] z-10 border border-blue-400 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]"></div>
              {/* Blue cylinder body */}
              <div className="absolute top-[3.5px] md:top-[4.5px] w-full h-[7px] md:h-[9px] bg-[#0c4bb0]"></div>
              {/* Blue cylinder bottom */}
              <div className="absolute bottom-0 w-full h-[7px] md:h-[9px] bg-[#093582] rounded-[50%] shadow-[0_3px_5px_rgba(0,0,0,0.25)]"></div>
            </div>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
