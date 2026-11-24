import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown, ChevronUp, Gauge } from 'lucide-react';
import { useMotionConfig, type TimeScale, useSpringTransition } from '../context/MotionConfigContext';
import { MagneticSegmentedControl } from '../primitives/Controls/MagneticSegmentedControl';
import { PrecisionSlider } from '../primitives/Controls/PrecisionSlider';
import { SpringSparkline } from './SpringSparkline';

export const PhysicsInspectorDock: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    stiffness,
    damping,
    timeScale,
    setStiffness,
    setDamping,
    setTimeScale,
    resetMotion,
  } = useMotionConfig();
  const spring = useSpringTransition();

  const timeScaleOptions = [
    { value: '1' as const, label: '1×' },
    { value: '0.5' as const, label: '0.5×' },
    { value: '0.25' as const, label: '0.25× Slow' },
  ];

  const handleTimeScaleChange = (val: '1' | '0.5' | '0.25') => {
    setTimeScale(parseFloat(val) as TimeScale);
  };

  return (
    <aside
      aria-label="Motion Physics Inspector"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-full px-4"
    >
      <motion.div
        layout
        transition={spring}
        className="rounded-2xl border border-border-strong bg-surface/95 backdrop-blur-md shadow-dropdown text-text-primary overflow-hidden"
        style={{
          boxShadow:
            '0 0 0 1px var(--border-subtle), 0 20px 40px -10px rgba(0, 0, 0, 0.75), var(--specular-top)',
        }}
      >
        {/* Dock Header / Quick Bar */}
        <div className="flex items-center gap-3 px-3.5 py-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-surface-elevated text-accent-signal">
              <Gauge className="w-3.5 h-3.5" />
            </span>
            <span className="micro-label text-text-secondary hidden sm:inline">
              Physics Engine
            </span>
          </div>

          {/* Slow-Mo Warning Badge */}
          {timeScale === 0.25 && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] micro-label animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Slow-Mo 0.25× Active</span>
            </div>
          )}

          {/* Quick Speed Switcher */}
          <MagneticSegmentedControl<'1' | '0.5' | '0.25'>
            options={timeScaleOptions}
            value={String(timeScale) as '1' | '0.5' | '0.25'}
            onChange={handleTimeScaleChange}
            size="sm"
            ariaLabel="Global animation playback speed"
          />

          <div className="h-4 w-[1px] bg-border-subtle" />

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={resetMotion}
            className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            title="Reset default physics (460/34)"
            aria-label="Reset physics parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            aria-label={isExpanded ? 'Collapse physics dock' : 'Expand physics dock'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Detailed Sliders & Sparkline */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={spring}
              className="border-t border-border-subtle px-4 py-3 bg-surface-elevated/50"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Live Spring Trajectory Sparkline */}
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="micro-label text-[10px] text-text-tertiary">Trajectory Curve</span>
                    <span className="font-mono text-[10px] text-text-secondary tabular">
                      k={stiffness} c={damping}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg border border-border-subtle bg-surface">
                    <SpringSparkline stiffness={stiffness} damping={damping} width={130} height={36} />
                  </div>
                </div>

                {/* Inline Mini Sliders */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PrecisionSlider
                    label="Stiffness"
                    value={stiffness}
                    min={150}
                    max={700}
                    step={10}
                    onChange={setStiffness}
                    unit="N/m"
                  />
                  <PrecisionSlider
                    label="Damping"
                    value={damping}
                    min={12}
                    max={60}
                    step={1}
                    onChange={setDamping}
                    unit="Ns/m"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
};
