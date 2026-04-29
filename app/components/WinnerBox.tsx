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
      <div className="relative w-full max-w-sm bg-[#0f54a8] p-2 md:p-3 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)] border-[2px] border-[#09356d] rounded-[16px] md:rounded-[24px] overflow-hidden">

        {/* Lights Effect - Top */}
        <div className="absolute top-1.5 md:top-2 left-6 md:left-8 right-6 md:right-8 flex justify-between pointer-events-none">
          {xLights.map((_, i) => (
            <div key={`left-t-${i}`} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white shadow-[0_0_4px_1px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Lights Effect - Bottom */}
        <div className="absolute bottom-1.5 md:bottom-2 left-6 md:left-8 right-6 md:right-8 flex justify-between pointer-events-none">
          {xLights.map((_, i) => (
            <div key={`left-b-${i}`} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white shadow-[0_0_4px_1px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Lights Effect - Left */}
        <div className="absolute top-6 md:top-8 bottom-6 md:bottom-8 left-1.5 md:left-2 flex flex-col justify-between pointer-events-none">
          {yLights.map((_, i) => (
            <div key={`left-l-${i}`} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white shadow-[0_0_4px_1px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${(i + 2) * 0.15}s` }} />
          ))}
        </div>

        {/* Lights Effect - Right */}
        <div className="absolute top-6 md:top-8 bottom-6 md:bottom-8 right-1.5 md:right-2 flex flex-col justify-between pointer-events-none">
          {yLights.map((_, i) => (
            <div key={`left-r-${i}`} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white shadow-[0_0_4px_1px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: `${(i + 2) * 0.15}s` }} />
          ))}
        </div>

        {/* Yellow Inner Border (Thin & Clean) */}
        <div className="relative z-10 w-full h-full bg-[#fca311] p-1 rounded-[14px] md:rounded-[20px] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.4)] border border-[#e89000]/50 outline outline-1 outline-offset-[-1px] outline-[#fca311]">

          {/* Inner White Display Box */}
          <div className="w-full h-full bg-white flex flex-col items-center justify-center p-1.5 md:p-2.5 shadow-[inset_0_1px_6px_rgba(0,0,0,0.05)] rounded-[12px] md:rounded-[16px]" style={{ minHeight: '70px' }}>

            <AnimatePresence mode="wait">
              {/* Idle State */}
              {!isRolling && !winner && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-0.5 w-full"
                >
                  <div className="w-full max-w-sm flex flex-col items-center justify-center">
                    <span className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[8px] hidden md:block">Menunggu undian</span>
                    <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[7px] md:hidden">Menunggu</span>
                    <div className="w-5 h-0.5 bg-gray-100 mt-1 rounded-full" />
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
                    className="text-lg md:text-2xl font-black tracking-tighter text-center uppercase text-gray-800"
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
                  className="flex flex-col items-center gap-0 w-full"
                >
                  <motion.p
                    variants={nameVariants}
                    animate="winner"
                    className="text-lg md:text-xl lg:text-2xl font-black tracking-tighter text-center uppercase bg-clip-text text-transparent bg-gradient-to-b from-[#e32924] to-[#991512] leading-tight"
                  >
                    {winner.name}
                  </motion.p>

                  {winner.shopName && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex items-center justify-center w-full"
                    >
                      <span className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-widest text-center">
                        {winner.shopName}
                      </span>
                    </motion.div>
                  )}

                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {winner.department && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <span className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-500 text-[7px] md:text-[8px] font-bold uppercase tracking-wider">
                          {winner.department}
                        </span>
                      </motion.div>
                    )}

                    {winner.ktpNumber && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                      >
                        <span className="px-2 py-0.5 rounded bg-[#fca311] text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.1em]">
                          {winner.ktpNumber}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
