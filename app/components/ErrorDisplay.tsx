'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400"
        >
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-sm">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
