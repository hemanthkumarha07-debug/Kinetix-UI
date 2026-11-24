import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
import { useSpringTransition } from '../context/MotionConfigContext';

export interface A11yMonitorProps {
  isVisible: boolean;
  onClose: () => void;
}

export const A11yMonitor: React.FC<A11yMonitorProps> = ({ isVisible, onClose }) => {
  const spring = useSpringTransition();
  const [activeElementTag, setActiveElementTag] = useState<string>('BODY');
  const [activeRole, setActiveRole] = useState<string>('none');
  const [activeAriaExpanded, setActiveAriaExpanded] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState<string>('none');
  const [lastKeyPressed, setLastKeyPressed] = useState<string>('None');

  useEffect(() => {
    const updateFocusInfo = () => {
      const el = document.activeElement;
      if (el) {
        setActiveElementTag(el.tagName.toLowerCase());
        setActiveRole(el.getAttribute('role') || 'implicit');
        setActiveAriaExpanded(el.getAttribute('aria-expanded'));
        setTabIndex(el.getAttribute('tabindex') ?? (el.tagName === 'INPUT' || el.tagName === 'BUTTON' ? '0' : 'none'));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setLastKeyPressed(e.key);
      requestAnimationFrame(updateFocusInfo);
    };

    document.addEventListener('focusin', updateFocusInfo);
    document.addEventListener('focusout', updateFocusInfo);
    window.addEventListener('keydown', handleKeyDown);

    updateFocusInfo();

    return () => {
      document.removeEventListener('focusin', updateFocusInfo);
      document.removeEventListener('focusout', updateFocusInfo);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={spring}
          className="hidden sm:block fixed bottom-6 left-6 z-40 w-72 rounded-xl border border-border-strong bg-surface/95 backdrop-blur-md text-text-primary shadow-dropdown p-3 text-xs"
          style={{
            boxShadow:
              '0 0 0 1px var(--border-subtle), 0 16px 32px -8px rgba(0, 0, 0, 0.75), var(--specular-top)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-accent-signal font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span className="micro-label">A11y Telemetry HUD</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-0.5 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
              aria-label="Close A11y HUD"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Telemetry Rows */}
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">Active Target:</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-elevated text-accent border border-border-subtle">
                &lt;{activeElementTag}&gt;
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">WAI-ARIA Role:</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-elevated text-status-ok border border-border-subtle font-medium">
                {activeRole}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">aria-expanded:</span>
              <span className="text-text-secondary">
                {activeAriaExpanded !== null ? String(activeAriaExpanded) : 'n/a'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-tertiary">tabindex:</span>
              <span className="text-text-secondary">{tabIndex}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border-subtle pt-1.5 mt-1.5">
              <span className="text-text-tertiary">Last Key Press:</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-active text-text-primary border border-border-strong font-bold">
                {lastKeyPressed}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
