import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { X, GripVertical } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useSpringTransition } from '../../context/MotionConfigContext';
import { useModalContext } from '../../context/ModalContext';

export interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'md',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`drawer-title-${Math.random().toString(36).substring(2, 9)}`).current;
  const descId = useRef(`drawer-desc-${Math.random().toString(36).substring(2, 9)}`).current;
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

  const widthClass = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[width];

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged right past 100px or flicked at velocity > 400px/s, dismiss drawer
    if (info.offset.x > 100 || info.velocity.x > 400) {
      onClose();
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
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

          {/* Drawer Panel */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.6 }}
            onDragEnd={handleDragEnd}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={spring}
            className={`relative w-full ${widthClass} h-full border-l border-border-strong bg-surface text-text-primary shadow-2xl flex flex-col z-10`}
            style={{
              boxShadow: '-12px 0 32px -8px rgba(0, 0, 0, 0.75), var(--specular-top)',
            }}
          >
            {/* Left Edge Drag Pill Handle */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-6 h-14 bg-surface-elevated border border-border-strong rounded-l-md flex items-center justify-center cursor-grab active:cursor-grabbing text-text-tertiary hover:text-text-primary transition-colors shadow-md"
              title="Drag right to close"
              aria-label="Drag handle to dismiss drawer"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Top Specular Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-border-subtle bg-surface">
              <div className="space-y-1 pr-4">
                {title && (
                  <h2 id={titleId} className="text-lg font-semibold text-text-primary tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} className="text-xs text-text-secondary leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

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
