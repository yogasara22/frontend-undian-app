'use client';

import Image from 'next/image';
import { useLottery } from './hooks/useLottery';
import { ModeIndicator } from './components/ModeIndicator';
import WinnerBox from './components/WinnerBox';
import { PrizeSection } from './components/PrizeSection';
import { DrawButton } from './components/DrawButton';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ParticipantCounter } from './components/ParticipantCounter';

export default function Home() {
  const { isRolling, isLoading, winner, prize, error, currentDisplay, startDraw, reset } = useLottery();

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Dynamic Background elements (Soft highlights) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/40 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-200/50 blur-[120px]" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </div>

      {/* Main Content Wrapper - Centers Everything with consistent gap */}
      <div className="w-full max-w-4xl flex flex-col justify-center gap-6 md:gap-10 relative z-10 min-h-fit py-4">
        
        {/* Header containing Logo and Indicators */}
        <div className="w-full flex items-center justify-between bg-white/20 backdrop-blur-md px-5 py-3 md:px-6 md:py-4 rounded-[20px] md:rounded-[24px] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] shrink-0">
          <div className="flex gap-3 items-center">
             <div className="relative h-8 w-40 md:h-10 md:w-56 drop-shadow-sm">
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

        {/* Center Canvas: Marquee Winner Box & Podium Area */}
        <div className="w-full flex flex-col items-center justify-center shrink-0">
          <WinnerBox
            isRolling={isRolling}
            winner={winner}
            currentDisplay={currentDisplay}
          />
          <PrizeSection winner={winner} prize={prize} />
          <ErrorDisplay error={error} />
        </div>

        {/* Actions Layout (Bottom Bar) */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/20 backdrop-blur-md px-5 py-4 rounded-[20px] md:rounded-[24px] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] shrink-0">
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
