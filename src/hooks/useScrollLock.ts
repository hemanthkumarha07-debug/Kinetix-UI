import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export function useScrollLock(lock: boolean = true) {
  useEffect(() => {
    if (!lock) return;

    if (lockCount === 0) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      const currentPaddingRight = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    }

    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [lock]);
}
