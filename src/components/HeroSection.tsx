import React from 'react';
import { motion } from 'framer-motion';
import { Command, Gauge, ShieldCheck, Zap } from 'lucide-react';
import { KeycapStrip } from './KeycapStrip';
import { useSpringTransition } from '../context/MotionConfigContext';

export interface HeroSectionProps {
  onOpenCmdK: () => void;
  onScrollToPhysics: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCmdK,
  onScrollToPhysics,
}) => {
  const spring = useSpringTransition();

  const titleWords = ['Precision', 'UI', 'Primitives.', 'Zero', 'Compromises.'];

  return (
    <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden border-b border-border-subtle">
      {/* Architectural Hairline Grid with Radial Vignette */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle 600px at 50% 20%, transparent 20%, var(--bg-canvas) 85%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Engineering Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={spring}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-strong bg-surface/80 backdrop-blur-sm text-text-secondary mb-6 text-xs"
          style={{ boxShadow: 'var(--specular-top)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-status-ok" />
          <span className="micro-label text-[10px] tracking-wider text-text-primary">
            Zero-Dependency WAI-ARIA Architecture
          </span>
        </motion.div>

        {/* Display Headline with Blur-to-Sharp Entrance */}
        <h1 className="display-headline text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary max-w-3xl mb-6">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ ...spring, delay: i * 0.07 }}
              className="inline-block mr-2.5 sm:mr-3.5 last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
          className="text-sm sm:text-lg text-text-secondary max-w-2xl leading-relaxed mb-8"
        >
          An uncompromising React + TypeScript component playground. Engineered completely from scratch with pure mathematical spring physics, custom focus traps, and view transitions.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mb-12"
        >
          <button
            type="button"
            onClick={onOpenCmdK}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-canvas font-medium text-sm hover:opacity-95 transition-all shadow-lg active:scale-95"
            style={{
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25), var(--specular-top)',
            }}
          >
            <Command className="w-4 h-4 stroke-[2.5]" />
            <span>Open Command Palette</span>
            <kbd className="micro-label ml-1 px-1.5 py-0.5 rounded bg-canvas/15 text-[10px] tabular">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={onScrollToPhysics}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-strong bg-surface hover:bg-surface-elevated text-text-primary font-medium text-sm transition-all active:scale-95"
            style={{ boxShadow: 'var(--specular-top)' }}
          >
            <Gauge className="w-4 h-4 text-accent-signal" />
            <span>Inspect Slow-Mo Physics</span>
          </button>
        </motion.div>

        {/* Interactive Hardware Keycap Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.55 }}
          className="w-full max-w-xl p-4 sm:p-6 rounded-2xl border border-border-subtle bg-surface/40 backdrop-blur-sm"
          style={{ boxShadow: 'var(--specular-top)' }}
        >
          <KeycapStrip onCmdKTrigger={onOpenCmdK} />
        </motion.div>

        {/* Engineering Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-3xl text-left border-t border-border-subtle pt-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Zap className="w-3.5 h-3.5 text-accent-signal" />
              <span>Zero Bloat</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              0 Radix, 0 HeadlessUI, 0 Sonner, 0 Cmdk. 100% custom primitives.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-status-ok" />
              <span>WAI-ARIA</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Deterministic focus traps, activedescendant, and keyboard matrix.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Gauge className="w-3.5 h-3.5 text-amber-500" />
              <span>Harmonic Springs</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Mathematically scaled trajectories in 1x, 0.5x, and 0.25x slow-mo.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Command className="w-3.5 h-3.5 text-purple-400" />
              <span>View Transitions</span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Hypotenuse circular clip-path expansion anchored to click origin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
