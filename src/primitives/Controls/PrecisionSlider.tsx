import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PrecisionSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  formatValue?: (val: number) => string;
  ticks?: number[];
  className?: string;
  ariaLabel?: string;
}

export const PrecisionSlider: React.FC<PrecisionSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = '',
  formatValue,
  ticks,
  className = '',
  ariaLabel,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const updateFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const rawPct = (clientX - rect.left) / rect.width;
      const clampedPct = Math.max(0, Math.min(1, rawPct));
      const rawValue = min + clampedPct * (max - min);

      // Quantize to step
      const stepsCount = Math.round((rawValue - min) / step);
      const steppedValue = Math.min(max, Math.max(min, min + stepsCount * step));
      onChange(Number(steppedValue.toFixed(2)));
    },
    [min, max, step, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e.clientX);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let nextVal = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextVal = Math.min(max, value + step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextVal = Math.max(min, value - step);
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      nextVal = Math.min(max, value + step * 10);
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      nextVal = Math.max(min, value - step * 10);
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextVal = min;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextVal = max;
    }

    if (nextVal !== value) {
      onChange(Number(nextVal.toFixed(2)));
    }
  };

  const displayString = formatValue ? formatValue(value) : `${value}${unit ? ` ${unit}` : ''}`;

  return (
    <div className={`space-y-1.5 w-full select-none ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="micro-label text-text-secondary">{label}</span>
          <span className="font-mono text-xs tabular text-text-primary font-medium">
            {displayString}
          </span>
        </div>
      )}

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative py-2.5 cursor-pointer touch-none flex items-center"
      >
        {/* Track Bar */}
        <div className="relative w-full h-1.5 rounded-full bg-surface-elevated border border-border-subtle overflow-hidden">
          {/* Active Highlight Fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-accent-signal rounded-full transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Optional Tick Marks */}
        {ticks && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1 pointer-events-none">
            {ticks.map((tickVal) => {
              const tickPct = ((tickVal - min) / (max - min)) * 100;
              return (
                <div
                  key={tickVal}
                  className="w-0.5 h-1.5 bg-border-strong rounded-full"
                  style={{ left: `${tickPct}%` }}
                />
              );
            })}
          </div>
        )}

        {/* Accessible Draggable Thumb */}
        <div
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={ariaLabel || label || 'Slider'}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 focus-visible:outline-none"
          style={{ left: `${percentage}%` }}
        >
          {/* Floating Monospace Tooltip */}
          <AnimatePresence>
            {(isDragging || isFocused) && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.85 }}
                animate={{ opacity: 1, y: -26, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none micro-label px-1.5 py-0.5 rounded bg-surface border border-border-strong text-text-primary text-[10px] tabular whitespace-nowrap shadow-md z-30"
              >
                {displayString}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thumb Disc */}
          <div
            className={`w-4 h-4 rounded-full border border-border-strong bg-accent shadow-md transition-transform duration-75 flex items-center justify-center ${
              isDragging ? 'scale-90 shadow-sm' : 'hover:scale-110'
            } ${isFocused ? 'ring-2 ring-accent-signal ring-offset-2 ring-offset-canvas' : ''}`}
            style={{
              boxShadow: '0 2px 4px rgba(0,0,0,0.4), var(--specular-top)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-canvas" />
          </div>
        </div>
      </div>
    </div>
  );
};
