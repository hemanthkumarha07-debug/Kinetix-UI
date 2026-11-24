import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useSpringTransition } from '../../context/MotionConfigContext';
import { useModalContext } from '../../context/ModalContext';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`dialog-title-${Math.random().toString(36).substring(2, 9)}`).current;
  const descId = useRef(`dialog-desc-${Math.random().toString(36).substring(2, 9)}`).current;
  const spring = useSpringTransition();
  const { registerModal } = useModalContext();

  useScrollLock(isOpen);
  useFocusTrap(containerRef, {
    isActive: isOpen,
    onEscape: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      const unregister = registerModal();
      return unregister;
    }
  }, [isOpen, registerModal]);

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={spring}
            className={`relative w-full ${maxWidthClass} rounded-2xl border border-border-strong bg-surface text-text-primary overflow-hidden z-10`}
            style={{
              boxShadow: '0 0 0 1px var(--border-subtle), 0 24px 48px -12px rgba(0, 0, 0, 0.75), var(--specular-top)',
            }}
          >
            {/* Top Specular Catch */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between px-6 pt-6 pb-2">
                <div className="space-y-1 pr-4">
                  {title && (
                    <h2 id={titleId} className="text-lg font-semibold text-text-primary tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="text-sm text-text-secondary leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-surface-elevated">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
