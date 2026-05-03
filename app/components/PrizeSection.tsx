'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Winner, Prize } from '../types';
import { type TypographyConfig } from '../lib/settings';
import { PrizePodium } from './PrizePodium';

interface PrizeSectionProps {
  winner: Winner | null;
  prize: Prize | null;
  customTitle?: string;
  titleStyle?: TypographyConfig;
  prizeStyle?: TypographyConfig;
}

export function PrizeSection({
  winner,
  prize,
  customTitle = 'UNDIAN BERHADIAH',
  titleStyle,
  prizeStyle,
}: PrizeSectionProps) {
  if (!prize) return null;

  const hasWinner = !!winner;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full relative mt-0.5 flex flex-col items-center z-10"
      >
        {/* ── Label area (title + prize name) ── */}
        <div className="flex flex-col items-center mb-1 relative z-30 text-center w-full">
          {customTitle && (
            <div className="flex items-center justify-center gap-1.5">
              <svg width="14" height="18" viewBox="0 0 24 24" fill="white"
                className="hidden sm:block flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] -rotate-12 opacity-90">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <h3 className="uppercase"
                style={{
                  fontFamily: titleStyle?.fontFamily || 'inherit',
                  fontSize: `clamp(14px, 2.5vh, ${titleStyle?.fontSize ? titleStyle.fontSize * 0.45 : 18}px)`,
                  color: titleStyle?.color || '#FFFFFF',
                  fontWeight: titleStyle?.fontWeight || '800',
                  letterSpacing: `${titleStyle?.letterSpacing || 1}px`,
                  fontVariant: 'all-small-caps',
                  textShadow: titleStyle?.textShadow
                    ? '-1px -1px 0 #0f54a8, 1px -1px 0 #0f54a8, -1px 1px 0 #0f54a8, 1px 1px 0 #0f54a8'
                    : 'none',
                }}>
                {customTitle}
              </h3>
              <svg width="12" height="16" viewBox="0 0 24 24" fill="white"
                className="hidden sm:block flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] rotate-12 opacity-90">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          )}
          <h2 className="uppercase leading-tight md:leading-none px-4"
            style={{
              fontFamily: prizeStyle?.fontFamily || 'inherit',
              fontSize: `clamp(28px, 4.5vh, ${prizeStyle?.fontSize ? prizeStyle.fontSize * 0.7 : 48}px)`,
              color: prizeStyle?.color || '#FFFFFF',
              fontWeight: prizeStyle?.fontWeight || '900',
              letterSpacing: `${prizeStyle?.letterSpacing || 0}px`,
              textShadow: prizeStyle?.textShadow
                ? '-1.5px -1.5px 0 #0f54a8, 1.5px -1.5px 0 #0f54a8, -1.5px 1.5px 0 #0f54a8, 1.5px 1.5px 0 #0f54a8, 0px 4px 0px #093582, 0px 8px 12px rgba(0,0,0,0.4)'
                : 'none',
            }}>
            {prize.name}
          </h2>
        </div>

        {/* ── Unified Prize Image + Podium (isolated component) ── */}
        <div className="flex justify-center w-full mt-1">
          <PrizePodium
            imageUrl={prize.imageUrl}
            prizeName={prize.name}
            remainingQty={prize.remainingQty}
            compact={hasWinner}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
