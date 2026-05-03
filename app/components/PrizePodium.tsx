'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PrizePodiumProps {
  imageUrl?: string;
  prizeName: string;
  remainingQty?: number;
  /** compact=true in winner state (slightly smaller), false in prize-showcase state */
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
 * Layout strategy:
 *  - One wrapper with a fixed total height (imageH + podiumH - surface offset).
 *  - Podium is absolute-positioned at the bottom of the wrapper.
 *  - Image fills the area ABOVE the podium's flat surface so the prize
 *    appears to rest naturally on the stage — no floating, no overflow.
 *
 * "surface offset" = the height from the podium div's top to the blue
 *  flat surface (~45 % of podiumH). The image bottom aligns exactly there.
 */
export function PrizePodium({
  imageUrl,
  prizeName,
  remainingQty,
  compact = false,
}: PrizePodiumProps) {
  // ─── sizing ───────────────────────────────────────────────────────────────
  // Use numeric values so we can compute the overlap precisely in JS.
  // The wrapper uses inline style so viewport-relative clamping is retained
  // via CSS calc() where needed.
  const podiumHpx = compact ? 88 : 108;   // max-cap in px (matches min(Xvh,Ypx))
  const podiumHvh = compact ? 9 : 11;     // vh portion
  const imageHpx  = compact ? 360 : 400;
  const imageHvh  = compact ? 34 : 38;

  // The blue flat surface is ~45% from the podium div's top.
  // So the image box must end (its bottom) at exactly that Y from the wrapper top.
  // wrapper total height  = imageH + podiumH - surfaceFromTop
  // surfaceFromTop        = podiumH * 0.45
  // => totalH             = imageH + podiumH * 0.55
  const surfaceFrac = 0.45; // fraction of podiumH that is "above" the flat surface

  const totalHpx = imageHpx + podiumHpx * (1 - surfaceFrac);
  const totalHvh = imageHvh + podiumHvh * (1 - surfaceFrac);

  const maxW = compact
    ? 'max-w-[320px] md:max-w-[400px] lg:max-w-[460px]'
    : 'max-w-[420px] md:max-w-[520px] lg:max-w-[600px]';

  return (
    <div className={`relative w-full ${maxW}`}>
      {/* Ambient light beams */}
      <div className="absolute -inset-4 z-0 flex justify-center pointer-events-none overflow-hidden">
        <div className="w-[14vw] max-w-[120px] h-[25vh] max-h-[200px] bg-white/10 blur-3xl rotate-45 transform origin-bottom -translate-x-16" />
        <div className="w-[14vw] max-w-[120px] h-[25vh] max-h-[200px] bg-white/10 blur-3xl -rotate-45 transform origin-bottom translate-x-16" />
      </div>

      {/* ── Total wrapper ── */}
      <div
        className="relative w-full"
        style={{ height: `min(${totalHvh}vh, ${totalHpx}px)` }}
      >
        {/* ── Prize image — occupies top portion, bottom-anchored to surface ── */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
          className="absolute inset-x-0 top-0 z-30 pointer-events-none"
          style={{
            // bottom = podiumH * surfaceFrac below wrapper bottom
            // = podiumH * (1 - surfaceFrac) above wrapper bottom... wait:
            // image bottom = wrapper top + imageH = podiumH * 0.55 from wrapper bottom
            bottom: `min(${podiumHvh * surfaceFrac}vh, ${podiumHpx * surfaceFrac}px)`,
          }}
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
              {/* Subtle reflection */}
              <div
                className="absolute bottom-0 left-1/2 w-[80%] h-[25%] opacity-[0.07] blur-[3px] z-0 pointer-events-none overflow-hidden"
                style={{ transform: 'translateX(-50%) scaleY(-0.4)', transformOrigin: 'bottom' }}
              >
                <Image src={imageUrl} alt="" fill className="object-contain object-bottom" />
              </div>

              {/* Main prize image */}
              <div className="relative z-20 w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]">
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

          {/* Contact shadow at bottom of image = top of podium surface */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.65, duration: 0.8 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[6px] bg-black/45 blur-[6px] rounded-[50%] z-10"
          />
        </motion.div>

        {/* ── 3D CSS Podium Stage — anchored to wrapper bottom ── */}
        <div
          className="absolute inset-x-[-7.5%] bottom-0 z-20"
          style={{ height: `min(${podiumHvh}vh, ${podiumHpx}px)` }}
        >
          {/* White base cylinder */}
          <div className="absolute bottom-0 w-full h-[33%]">
            <div className="absolute top-0 w-full h-[50%] bg-[#f8f9fa] rounded-[50%] z-10" />
            <div className="absolute top-[25%] w-full h-[50%] bg-[#e9ecef]" />
            <div className="absolute bottom-0 w-full h-[60%] bg-[#e9ecef] rounded-[50%] shadow-[0_5px_8px_rgba(0,0,0,0.4)]" />
          </div>

          {/* Blue top level */}
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
