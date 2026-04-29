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
  const { isRolling, isLoading, winner, prize, error, currentDisplay, startDraw, reset } = useLottery();
  const bgConfig = useDynamicBackground();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const useImage = bgConfig.useImageBackground;
  const activeTitle = hasMounted ? (bgConfig.customTitle || 'UNDIAN BERHADIAH') : 'UNDIAN BERHADIAH';
  const activeTitleStyle = hasMounted ? bgConfig.titleStyle : undefined;
  const activePrizeStyle = hasMounted ? bgConfig.prizeStyle : undefined;

  return (
    <main
      suppressHydrationWarning
      className={`h-screen min-h-[600px] ${useImage ? '' : 'dynamic-bg'} flex flex-col items-center p-2 md:p-3 relative overflow-hidden font-sans bg-[#0a0a0a]`}
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

      <div className="w-full max-w-2xl h-full flex flex-col relative z-10 py-1">
        
        {/* Header - Compact */}
        <div className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md px-3 py-1 rounded-[10px] border border-white/20 shadow-sm shrink-0 z-50">
          <div className="flex gap-2 items-center">
            <div className="relative h-4 w-24 md:h-5 md:w-28 drop-shadow-sm">
              <Image
                src="/logo-clipan-finance.png"
                alt="Clipan Finance Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <ModeIndicator />
        </div>

        {/* Center Content - Absolutely centered with zero extra padding */}
        <div className="w-full flex-grow flex flex-col items-center justify-center overflow-hidden z-0">
          <div className="w-full flex flex-col items-center justify-center space-y-0">
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
          <DrawButton
            isRolling={isRolling}
            isLoading={isLoading}
            hasWinner={!!winner}
            onDraw={startDraw}
            onReset={reset}
          />
        </div>

      </div>
    </main>
  );
}
