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
          className="fixed bottom-[80px] md:bottom-[100px] left-4 md:left-8 z-50 flex flex-col gap-1.5"
        >
          <span className="text-[10px] md:text-xs font-bold text-orange-400 uppercase tracking-widest drop-shadow-md">
            Mengacak Pemenang...
          </span>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-xl px-5 py-3 min-w-[200px] md:min-w-[250px] relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            
            <motion.div
              key={currentDisplay}
              initial={{ opacity: 0.5, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className="text-sm md:text-lg font-black text-white uppercase tracking-wider truncate"
            >
              {currentDisplay}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
