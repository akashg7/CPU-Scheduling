'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SchedBotFloat() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white pointer-events-none bg-schedos-surface border border-violet-500/40 shadow-xl"
          >
            Ask SchedBot 
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => router.push('/schedbot')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-600 to-violet-800 shadow-glow"
        aria-label="Open SchedBot"
      >
        <span className="absolute inset-0 rounded-2xl animate-ping opacity-30 bg-violet-500/50" style={{ animationDuration: '2s' }} />
        <span className="text-2xl relative z-10">🤖</span>
      </motion.button>
    </div>
  );
}
