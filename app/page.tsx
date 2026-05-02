'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLottery } from './hooks/useLottery';
import { ModeIndicator } from './components/ModeIndicator';
import WinnerBox from './components/WinnerBox';
import { PrizeSection } from './components/PrizeSection';
import { DrawButton } from './components/DrawButton';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ParticipantCounter } from './components/ParticipantCounter';
import { RollingBox } from './components/RollingBox';
import { useDynamicBackground } from './hooks/useDynamicBackground';

import { useState, useEffect } from 'react';

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isRolling, isLoading, winner, prize, activePrize, error, currentDisplay, startDraw, reset } = useLottery();
  const bgConfig = useDynamicBackground();

  useEffect(() => {
    setHasMounted(true);
    setIsAdmin(!!localStorage.getItem('isAdminLoggedIn'));
  }, []);

  const useImage = bgConfig.useImageBackground;
  const activeTitle = hasMounted ? (bgConfig.customTitle || 'UNDIAN BERHADIAH') : 'UNDIAN BERHADIAH';
  const activeTitleStyle = hasMounted ? bgConfig.titleStyle : undefined;
  const activePrizeStyle = hasMounted ? bgConfig.prizeStyle : undefined;

  // Visibility logic:
  // - Title: hidden when activePrize is selected OR winner is shown
  // - WinnerBox: hidden when activePrize is selected (until winner is found)
  // - PrizeSection: shown when activePrize OR winner+prize
  const showTitle = !winner && !activePrize;
  const showWinnerBox = !activePrize || !!winner; // Show in idle (no prize) or when winner found
  const showPrize = !!(winner ? prize : activePrize);
  const isCompactTitle = !!activePrize || !!winner; // Shrink title when prize visual or winner is shown

  return (
    <main
      suppressHydrationWarning
      className={`h-[100dvh] w-screen ${useImage ? '' : 'dynamic-bg'} flex flex-col items-center p-2 md:p-3 relative overflow-hidden font-sans bg-[#0a0a0a]`}
      style={{
        '--bg-from': bgConfig.from,
        '--bg-via': bgConfig.via,
        '--bg-to': bgConfig.to,
        ...(useImage && bgConfig.backgroundImage ? {
          backgroundImage: `url(${bgConfig.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {})
      } as React.CSSProperties}
    >
      {/* Floating Back Button - Only visible when winner is shown */}
      <AnimatePresence>
        {isAdmin && winner && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={reset}
            className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-4 py-2 bg-[#0f54a8]/80 hover:bg-[#0f54a8] backdrop-blur-md border border-white/30 rounded-full text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform group-hover:-translate-x-1">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="font-bold text-sm md:text-base tracking-wide">Undian Lagi</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dynamic Background elements */}
      <div suppressHydrationWarning className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${useImage ? 'opacity-30' : ''}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/40 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-200/50 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="w-full max-w-2xl flex-1 flex flex-col relative z-10 py-2 md:py-4">
        
        {/* Top Header - Logo and Title */}
        <div className="w-full flex flex-col items-center shrink-0 z-20">
          {/* Logo Placement Above Box */}
          <div className="mb-2 relative h-16 w-56 md:h-20 md:w-64 drop-shadow-lg">
            <Image
              src="/logo.png"
              alt="Main Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Title Text - Centered (Only in initial idle mode) */}
          {!winner && !activePrize && (
            <motion.div
              layout
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="mb-4 md:mb-8 text-center font-black italic tracking-tighter text-white drop-shadow-2xl"
              style={{ 
                fontFamily: '"Arial Black", "Impact", system-ui, sans-serif',
                lineHeight: '1', 
                textShadow: `
                    2px 2px 0 #2854a1,
                    3px 3px 0 #2854a1,
                    4px 4px 0 #2854a1,
                    5px 5px 0 #2854a1,
                    6px 6px 0 #2854a1,
                    7px 7px 0 #2854a1,
                    8px 8px 0 #2854a1,
                    9px 9px 0 #2854a1,
                    10px 10px 0 #1b3a73,
                    15px 15px 25px rgba(0,0,0,0.7)
                  `,
                WebkitTextStroke: '2px #102652'
              }}>
              <div className="text-3xl md:text-4xl lg:text-5xl">Strength of</div>
              <div className="text-4xl md:text-5xl lg:text-6xl">Loyalty &</div>
              <div className="text-4xl md:text-5xl lg:text-6xl">Relationships</div>
            </motion.div>
          )}
        </div>

        {/* Title Text - Fixed Top Right (Showcase Prize or Winner mode) */}
        <AnimatePresence>
          {(winner || activePrize) && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="fixed top-4 right-4 md:top-6 md:right-6 z-40 text-right font-black italic tracking-tight text-white/90"
              style={{ 
                fontFamily: '"Arial Black", "Impact", system-ui, sans-serif',
                lineHeight: '1.1', 
                textShadow: `
                  1px 1px 0 #2854a1,
                  2px 2px 0 #1b3a73,
                  3px 3px 8px rgba(0,0,0,0.5)
                `,
                WebkitTextStroke: '0.5px #102652'
              }}
            >
              <span className="text-xs md:text-sm lg:text-base">Strength of </span>
              <span className="text-sm md:text-base lg:text-lg">Loyalty & Relationships</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Content - WinnerBox and Prize */}
        <div className="w-full flex-1 flex flex-col items-center justify-center z-10 min-h-0">
          {/* WinnerBox - Hidden when activePrize is selected (until winner found) */}
          <AnimatePresence>
            {showWinnerBox && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <WinnerBox
                  isRolling={isRolling}
                  winner={winner}
                  currentDisplay={currentDisplay}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* PrizeSection - Shown when activePrize or winner+prize */}
          <PrizeSection
            winner={winner}
            prize={winner ? prize : activePrize}
            customTitle={winner ? activeTitle : (activePrize ? "SIAPAKAH YANG BERUNTUNG MENDAPATKAN:" : activeTitle)}
            titleStyle={activeTitleStyle}
            prizeStyle={activePrizeStyle}
          />
          <ErrorDisplay error={error} />
        </div>

        {/* Floating RollingBox - Bottom Left, above ParticipantCounter */}
        <RollingBox isRolling={isRolling} currentDisplay={currentDisplay} />

        {/* Floating Participant Counter - Bottom Left */}
        {!winner && (
          <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 shadow-lg rounded-xl overflow-hidden border border-white/10">
            <ParticipantCounter />
          </div>
        )}

        {/* Floating Draw Button - Bottom Right */}
        {!winner && isAdmin && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
            <DrawButton
              isRolling={isRolling}
              isLoading={isLoading}
              hasWinner={!!winner}
              onDraw={() => startDraw(activePrize?.id ? Number(activePrize.id) : undefined)}
              onReset={reset}
            />
          </div>
        )}

      </div>
    </main>
  );
}

