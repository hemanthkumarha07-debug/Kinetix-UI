import React, { useRef, useId } from 'react';
import { motion } from 'framer-motion';
import { useSpringTransition } from '../../context/MotionConfigContext';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MagneticSegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export function MagneticSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
  ariaLabel = 'Segmented Control',
}: MagneticSegmentedControlProps<T>) {
  const layoutId = useId();
  const spring = useSpringTransition();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = options.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextOption = options[nextIndex];
      if (!nextOption.disabled) {
        onChange(nextOption.value);
        tabsRef.current[nextIndex]?.focus();
      }
    }
  };

  const sizeClasses = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-sm',
    lg: 'p-1.5 text-base',
  }[size];

  const pillPadClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  }[size];

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center rounded-xl border border-border-subtle bg-surface-elevated ${sizeClasses} select-none ${className}`}
      style={{
        boxShadow: 'var(--specular-top)',
      }}
    >
      {options.map((opt, index) => {
        const isSelected = opt.value === value;

        return (
          <button
            key={opt.value}
            ref={(el) => (tabsRef.current[index] = el)}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${pillPadClasses} ${
              isSelected ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {/* Shared layoutId Active Pill */}
            {isSelected && (
              <motion.div
                layoutId={`active-pill-${layoutId}`}
                transition={spring}
                className="absolute inset-0 rounded-lg bg-surface border border-border-strong"
                style={{
                  boxShadow:
                    '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2), var(--specular-top)',
                }}
              />
            )}

            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              <span>{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
