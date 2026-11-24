import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export interface UseFocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
  options: UseFocusTrapOptions
) {
  const { isActive, onEscape, initialFocusRef, restoreFocus = true } = options;
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // Set initial focus
    const focusTimer = requestAnimationFrame(() => {
      if (initialFocusRef?.current && container.contains(initialFocusRef.current)) {
        initialFocusRef.current.focus();
      } else {
        const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        const visibleFocusables = Array.from(focusables).filter(
          (el) => el.offsetParent !== null || el.getClientRects().length > 0
        );
        if (visibleFocusables.length > 0) {
          visibleFocusables[0].focus();
        } else {
          container.focus();
        }
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (onEscape) {
          event.preventDefault();
          event.stopPropagation();
          onEscape();
        }
        return;
      }

      if (event.key !== 'Tab') return;

      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const rawFocusables = currentContainer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const focusables = Array.from(rawFocusables).filter(
        (el) => el.offsetParent !== null || el.getClientRects().length > 0
      );

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];
      const currentActive = document.activeElement;

      if (event.shiftKey) {
        if (currentActive === firstElement || !currentContainer.contains(currentActive)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (currentActive === lastElement || !currentContainer.contains(currentActive)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      cancelAnimationFrame(focusTimer);
      document.removeEventListener('keydown', handleKeyDown, true);

      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isActive, onEscape, initialFocusRef, restoreFocus, containerRef]);
}
