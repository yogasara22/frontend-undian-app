'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PrizePodiumProps {
  imageUrl?: string;
  prizeName: string;
  remainingQty?: number;
  /** compact=true in winner state (smaller), false in prize-showcase state */
  compact?: boolean;
}

function getPrizeIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('laptop')) return '💻';
  if (n.includes('smartphone') || n.includes('hp') || n.includes('phone') || n.includes('iphone')) return '📱';
  if (n.includes('tv') || n.includes('televisi')) return '📺';
  if (n.includes('sepeda') || n.includes('motor')) return '🏍️';
  if (n.includes('kamera') || n.includes('camera')) return '📷';
  if (n.includes('headphone') || n.includes('earphone')) return '🎧';
  if (n.includes('voucher') || n.includes('belanja')) return '🛍️';
  return '🎁';
}

/**
 * PrizePodium — unified prize image + podium stage.
 *
 * Layout:
 *   One wrapper with fixed height = imageH + podiumH * (1 - surfaceFrac).
 *   - Podium: absolute, bottom-0, height = podiumH.
 *   - Image: absolute, top-0 … bottom = podiumH * surfaceFrac from wrapper bottom.
 *
 * surfaceFrac = fraction of podiumH that is BELOW the blue flat surface.
 * From CSS: blue cylinder is at bottom-[25%] h-[30%].
 *   Blue top ellipse top = podiumH - (0.25+0.30)*podiumH = 0.45*podiumH from top
 *                        = 0.55*podiumH from bottom  ← surfaceFrac = 0.55
 *
 * So image bottom aligns at the blue surface → car appears to rest on podium.
 */
export function PrizePodium({
  imageUrl,
  prizeName,
  remainingQty,
  compact = false,
}: PrizePodiumProps) {
  // Podium & image sizes. Compact is used in winner state (less vertical room).
  const podiumHpx = compact ? 72  : 100;
  const podiumHvh = compact ? 8   : 10;
  const imageHpx  = compact ? 220 : 340;
  const imageHvh  = compact ? 22  : 34;

  // The blue flat surface sits at 55% of podiumH from the wrapper's bottom.
  // Setting image's bottom to this value makes the car rest exactly on the surface.
  const surfaceFrac = 0.55;

  // Total wrapper height = imageH + the portion of podiumH below the surface
  const totalHpx = imageHpx + podiumHpx * (1 - surfaceFrac); // imageH + podiumH*0.45
  const totalHvh = imageHvh + podiumHvh * (1 - surfaceFrac);

  const maxW = compact
    ? 'max-w-[280px] md:max-w-[360px]'
    : 'max-w-[420px] md:max-w-[520px] lg:max-w-[580px]';

  const imageSurfaceBottom = `min(${(podiumHvh * surfaceFrac).toFixed(2)}vh, ${(podiumHpx * surfaceFrac).toFixed(1)}px)`;

  return (
    <div className={`relative w-full ${maxW} mx-auto`}>
      {/* Ambient light beams */}
      <div className="absolute -inset-4 z-0 flex justify-center pointer-events-none overflow-hidden">
        <div className="w-[14vw] max-w-[100px] h-[20vh] max-h-[160px] bg-white/10 blur-3xl rotate-45 transform origin-bottom -translate-x-12" />
        <div className="w-[14vw] max-w-[100px] h-[20vh] max-h-[160px] bg-white/10 blur-3xl -rotate-45 transform origin-bottom translate-x-12" />
      </div>

      {/* ── Unified wrapper: image + podium share one coordinate space ── */}
      <div
        className="relative w-full overflow-visible"
        style={{ height: `min(${totalHvh.toFixed(2)}vh, ${totalHpx.toFixed(1)}px)` }}
      >
        {/* ── Prize Image ── absolute, top-0, bottom = podiumH * surfaceFrac */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
          className="absolute inset-x-0 top-0 z-30 pointer-events-none"
          style={{ bottom: imageSurfaceBottom }}
        >
          {/* Remaining qty badge */}
          {remainingQty !== undefined && (
            <div className="absolute top-0 right-0 z-40 bg-black/70 backdrop-blur-md text-white font-bold px-1.5 py-0.5 rounded-full text-[9px] border border-white/20 shadow-lg flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${remainingQty > 0 ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
              {remainingQty}
            </div>
          )}

          {imageUrl ? (
            <>
              {/* Main prize image — object-bottom anchors car to the image div's bottom */}
              <div className="relative z-20 w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]">
                <Image
                  src={imageUrl}
                  alt={prizeName}
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-end justify-center pb-2">
              <span className="text-5xl drop-shadow-lg">{getPrizeIcon(prizeName)}</span>
            </div>
          )}

          {/* Contact shadow — at image div bottom = blue podium surface */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[8px] bg-black/40 blur-[8px] rounded-[50%] z-10"
          />
        </motion.div>

        {/* ── 3D CSS Podium Stage — absolute, bottom-0 ── */}
        <div
          className="absolute inset-x-[-8%] bottom-0 z-20"
          style={{ height: `min(${podiumHvh}vh, ${podiumHpx}px)` }}
        >
          {/* White base cylinder */}
          <div className="absolute bottom-0 w-full h-[33%]">
            <div className="absolute top-0 w-full h-[50%] bg-[#f8f9fa] rounded-[50%] z-10" />
            <div className="absolute top-[25%] w-full h-[50%] bg-[#e9ecef]" />
            <div className="absolute bottom-0 w-full h-[60%] bg-[#e9ecef] rounded-[50%] shadow-[0_5px_8px_rgba(0,0,0,0.4)]" />
          </div>

          {/* Blue top level cylinder */}
          <div className="absolute bottom-[25%] w-[86%] left-[7%] h-[30%] z-20">
            <div className="absolute top-0 w-full h-[50%] bg-[#0f62d1] rounded-[50%] z-10 border border-blue-400 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]" />
            <div className="absolute top-[25%] w-full h-[50%] bg-[#0c4bb0]" />
            <div className="absolute bottom-0 w-full h-[50%] bg-[#093582] rounded-[50%] shadow-[0_3px_5px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
