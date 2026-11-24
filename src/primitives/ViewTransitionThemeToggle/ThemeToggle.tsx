import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSpringTransition } from '../../context/MotionConfigContext';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const spring = useSpringTransition();

  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'Alabaster Light' : 'Obsidian Dark'} mode`}
      title={`Current: ${isDark ? 'Obsidian Dark' : 'Alabaster Light'} (Click to toggle)`}
      className={`group relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border-strong bg-surface hover:bg-surface-elevated text-text-primary transition-colors focus-visible:shadow-focus-ring ${className}`}
      style={{
        boxShadow: 'var(--specular-top)',
      }}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -45, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 45, scale: 0.6, opacity: 0 }}
          transition={spring}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-accent-signal" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <span className="micro-label text-[11px] text-text-secondary group-hover:text-text-primary">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
