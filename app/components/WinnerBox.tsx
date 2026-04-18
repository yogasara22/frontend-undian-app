'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Winner } from '../types';

interface WinnerBoxProps {
  isRolling: boolean;
  winner: Winner | null;
  currentDisplay: string;
}

const nameVariants: Variants = {
  rolling: {
    opacity: [1, 0.4, 1],
    scale: [1, 0.98, 1],
    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
    transition: { duration: 0.15, repeat: Infinity },
  },
  winner: {
    opacity: 1,
    scale: [0.95, 1.05, 1],
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function WinnerBox({ isRolling, winner, currentDisplay }: WinnerBoxProps) {
  const xLights = Array.from({ length: 16 });
  const yLights = Array.from({ length: 5 });

  return (
    <div className="w-full flex justify-center relative z-20 px-2 lg:px-0">
      {/* Outer Blue Box */}
      <div className="relative w-full max-w-2xl bg-[#0f54a8] p-8 md:p-10 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)] border-[4px] border-[#09356d] rounded-[36px] md:rounded-[48px] overflow-hidden">
        
        {/* Lights Effect - Top */}
        <div className="absolute top-3 md:top-4 left-6 md:left-8 right-6 md:right-8 flex justify-between pointer-events-none">
          {xLights.map((_, i) => (
            <div key={`left-t-${i}`} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        
        {/* Lights Effect - Bottom */}
        <div className="absolute bottom-3 md:bottom-4 left-6 md:left-8 right-6 md:right-8 flex justify-between pointer-events-none">
          {xLights.map((_, i) => (
            <div key={`left-b-${i}`} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Lights Effect - Left */}
        <div className="absolute top-12 md:top-16 bottom-12 md:bottom-16 left-3 md:left-4 flex flex-col justify-between pointer-events-none">
          {yLights.map((_, i) => (
            <div key={`left-l-${i}`} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${(i+2) * 0.15}s` }} />
          ))}
        </div>

        {/* Lights Effect - Right */}
        <div className="absolute top-12 md:top-16 bottom-12 md:bottom-16 right-3 md:right-4 flex flex-col justify-between pointer-events-none">
          {yLights.map((_, i) => (
            <div key={`left-r-${i}`} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${(i+2) * 0.15}s` }} />
          ))}
        </div>

        {/* Yellow Inner Border (Thin & Clean) */}
        <div className="relative z-10 w-full h-full bg-[#fca311] p-2 md:p-[10px] rounded-[24px] md:rounded-[32px] shadow-[inset_0_-6px_12px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.4)] border border-[#e89000]/50 outline outline-2 outline-offset-[-2px] outline-[#fca311]">
          
          {/* Inner White Display Box */}
          <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8 md:p-12 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] rounded-[18px] md:rounded-[24px]" style={{ minHeight: '220px' }}>
            
            <AnimatePresence mode="wait">
              {/* Idle State */}
              {!isRolling && !winner && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <div className="w-full max-w-sm flex flex-col items-center justify-center mt-2">
                    <span className="text-gray-400 font-bold uppercase tracking-[0.4em] text-sm hidden md:block">Menunggu undian</span>
                    <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm md:hidden">Menunggu</span>
                    <div className="w-12 h-1 bg-gray-200 mt-4 rounded-full" />
                  </div>
                </motion.div>
              )}

              {/* Rolling State */}
              {isRolling && (
                <motion.div
                  key="rolling"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center justify-center"
                >
                  <motion.p
                    variants={nameVariants}
                    animate="rolling"
                    className="text-4xl md:text-6xl font-black tracking-tighter text-center uppercase text-gray-800 drop-shadow-md"
                  >
                    {currentDisplay}
                  </motion.p>
                </motion.div>
              )}

              {/* Winner State */}
              {!isRolling && winner && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <motion.p
                    variants={nameVariants}
                    animate="winner"
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-center uppercase bg-clip-text text-transparent bg-gradient-to-b from-[#e32924] to-[#991512] drop-shadow-sm"
                  >
                    {winner.name}
                  </motion.p>
                  
                  {winner.department && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="mt-2"
                    >
                      <span className="px-5 py-2 rounded-full bg-[#fca311]/10 border border-[#fca311] text-[#b06f02] text-sm md:text-base font-extrabold uppercase shadow-sm tracking-wide">
                        {winner.department}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </div>
  );
}
