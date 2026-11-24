import React, { useState, useEffect } from 'react';

interface KeycapProps {
  label: string;
  sublabel?: string;
  isPressed: boolean;
  onClick?: () => void;
  width?: string;
}

const Keycap: React.FC<KeycapProps> = ({
  label,
  sublabel,
  isPressed,
  onClick,
  width = 'w-10 sm:w-14',
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={-1}
      aria-label={`Keycap ${label}`}
      className={`group relative ${width} h-11 sm:h-14 rounded-xl border border-border-strong bg-surface select-none cursor-pointer flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all duration-75 ${
        isPressed
          ? 'translate-y-[2px] bg-surface-active border-accent-signal shadow-none'
          : 'hover:border-text-tertiary shadow-[0_4px_0_0_var(--border-strong),0_6px_12px_rgba(0,0,0,0.4)]'
      }`}
      style={{
        boxShadow: isPressed
          ? '0 1px 0 0 var(--border-subtle), inset 0 1px 2px rgba(0,0,0,0.5)'
          : undefined,
      }}
    >
      {/* Top LED Indicator Dot */}
      <div className="w-full flex justify-between items-center px-1">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
            isPressed
              ? 'bg-accent-signal shadow-[0_0_6px_var(--accent-signal)]'
              : 'bg-border-strong'
          }`}
        />
        {sublabel && (
          <span className="micro-label text-[9px] text-text-tertiary">
            {sublabel}
          </span>
        )}
      </div>

      {/* Main Legend */}
      <span className="font-mono text-sm sm:text-base font-semibold text-text-primary tabular">
        {label}
      </span>

      <span className="h-1" />
    </div>
  );
};

export interface KeycapStripProps {
  onCmdKTrigger?: () => void;
}

export const KeycapStrip: React.FC<KeycapStripProps> = ({ onCmdKTrigger }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        if (e.metaKey || e.ctrlKey) next.add('META');
        if (e.key.toLowerCase() === 'k') next.add('K');
        if (e.key === 'Tab') next.add('TAB');
        if (e.key === 'Escape') next.add('ESC');
        if (e.key === 'ArrowUp') next.add('UP');
        if (e.key === 'ArrowDown') next.add('DOWN');
        if (e.key === 'Enter') next.add('ENTER');
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        if (!e.metaKey && !e.ctrlKey) next.delete('META');
        if (e.key.toLowerCase() === 'k') next.delete('K');
        if (e.key === 'Tab') next.delete('TAB');
        if (e.key === 'Escape') next.delete('ESC');
        if (e.key === 'ArrowUp') next.delete('UP');
        if (e.key === 'ArrowDown') next.delete('DOWN');
        if (e.key === 'Enter') next.delete('ENTER');
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
        <Keycap
          label="⌘"
          sublabel="CTRL"
          isPressed={activeKeys.has('META')}
          onClick={onCmdKTrigger}
        />
        <Keycap
          label="K"
          sublabel="CMD"
          isPressed={activeKeys.has('K')}
          onClick={onCmdKTrigger}
        />
        <div className="w-[1px] h-8 bg-border-subtle mx-1 hidden sm:block" />
        <Keycap
          label="TAB"
          sublabel="TRAP"
          isPressed={activeKeys.has('TAB')}
        />
        <Keycap
          label="ESC"
          sublabel="POP"
          isPressed={activeKeys.has('ESC')}
        />
        <Keycap
          label="↑"
          sublabel="NAV"
          isPressed={activeKeys.has('UP')}
        />
        <Keycap
          label="↓"
          sublabel="NAV"
          isPressed={activeKeys.has('DOWN')}
        />
      </div>
      <p className="micro-label text-[10px] text-text-tertiary">
        Hardware-synchronized keycaps · Press keys on your keyboard to test
      </p>
    </div>
  );
};
