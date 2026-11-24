import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, CornerDownLeft, ArrowLeft } from 'lucide-react';
import { fuzzyMatch } from './fuzzyMatch';
import type { CommandItem, CommandPage } from './types';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useSpringTransition } from '../../context/MotionConfigContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Record<string, CommandPage>;
  initialPageId?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  pages,
  initialPageId = 'root',
}) => {
  const [pageStack, setPageStack] = useState<string[]>([initialPageId]);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const spring = useSpringTransition();

  // Reset stack and query when reopened
  useEffect(() => {
    if (isOpen) {
      setPageStack([initialPageId]);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen, initialPageId]);

  useScrollLock(isOpen);
  useFocusTrap(containerRef, {
    isActive: isOpen,
    onEscape: () => {
      if (pageStack.length > 1) {
        setSlideDirection(-1);
        setPageStack((prev) => prev.slice(0, -1));
        setQuery('');
      } else {
        onClose();
      }
    },
    initialFocusRef: inputRef,
  });

  const currentPageId = pageStack[pageStack.length - 1];
  const currentPage = pages[currentPageId] || pages[initialPageId];

  // Filter items based on fuzzy search
  const filteredResults = useMemo(() => {
    if (!currentPage) return [];

    const results = currentPage.items.map((item) => {
      const titleMatch = fuzzyMatch(query, item.title);
      const descMatch = item.description ? fuzzyMatch(query, item.description) : { isMatch: false, score: 0, matchedIndices: [] };
      const keywordMatches = item.keywords?.map((k) => fuzzyMatch(query, k)) || [];
      const bestKeyword = keywordMatches.reduce((best, cur) => (cur.score > best.score ? cur : best), { isMatch: false, score: 0, matchedIndices: [] });

      const isMatch = titleMatch.isMatch || descMatch.isMatch || bestKeyword.isMatch;
      const score = Math.max(
        titleMatch.score,
        descMatch.score * 0.7,
        bestKeyword.score * 0.8
      );

      return {
        item,
        isMatch,
        score,
        titleMatchedIndices: titleMatch.matchedIndices,
      };
    });

    return results
      .filter((r) => r.isMatch)
      .sort((a, b) => b.score - a.score);
  }, [currentPage, query]);

  // Clamp selection index
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, currentPageId]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.childrenPageId && pages[item.childrenPageId]) {
        setSlideDirection(1);
        setPageStack((prev) => [...prev, item.childrenPageId!]);
        setQuery('');
      } else {
        item.onSelect?.();
        onClose();
      }
    },
    [pages, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length === 0 ? 0 : (prev + 1) % filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length === 0 ? 0 : (prev - 1 + filteredResults.length) % filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].item);
      }
    } else if (e.key === 'Backspace' && query === '' && pageStack.length > 1) {
      e.preventDefault();
      setSlideDirection(-1);
      setPageStack((prev) => prev.slice(0, -1));
    }
  };

  // Scroll active descendant into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const renderHighlightedText = (text: string, matchedIndices: number[]) => {
    if (!matchedIndices || matchedIndices.length === 0) {
      return <span>{text}</span>;
    }
    const indexSet = new Set(matchedIndices);
    return (
      <span>
        {text.split('').map((char, i) => (
          indexSet.has(i) ? (
            <span key={i} className="font-semibold text-text-primary underline decoration-accent-signal decoration-2 underline-offset-2">
              {char}
            </span>
          ) : (
            <span key={i} className="text-text-secondary">
              {char}
            </span>
          )
        ))}
      </span>
    );
  };

  if (!isOpen) return null;

  const activeItemId = filteredResults[selectedIndex]?.item.id;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] sm:pt-[16vh] px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -4 }}
          transition={spring}
          className="relative w-full max-w-xl rounded-xl border border-border-strong bg-surface text-text-primary shadow-dropdown overflow-hidden z-10 flex flex-col max-h-[75vh]"
          style={{
            boxShadow: '0 0 0 1px var(--border-subtle), 0 24px 48px -12px rgba(0, 0, 0, 0.75), var(--specular-top)',
          }}
        >
          {/* Top Specular Shimmer */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Search Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle bg-surface">
            {pageStack.length > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setSlideDirection(-1);
                  setPageStack((prev) => prev.slice(0, -1));
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-text-tertiary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                aria-label="Back to previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="micro-label">{currentPage.breadcrumb || 'Back'}</span>
              </button>
            ) : (
              <Search className="w-4 h-4 text-text-tertiary shrink-0" />
            )}

            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="command-palette-list"
              aria-activedescendant={activeItemId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentPage.placeholder || 'Type a command or search...'}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {/* Live Monospace Count Badge */}
            <div className="micro-label px-2 py-0.5 rounded border border-border-subtle bg-surface-elevated text-text-tertiary tabular">
              {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
            </div>
          </div>

          {/* Page Content with Slide Transition */}
          <div className="overflow-hidden relative flex-1 min-h-[140px] max-h-[380px]">
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={currentPageId}
                custom={slideDirection}
                initial={{ opacity: 0, x: slideDirection * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -slideDirection * 24 }}
                transition={spring}
                className="w-full h-full overflow-y-auto p-2"
              >
                {filteredResults.length === 0 ? (
                  <div className="py-12 text-center text-sm text-text-tertiary">
                    No matching commands found.
                  </div>
                ) : (
                  <ul
                    ref={listRef}
                    id="command-palette-list"
                    role="listbox"
                    aria-label="Commands"
                    className="space-y-1"
                  >
                    {filteredResults.map(({ item, titleMatchedIndices }, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <li
                          key={item.id}
                          id={item.id}
                          data-index={index}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-surface-active text-text-primary'
                              : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.icon && (
                              <span className={`shrink-0 ${isSelected ? 'text-accent-signal' : 'text-text-tertiary group-hover:text-text-secondary'}`}>
                                {item.icon}
                              </span>
                            )}
                            <div className="truncate">
                              <div className="font-medium truncate">
                                {renderHighlightedText(item.title, titleMatchedIndices)}
                              </div>
                              {item.description && (
                                <div className="text-xs text-text-tertiary truncate">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {item.childrenPageId && (
                              <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-primary" />
                            )}
                            {item.shortcut && (
                              <div className="flex items-center gap-1">
                                {item.shortcut.map((sc, i) => (
                                  <kbd
                                    key={i}
                                    className="micro-label px-1.5 py-0.5 rounded border border-border-strong bg-surface text-text-tertiary tabular"
                                  >
                                    {sc}
                                  </kbd>
                                ))}
                              </div>
                            )}
                            {isSelected && !item.childrenPageId && (
                              <CornerDownLeft className="w-3.5 h-3.5 text-text-tertiary ml-1 opacity-70" />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Physical Bottom Keycaps Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border-subtle bg-surface-elevated text-xs text-text-tertiary">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="micro-label px-1 py-0.5 rounded border border-border-strong bg-surface">↑↓</kbd>
                <span className="text-[11px]">Navigate</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="micro-label px-1 py-0.5 rounded border border-border-strong bg-surface">↵</kbd>
                <span className="text-[11px]">Select</span>
              </span>
              {pageStack.length > 1 && (
                <span className="inline-flex items-center gap-1">
                  <kbd className="micro-label px-1 py-0.5 rounded border border-border-strong bg-surface">⌫</kbd>
                  <span className="text-[11px]">Back</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <kbd className="micro-label px-1 py-0.5 rounded border border-border-strong bg-surface">ESC</kbd>
              <span className="text-[11px]">Close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
