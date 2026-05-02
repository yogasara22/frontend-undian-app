'use client';

import Image from 'next/image';
import { useLottery } from './hooks/useLottery';
import { ModeIndicator } from './components/ModeIndicator';
import WinnerBox from './components/WinnerBox';
import { PrizeSection } from './components/PrizeSection';
import { DrawButton } from './components/DrawButton';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ParticipantCounter } from './components/ParticipantCounter';
import { useDynamicBackground } from './hooks/useDynamicBackground';

import { useState, useEffect } from 'react';

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isRolling, isLoading, winner, prize, error, currentDisplay, startDraw, reset } = useLottery();
  const bgConfig = useDynamicBackground();

  useEffect(() => {
    setHasMounted(true);
    setIsAdmin(!!localStorage.getItem('isAdminLoggedIn'));
  }, []);

  const useImage = bgConfig.useImageBackground;
  const activeTitle = hasMounted ? (bgConfig.customTitle || 'UNDIAN BERHADIAH') : 'UNDIAN BERHADIAH';
  const activeTitleStyle = hasMounted ? bgConfig.titleStyle : undefined;
  const activePrizeStyle = hasMounted ? bgConfig.prizeStyle : undefined;

  return (
    <main
      suppressHydrationWarning
      className={`min-h-screen ${useImage ? '' : 'dynamic-bg'} flex flex-col items-center p-2 md:p-3 relative overflow-y-auto overflow-x-hidden font-sans bg-[#0a0a0a]`}
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

      {/* Dynamic Background elements */}
      <div suppressHydrationWarning className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${useImage ? 'opacity-30' : ''}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/40 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-200/50 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      <div className="w-full max-w-2xl flex-1 flex flex-col relative z-10 py-1">
        

        {/* Center Content - Absolutely centered with zero extra padding */}
        <div className="w-full flex-grow flex flex-col items-center justify-center z-0">
          <div className="w-full flex flex-col items-center justify-center space-y-0">
            
            {/* Logo Placement Above Box */}
            <div className="mb-8 md:mb-10 relative h-16 w-56 md:h-20 md:w-64 drop-shadow-lg z-10">
              <Image
                src="/logo.png"
                alt="Main Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title Text */}
            {!winner && (
              <div className="mb-12 md:mb-16 z-10 flex flex-col items-center justify-center font-black italic tracking-tighter text-white drop-shadow-2xl"
                   style={{ 
                     fontFamily: '"Arial Black", "Impact", system-ui, sans-serif',
                     lineHeight: '0.9', 
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
                <span className="text-3xl md:text-4xl lg:text-5xl -mb-1">Strength of</span>
                <span className="text-4xl md:text-5xl lg:text-6xl -mb-1">Loyalty &</span>
                <span className="text-4xl md:text-5xl lg:text-6xl">Relationships</span>
              </div>
            )}

            <WinnerBox
              isRolling={isRolling}
              winner={winner}
              currentDisplay={currentDisplay}
            />
            <PrizeSection
              winner={winner}
              prize={prize}
              customTitle={activeTitle}
              titleStyle={activeTitleStyle}
              prizeStyle={activePrizeStyle}
            />
            <ErrorDisplay error={error} />
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-[10px] border border-white/20 shadow-sm shrink-0 z-50">
          <div>
            <ParticipantCounter />
          </div>
          {isAdmin && (
            <DrawButton
              isRolling={isRolling}
              isLoading={isLoading}
              hasWinner={!!winner}
              onDraw={startDraw}
              onReset={reset}
            />
          )}
        </div>

      </div>
    </main>
  );
}
