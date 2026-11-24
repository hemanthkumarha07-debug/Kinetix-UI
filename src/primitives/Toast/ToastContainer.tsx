import React, { useSyncExternalStore, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X, Undo2 } from 'lucide-react';
import { toastStore, type ToastItem, type ToastVariant } from './ToastStore';
import { useSpringTransition } from '../../context/MotionConfigContext';

interface ToastCardProps {
  toast: ToastItem;
  index: number;
  totalVisible: number;
  isStackHovered: boolean;
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, { icon: React.ReactNode; border: string; accent: string }> = {
  default: {
    icon: <Info className="w-4 h-4 text-text-secondary shrink-0" />,
    border: 'border-border-strong',
    accent: 'bg-text-tertiary',
  },
  success: {
    icon: <CheckCircle2 className="w-4 h-4 text-status-ok shrink-0" />,
    border: 'border-status-ok/30',
    accent: 'bg-status-ok',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 text-status-warn shrink-0" />,
    border: 'border-status-warn/30',
    accent: 'bg-status-warn',
  },
  error: {
    icon: <XCircle className="w-4 h-4 text-status-err shrink-0" />,
    border: 'border-status-err/30',
    accent: 'bg-status-err',
  },
};

const ToastCard = React.forwardRef<HTMLDivElement, ToastCardProps>(
  ({ toast, index, isStackHovered, onDismiss }, ref) => {
    const spring = useSpringTransition();
  const [progress, setProgress] = useState(1);
  const remainingTimeRef = useRef(toast.duration || 5000);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    let animId: number;

    const tick = (now: number) => {
      if (!isStackHovered) {
        if (lastTickRef.current !== null) {
          const delta = now - lastTickRef.current;
          remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
          setProgress(remainingTimeRef.current / (toast.duration || 5000));

          if (remainingTimeRef.current <= 0) {
            onDismiss(toast.id);
            return;
          }
        }
        lastTickRef.current = now;
      } else {
        lastTickRef.current = null;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [toast.id, toast.duration, isStackHovered, onDismiss]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
      onDismiss(toast.id);
    }
  };

  // Stack geometry calculations:
  // Stacked: index 0: y=0, scale=1, opacity=1; index 1: y=-12, scale=0.95, opacity=0.85; index 2: y=-24, scale=0.9, opacity=0.65
  // Hover fan-out: vertical spacing with 10px gaps
  const cardHeight = 72;
  const gap = 10;

  const stackedY = -index * 12;
  const stackedScale = 1 - index * 0.05;
  const stackedOpacity = 1 - index * 0.18;

  const fannedY = -index * (cardHeight + gap);
  const fannedScale = 1;
  const fannedOpacity = 1;

  const currentY = isStackHovered ? fannedY : stackedY;
  const currentScale = isStackHovered ? fannedScale : stackedScale;
  const currentOpacity = isStackHovered ? fannedOpacity : stackedOpacity;
  const zIndex = 50 - index;

  const styleConfig = variantStyles[toast.variant || 'default'];

  return (
    <motion.div
      ref={ref}
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.6, right: 0.6 }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{
        opacity: currentOpacity,
        y: currentY,
        scale: currentScale,
        x: 0,
      }}
      exit={{ opacity: 0, x: 120, scale: 0.85 }}
      transition={spring}
      style={{
        zIndex,
        boxShadow:
          '0 0 0 1px var(--border-subtle), 0 12px 24px -6px rgba(0, 0, 0, 0.6), var(--specular-top)',
      }}
      className={`absolute bottom-0 right-0 w-full sm:w-88 rounded-xl border bg-surface ${styleConfig.border} text-text-primary p-3.5 select-none cursor-grab active:cursor-grabbing overflow-hidden`}
    >
      <div className="flex items-start gap-3">
        {styleConfig.icon}

        <div className="flex-1 min-w-0 pr-1">
          <div className="text-sm font-medium tracking-tight text-text-primary truncate">
            {toast.title}
          </div>
          {toast.description && (
            <div className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
              {toast.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {toast.onUndo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast.onUndo?.();
                onDismiss(toast.id);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-surface-elevated hover:bg-surface-active text-text-primary border border-border-strong text-xs font-medium transition-colors"
              aria-label="Undo action"
            >
              <Undo2 className="w-3 h-3 text-accent-signal" />
              <span>{toast.undoLabel || 'Undo'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(toast.id);
            }}
            className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2px Hairline Progress Bar along Bottom Edge */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border-subtle overflow-hidden">
          <div
            className={`h-full ${styleConfig.accent} transition-all ease-linear`}
            style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
          />
        </div>
      )}
    </motion.div>
  );
});

ToastCard.displayName = 'ToastCard';

export const ToastContainer: React.FC = () => {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot);
  const [isHovered, setIsHovered] = useState(false);

  // Show up to 3 visible toasts in the stack
  const visibleToasts = toasts.slice(0, 3);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 pointer-events-auto h-24 sm:w-88 flex items-end justify-end"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toastItem, index) => (
          <ToastCard
            key={toastItem.id}
            toast={toastItem}
            index={index}
            totalVisible={visibleToasts.length}
            isStackHovered={isHovered}
            onDismiss={toastStore.dismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
