'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PrizePodiumProps {
  imageUrl?: string;
  prizeName: string;
  remainingQty?: number;
  /** compact=true in winner state */
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
 * PrizePodium
 *
 * Layout: flex-column.
 *   [image div — fixed height, object-contain object-bottom]
 *   [podium div — pulls UP via negative marginTop, overlapping into image area]
 *
 * The negative margin = podiumH * overlapFrac.
 * This places the blue surface ABOVE the image bottom, so the car
 * (anchored to image bottom via object-bottom) sits ON the blue surface.
 *
 * overlapFrac is tuned so that even PNGs with ~30px transparent padding
 * at the bottom still look connected to the podium.
 */
export function PrizePodium({
  imageUrl,
  prizeName,
  remainingQty,
  compact = false,
}: PrizePodiumProps) {
  // Sizes
  const podiumHvh = compact ? 8   : 10;
  const podiumHpx = compact ? 80  : 100;
  const imageHvh  = compact ? 26  : 34;
  const imageHpx  = compact ? 260 : 340;

  // Pull podium UP by this fraction of its height.
  // 0.70 = the podium overlaps 70% of its height into the image area.
  // The blue "flat surface" sits at ~45% from the podium top,
  // so a 70% overlap puts the surface well above the image bottom,
  // ensuring the car rests ON the blue stage despite PNG transparent padding.
  const overlapFrac = 0.70;

  const maxW = compact
    ? 'max-w-[300px] md:max-w-[380px]'
    : 'max-w-[420px] md:max-w-[520px] lg:max-w-[580px]';

  // CSS calc strings
  const imageH   = `min(${imageHvh}vh, ${imageHpx}px)`;
  const podiumH  = `min(${podiumHvh}vh, ${podiumHpx}px)`;
  const negMargin = `calc(min(${podiumHvh}vh, ${podiumHpx}px) * -${overlapFrac})`;

  return (
    <div className={`relative w-full ${maxW} mx-auto flex flex-col items-center`}>
      {/* Ambient light beams */}
      <div className="absolute -inset-4 z-0 flex justify-center pointer-events-none overflow-hidden">
        <div className="w-[14vw] max-w-[100px] h-[20vh] max-h-[160px] bg-white/10 blur-3xl rotate-45 transform origin-bottom -translate-x-12" />
        <div className="w-[14vw] max-w-[100px] h-[20vh] max-h-[160px] bg-white/10 blur-3xl -rotate-45 transform origin-bottom translate-x-12" />
      </div>

      {/* ── Prize Image ── */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
        className="relative w-full z-30 pointer-events-none"
        style={{ height: imageH }}
      >
        {/* Remaining qty badge */}
        {remainingQty !== undefined && (
          <div className="absolute top-0 right-0 z-40 bg-black/70 backdrop-blur-md text-white font-bold px-1.5 py-0.5 rounded-full text-[9px] border border-white/20 shadow-lg flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${remainingQty > 0 ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
            {remainingQty}
          </div>
        )}

        {imageUrl ? (
          <div className="relative w-full h-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.70)]">
            <Image
              src={imageUrl}
              alt={prizeName}
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-end justify-center pb-2">
            <span className="text-5xl drop-shadow-lg">{getPrizeIcon(prizeName)}</span>
          </div>
        )}

        {/* Contact shadow — bottom of image div = where car touches podium */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[58%] h-[10px] bg-black/50 blur-[10px] rounded-[50%] z-10"
        />
      </motion.div>

      {/* ── 3D CSS Podium Stage — pulled UP via negative marginTop ── */}
      <div
        className="relative w-[115%] z-20 shrink-0"
        style={{
          height: podiumH,
          marginTop: negMargin,
        }}
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
  );
}
