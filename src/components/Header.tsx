import React from 'react';
import { Search, Terminal } from 'lucide-react';
import { ThemeToggle } from '../primitives/ViewTransitionThemeToggle/ThemeToggle';

export interface HeaderProps {
  onOpenCmdK: () => void;
  isA11yHudOpen: boolean;
  onToggleA11yHud: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCmdK,
  isA11yHudOpen,
  onToggleA11yHud,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border-subtle bg-canvas/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logomark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 text-text-primary hover:opacity-90 transition-opacity"
            aria-label="KinetixUI Home"
          >
            {/* Minimal geometric KinetixUI logomark */}
            <div className="w-7 h-7 rounded-lg border border-border-strong bg-surface flex items-center justify-center shadow-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-signal"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-sm tracking-tight">Kinetix</span>
              <span className="text-xs font-mono text-text-tertiary">UI</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-border-subtle text-xs">
            <a
              href="#primitives"
              className="px-2.5 py-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              Primitives
            </a>
            <a
              href="#command-palette"
              className="px-2.5 py-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              Command
            </a>
            <a
              href="#dialog-drawer"
              className="px-2.5 py-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              Modals
            </a>
            <a
              href="#toast-stack"
              className="px-2.5 py-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              Toasts
            </a>
            <a
              href="#combobox"
              className="px-2.5 py-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              Combobox
            </a>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Command Palette Button */}
          <button
            type="button"
            onClick={onOpenCmdK}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-strong bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs transition-colors shadow-sm"
            style={{ boxShadow: 'var(--specular-top)' }}
            aria-label="Open Command Palette (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="hidden sm:inline">Search primitives...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="micro-label px-1 py-0.5 rounded border border-border-subtle bg-surface-elevated text-[10px] text-text-tertiary">
              ⌘K
            </kbd>
          </button>

          {/* Toggle A11y HUD */}
          <button
            type="button"
            onClick={onToggleA11yHud}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isA11yHudOpen
                ? 'border-accent-signal bg-accent-signal/10 text-accent-signal'
                : 'border-border-strong bg-surface hover:bg-surface-elevated text-text-tertiary hover:text-text-primary'
            }`}
            title="Toggle Live A11y Telemetry HUD"
            aria-label="Toggle Live A11y Telemetry HUD"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Circular Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
