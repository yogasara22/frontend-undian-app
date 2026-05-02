'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RollingBoxProps {
  isRolling: boolean;
  currentDisplay: string;
}

export function RollingBox({ isRolling, currentDisplay }: RollingBoxProps) {
  return (
    <AnimatePresence>
      {isRolling && (
        <motion.div
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-[80px] md:bottom-[100px] left-4 md:left-8 z-50"
        >
          <div className="bg-black/50 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl px-4 py-2.5 min-w-[220px] md:min-w-[280px]">
            {/* Label row */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-bold text-orange-400/80 uppercase tracking-[0.15em]">
                Mengacak Peserta
              </span>
            </div>

            {/* Name display */}
            <div className="flex items-center gap-2.5">
              {/* Person icon */}
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Cycling name */}
              <motion.span
                key={currentDisplay}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.05 }}
                className="text-sm md:text-base font-black text-white uppercase tracking-wide truncate"
              >
                {currentDisplay}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

