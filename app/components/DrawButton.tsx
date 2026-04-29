'use client';

import { motion } from 'framer-motion';

interface DrawButtonProps {
  isRolling: boolean;
  isLoading: boolean;
  hasWinner: boolean;
  onDraw: () => void;
  onReset: () => void;
}

export function DrawButton({ isRolling, isLoading, hasWinner, onDraw, onReset }: DrawButtonProps) {
  const isDisabled = isRolling || isLoading;

  if (hasWinner) {
    return (
      <motion.button
        onClick={onReset}
        disabled={isDisabled}
        aria-label="Mulai undian baru"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="relative px-6 py-3 rounded-xl font-bold text-xs text-gray-700 bg-white shadow-sm hover:shadow-md transition-all border border-gray-200 flex items-center gap-2 group"
      >
        <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <span className="font-bold tracking-wide">Undian Lagi</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onDraw}
      disabled={isDisabled}
      aria-label={isRolling ? 'Sedang mengundi...' : 'Mulai undian'}
      whileHover={{ scale: isDisabled ? 1 : 1.03, y: isDisabled ? 0 : -2 }}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      className="relative px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:shadow-2xl transition-all overflow-hidden flex items-center gap-2.5 cursor-pointer"
      style={{
        background: isDisabled
          ? '#9ca3af' // gray-400
          : 'linear-gradient(135deg, #2563eb, #6366f1)', // blue-600 to indigo-500
      }}
    >
      {/* Sleek reflection */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, #ffffff 50%, transparent 60%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
      
      <div className="relative z-10 flex items-center gap-2.5">
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            <span className="tracking-wide text-white/90">Mengundi...</span>
          </>
        ) : (
          <>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <span className="tracking-wide font-extrabold pr-1">Mulai Undian</span>
          </>
        )}
      </div>
    </motion.button>
  );
}
